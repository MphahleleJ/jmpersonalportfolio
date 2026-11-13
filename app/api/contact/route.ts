import nodemailer from "nodemailer";
import { verifyChallenge } from "@/lib/captcha";

// Contact form endpoint used by components/ContactForm.tsx.
// Required env vars (see .env): CONTACT_TO_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a hidden field real visitors never fill in. Pretend success for bots.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) return Response.json({ error: "Please fill in your name, email and message." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });

  const check = verifyChallenge(body.token, body.answer);
  if (!check.ok) return Response.json({ error: check.reason, newChallenge: true }, { status: 400 });

  // Next.js loads these automatically from the .env file in the project's root folder
  // (next to package.json). Restart "npm run dev" after editing .env.
  const { CONTACT_TO_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL } = process.env;
  const missing = Object.entries({ CONTACT_TO_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS })
    .filter(([, v]) => !v || !v.trim())
    .map(([k]) => k);
  if (missing.length) {
    console.error(`Contact form: missing in .env: ${missing.join(", ")}. Check .env is in the project root (next to package.json) and restart the server.`);
    return Response.json({ error: "The contact form isn't set up yet. Please try again later." }, { status: 500 });
  }
  if (SMTP_PASS!.startsWith("REPLACE_WITH")) {
    console.error("Contact form: SMTP_PASS in .env is still the placeholder. Add your Gmail App password.");
    return Response.json({ error: "The contact form isn't set up yet. Please try again later." }, { status: 500 });
  }

  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio contact form" <${CONTACT_FROM_EMAIL || SMTP_USER}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `New message from ${name} via your portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return Response.json({ error: "Sorry, your message couldn't be sent. Please try again later." }, { status: 500 });
  }
}

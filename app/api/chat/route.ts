import Anthropic from "@anthropic-ai/sdk";
import { site, profile, about, leadership, projectsIntro, projects, testimonials, chatbotNotes, chatbotOfflineMessage } from "@/data/profile";

// Chatbot endpoint used by components/ChatWidget.tsx.
// Set ANTHROPIC_API_KEY (and optionally CHAT_MODEL) in your environment to enable real AI replies.
// To use a different provider, replace the body of `generateReply` below.

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are a friendly assistant on ${profile.name}'s portfolio website.
Answer visitors' questions about ${profile.name} using only the information below. Keep replies short (2-4 sentences).
If you don't know something, say so and suggest using the contact form on this page. Never invent facts.

Role: ${profile.role}
Tagline: ${profile.tagline}
Location: ${profile.location}
About: ${about.paragraphs.join(" ")}
Credential: ${profile.credential}
Leadership: ${leadership.areas.map((a) => `${a.area}: ${a.text}`).join("; ")}
Technical background: ${projectsIntro.intro}
Projects: ${projects.map((p) => `${p.title} (${p.tags.join(", ")}): ${p.description}`).join(" | ")}
${site.showTestimonials ? `Testimonials: ${testimonials.map((t) => `"${t.quote}" (${t.name}, ${t.title})`).join(" | ")}` : ""}
Notes: ${chatbotNotes}`;

async function generateReply(messages: Msg[]): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return chatbotOfflineMessage;
  }
  const client = new Anthropic();
  const res = await client.messages.create({
    model: process.env.CHAT_MODEL || "claude-sonnet-5-5",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages,
  });
  return res.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw: unknown[] = Array.isArray(body?.messages) ? body.messages : [];
    // Basic validation and limits to keep costs and abuse in check.
    const messages: Msg[] = raw
      .filter((m): m is Msg => !!m && typeof m === "object" && ["user", "assistant"].includes((m as Msg).role) && typeof (m as Msg).content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length) return Response.json({ error: "No message provided." }, { status: 400 });

    const reply = await generateReply(messages);
    return Response.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return Response.json({ error: "Sorry, the assistant is unavailable right now." }, { status: 500 });
  }
}

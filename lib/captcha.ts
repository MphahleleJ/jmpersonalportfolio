import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// Simple "what is a + b?" bot check.
// The server signs the correct answer, so the browser never sees it and it can't be faked.

const TTL_MS = 30 * 60 * 1000; // challenge valid for 30 minutes
const MIN_MS = 3 * 1000; // humans take at least a few seconds to fill the form

// Best-effort replay protection: each solved question can be used once (per server instance).
const used = new Map<string, number>();

let fallbackSecret: string | undefined;
function secret() {
  if (process.env.CONTACT_FORM_SECRET) return process.env.CONTACT_FORM_SECRET;
  // Works for local dev; set CONTACT_FORM_SECRET in production (serverless instances don't share memory).
  fallbackSecret ??= randomBytes(32).toString("hex");
  return fallbackSecret;
}

function sign(answer: number, issuedAt: number, nonce: string) {
  return createHmac("sha256", secret()).update(`${answer}:${issuedAt}:${nonce}`).digest("hex");
}

export function createChallenge() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const issuedAt = Date.now();
  const nonce = randomBytes(8).toString("hex");
  return { a, b, token: `${issuedAt}.${nonce}.${sign(a + b, issuedAt, nonce)}` };
}

export function verifyChallenge(token: unknown, answer: unknown): { ok: true } | { ok: false; reason: string } {
  if (typeof token !== "string") return { ok: false, reason: "Missing security check. Please reload the page." };
  const [issuedStr, nonce, sig] = token.split(".");
  const issuedAt = Number(issuedStr);
  if (!issuedAt || !nonce || !sig) return { ok: false, reason: "Invalid security check. Please reload the page." };
  const age = Date.now() - issuedAt;
  if (age > TTL_MS) return { ok: false, reason: "The security question expired. Please try the new one." };
  if (age < MIN_MS) return { ok: false, reason: "That was a bit fast. Please try again." };
  const n = Number(String(answer ?? "").trim());
  if (!Number.isInteger(n)) return { ok: false, reason: "Please answer the addition question." };
  const expected = Buffer.from(sign(n, issuedAt, nonce), "hex");
  const given = Buffer.from(sig, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "The answer to the addition question is incorrect." };
  }
  if (used.has(nonce)) return { ok: false, reason: "This security question was already used. Please answer the new one." };
  for (const [k, t] of used) if (Date.now() - t > TTL_MS) used.delete(k);
  used.set(nonce, issuedAt);
  return { ok: true };
}

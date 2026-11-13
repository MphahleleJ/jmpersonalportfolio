"use client";

import { useCallback, useEffect, useState } from "react";

type Challenge = { a: number; b: number; token: string };
type Status = { kind: "idle" | "sending" | "sent" | "error"; text?: string };

const field =
  "w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-white placeholder-stone-500 outline-none focus:border-indigo-400";

export default function ContactForm() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const loadChallenge = useCallback(async () => {
    try {
      const res = await fetch("/api/contact/challenge", { cache: "no-store" });
      setChallenge(await res.json());
    } catch {
      setChallenge(null);
    }
  }, []);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token: challenge?.token }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", text: json.error ?? "Something went wrong." });
        if (json.newChallenge) {
          (form.elements.namedItem("answer") as HTMLInputElement).value = "";
          loadChallenge();
        }
        return;
      }
      form.reset();
      setStatus({ kind: "sent", text: "Thanks! Your message has been sent. I'll get back to you soon." });
      loadChallenge();
    } catch {
      setStatus({ kind: "error", text: "Couldn't reach the server. Please try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-xl space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-stone-300">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-stone-300">Email address</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm text-stone-300">Message</span>
        <textarea name="message" required maxLength={5000} rows={5} placeholder="How can I help?" className={field} />
      </label>

      {/* Honeypot: hidden from people, bots tend to fill it in */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <label className="block">
        <span className="mb-1 block text-sm text-stone-300">
          Quick check: what is{" "}
          <strong className="text-white">{challenge ? `${challenge.a} + ${challenge.b}` : "…"}</strong>?
        </span>
        <input name="answer" required inputMode="numeric" pattern="[0-9]*" maxLength={3} placeholder="Answer" className={`${field} sm:w-40`} />
      </label>

      <button
        type="submit"
        disabled={status.kind === "sending" || !challenge}
        className="w-full rounded-full bg-indigo-500 px-8 py-3 font-medium text-white hover:bg-indigo-400 disabled:opacity-50 sm:w-auto"
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>

      {status.text && (
        <p role="status" className={status.kind === "sent" ? "text-emerald-400" : "text-rose-400"}>
          {status.text}
        </p>
      )}
    </form>
  );
}

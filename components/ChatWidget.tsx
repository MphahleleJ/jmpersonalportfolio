"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Hi! I'm ${profile.name.split(" ")[0]}'s assistant. Ask me about their experience, leadership, projects or how to get in touch.` },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  // Lets the Azure agent remember earlier questions in this chat
  const conversationId = useRef<string | undefined>(undefined);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Skip the canned greeting; the API expects the conversation to start with the visitor.
        body: JSON.stringify({ messages: next.slice(1), conversationId: conversationId.current }),
      });
      const data = await res.json();
      if (data.conversationId) conversationId.current = data.conversationId;
      setMessages([...next, { role: "assistant", content: data.reply ?? data.error ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, I couldn't reach the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200">
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">Chat with my assistant</p>
              <p className="text-xs text-indigo-100">Usually replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 text-xl leading-none hover:bg-indigo-500">×</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-stone-100 text-stone-800"}`}>
                  {m.content}
                </p>
              </div>
            ))}
            {loading && <p className="text-sm text-stone-400">Typing…</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-stone-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              maxLength={1000}
              className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button disabled={loading || !input.trim()} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Send</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 hover:bg-indigo-700"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}

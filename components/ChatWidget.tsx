"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type Msg = { role: "user" | "assistant"; content: string };
type Size = { w: number; h: number };

// Chat window size limits (in pixels) for resizing on larger screens
const MIN: Size = { w: 300, h: 360 };
const MAX: Size = { w: 720, h: 900 };
const DEFAULT: Size = { w: 352, h: 448 };
const STORAGE_KEY = "chat-size";

function clamp(size: Size): Size {
  // Keep a margin around the window (bottom-right offset + launcher button)
  const maxW = Math.min(MAX.w, window.innerWidth - 40);
  const maxH = Math.min(MAX.h, window.innerHeight - 120);
  return {
    w: Math.round(Math.max(MIN.w, Math.min(size.w, maxW))),
    h: Math.round(Math.max(MIN.h, Math.min(size.h, maxH))),
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Feel free to interview me. Ask me anything about my professional background, work experience, skills, and career journey. I'm ready for your questions!" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  // Lets the Azure agent remember earlier questions in this chat
  const conversationId = useRef<string | undefined>(undefined);

  // Resizing (desktop and tablet only; on phones the window keeps its fixed size)
  const [size, setSize] = useState<Size>(DEFAULT);
  const [resizable, setResizable] = useState(false);
  const drag = useRef<{ x: number; y: number; start: Size } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setResizable(mq.matches);
    update();
    mq.addEventListener("change", update);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved.w === "number" && typeof saved.h === "number") setSize(clamp(saved));
    } catch {}
    const onResize = () => setSize((s) => clamp(s));
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function startResize(e: React.PointerEvent) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: size };
  }
  function onResizeMove(e: React.PointerEvent) {
    if (!drag.current) return;
    // The window is anchored bottom-right, so dragging the top-left corner up/left makes it bigger
    const { x, y, start } = drag.current;
    setSize(clamp({ w: start.w + (x - e.clientX), h: start.h + (y - e.clientY) }));
  }
  function endResize() {
    if (!drag.current) return;
    drag.current = null;
    setSize((s) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    });
  }
  function resizeWithKeys(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 40 : 16;
    const d: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (!d[e.key]) return;
    e.preventDefault();
    const next = clamp({ w: size.w + d[e.key][0], h: size.h + d[e.key][1] });
    setSize(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  function resetSize() {
    setSize(clamp(DEFAULT));
    localStorage.removeItem(STORAGE_KEY);
  }

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
        <div
          style={resizable ? { width: size.w, height: size.h } : undefined}
          className="relative flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200"
        >
          {resizable && (
            <div
              role="separator"
              aria-label="Resize chat window. Drag, or use the arrow keys. Double-click to reset."
              aria-orientation="horizontal"
              tabIndex={0}
              title="Drag to resize (double-click to reset)"
              onPointerDown={startResize}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              onDoubleClick={resetSize}
              onKeyDown={resizeWithKeys}
              className="absolute left-0 top-0 z-10 flex h-6 w-6 cursor-nwse-resize touch-none items-start justify-start rounded-br-lg p-1 text-indigo-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
                <path d="M1 9 9 1M1 5 5 1" />
              </svg>
            </div>
          )}
          <div className="flex items-center justify-between bg-indigo-600 py-3 pl-6 pr-4 text-white">
            <div>
              <p className="font-semibold">Interview Me</p>
              <p className="text-xs text-indigo-100">Usually I reply instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 text-xl leading-none hover:bg-indigo-500">×</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-stone-100 text-stone-800"}`}>
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

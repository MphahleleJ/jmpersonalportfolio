"use client";

import { useEffect, useState } from "react";
import { profile, site } from "@/data/profile";

const links = [
  { href: "#about", label: "About" },
  { href: "#leadership", label: "Leadership" },
  { href: "#projects", label: "Projects" },
  ...(site.showTestimonials ? [{ href: "#testimonials", label: "Testimonials" }] : []),
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu with Escape, or when the screen grows to desktop size
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="text-lg font-bold text-stone-900" onClick={() => setOpen(false)}>
          {profile.name.split(" ")[0]}<span className="text-indigo-600">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden gap-8 text-sm font-medium text-stone-600 md:flex">
          {links.map((l) => (
            <li key={l.href}><a href={l.href} className="hover:text-indigo-600">{l.label}</a></li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 sm:inline-block">Get in touch</a>

          {/* Hamburger button (mobile only) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-800 hover:bg-stone-200/70 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div id="mobile-menu" className={`border-t border-stone-200 bg-stone-50 md:hidden ${open ? "block" : "hidden"}`}>
        <ul className="mx-auto max-w-6xl px-6 py-3">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-medium text-stone-700 hover:bg-indigo-50 hover:text-indigo-700">
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-2 pb-2">
            <a href="#contact" onClick={() => setOpen(false)} className="block rounded-full bg-stone-900 px-4 py-3 text-center font-medium text-white hover:bg-indigo-600">
              Get in touch
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

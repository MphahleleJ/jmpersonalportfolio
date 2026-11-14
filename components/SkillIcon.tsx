// Simple outline icons for the "How I lead" and Projects cards. Add more by adding a new key below.
const paths: Record<string, React.ReactNode> = {
  // compass: strategy & advisory
  strategy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  // cloud with spark: digital transformation
  transformation: (
    <>
      <path d="M7 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.75 4.75 0 0 1-.5 9.5z" />
      <path d="m12.5 11-2 3h3l-2 3" />
    </>
  ),
  // shield with check: governance, risk & compliance
  governance: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // people: team leadership & delivery
  team: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
      <circle cx="4.5" cy="9.5" r="2" />
      <path d="M1.5 19v-.5a3.5 3.5 0 0 1 4-3.45" />
      <circle cx="19.5" cy="9.5" r="2" />
      <path d="M22.5 19v-.5a3.5 3.5 0 0 0-4-3.45" />
    </>
  ),
};

// Project icons
paths.website = (
  <>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    <path d="M2.5 8.5h19" />
    <circle cx="5.5" cy="6.25" r=".4" fill="currentColor" />
    <circle cx="7.5" cy="6.25" r=".4" fill="currentColor" />
    <circle cx="9.5" cy="6.25" r=".4" fill="currentColor" />
    <path d="m9.5 12-2.5 2.5 2.5 2.5" />
    <path d="m14.5 12 2.5 2.5-2.5 2.5" />
  </>
);
// chat bubble with AI sparkle
paths.chatbot = (
  <>
    <path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4 20.5l1.4-4.4A7.5 7.5 0 1 1 20 12.5z" />
    <path d="M12.5 8.5 13.3 10.7 15.5 11.5 13.3 12.3 12.5 14.5 11.7 12.3 9.5 11.5 11.7 10.7z" />
  </>
);

export default function SkillIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name] ?? paths.strategy}
    </svg>
  );
}

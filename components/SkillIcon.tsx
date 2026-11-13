// Simple outline icons for the "How I lead" cards. Add more by adding a new key below.
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

export default function SkillIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name] ?? paths.strategy}
    </svg>
  );
}

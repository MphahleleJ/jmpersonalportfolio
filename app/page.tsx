import Image from "next/image";
import Nav from "@/components/Nav";
import Section from "@/components/Section";
import ChatWidget from "@/components/ChatWidget";
import ContactForm from "@/components/ContactForm";
import SkillIcon from "@/components/SkillIcon";
import { site, profile, about, leadership, projectsIntro, projects, testimonials, contact } from "@/data/profile";

// Column classes by item count, so rows are always full and evenly aligned.
const statCols: Record<number, string> = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };
const cardCols: Record<number, string> = { 1: "max-w-md", 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };
const cols = (map: Record<number, string>, n: number) => map[Math.min(n, 4)] ?? map[4];

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* ── Hero with portrait ── */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-12 pt-12 sm:pt-20 md:grid-cols-2 md:gap-16 md:pt-28">
            <div className="relative text-center md:text-left">
              <p className="text-lg font-semibold text-indigo-600">{profile.greeting}</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">{profile.name}</h1>
              <p className="mt-3 text-xl font-semibold text-stone-700">{profile.role}</p>
              <p className="mt-2 text-stone-500">{profile.credential}</p>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-stone-600 md:mx-0">{profile.tagline}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <a href="#projects" className="rounded-full bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700">View my work</a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 px-6 py-3 font-medium text-stone-800 hover:border-indigo-600 hover:text-indigo-600">LinkedIn ↗</a>
              </div>
            </div>
            <div className="relative order-first mx-auto w-60 sm:w-80 md:order-none md:ml-auto md:mr-0 lg:w-96">
              <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-pink-400 opacity-80" />
              <Image
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                width={800}
                height={800}
                priority
                unoptimized={profile.portrait.endsWith(".svg")}
                className="relative aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
              />
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
            <dl className={`grid gap-6 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200 sm:p-8 sm:text-left ${cols(statCols, profile.stats.length)}`}>
              {profile.stats.map((s) => (
                <div key={s.label} className="flex flex-col border-stone-200 sm:border-l sm:pl-8 sm:first:border-0 sm:first:pl-0">
                  <dt className="order-2 mt-1 text-sm text-stone-500">{s.label}</dt>
                  <dd className="order-1 text-3xl font-bold text-indigo-700">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── About ── */}
        <Section id="about" title={about.title} className="bg-white">
          <div className="space-y-5 text-lg leading-relaxed text-stone-600">
            {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Section>

        {/* ── Leadership ── */}
        <Section id="leadership" title={leadership.title}>
          <div className={`grid gap-6 ${cols(cardCols, leadership.areas.length)}`}>
            {leadership.areas.map((a) => (
              <div key={a.area} className="flex flex-col rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <SkillIcon name={a.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-stone-900">{a.area}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-stone-600">{a.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Projects ── */}
        <Section id="projects" title={projectsIntro.title} className="bg-white">
          <p className="-mt-4 mb-10 text-lg leading-relaxed text-stone-600">{projectsIntro.intro}</p>
          <div className={`grid gap-8 ${cols(cardCols, projects.length)}`}>
            {projects.map((p) => (
              <article key={p.title} className="group flex flex-col rounded-2xl border border-stone-200 bg-stone-50 p-6 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative mb-5 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-pink-100">
                  {p.badge && (
                    <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200">{p.badge}</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-stone-900">{p.title}</h3>
                <p className="mt-2 flex-1 text-stone-600">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => <li key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{t}</li>)}
                </ul>
                {(p.link || p.repo) && (
                  <div className="mt-5 flex gap-4 text-sm font-medium">
                    {p.link && <a href={p.link} className="text-indigo-600 hover:underline">Live demo ↗</a>}
                    {p.repo && <a href={p.repo} className="text-stone-600 hover:underline">Source ↗</a>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>

        {/* ── Testimonials (hidden until site.showTestimonials is true) ── */}
        {site.showTestimonials && (
          <Section id="testimonials" title="Testimonials">
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                  <span className="text-5xl leading-none text-indigo-300">&ldquo;</span>
                  <blockquote className="flex-1 text-stone-700">{t.quote}</blockquote>
                  <figcaption className="mt-6">
                    <p className="font-semibold text-stone-900">{t.name}</p>
                    <p className="text-sm text-stone-500">{t.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>
        )}

        {/* ── Contact ── */}
        <section id="contact" className="bg-stone-900 py-20 text-center text-white">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">{contact.title}</h2>
            <p className="mt-4 text-stone-300">{contact.body}</p>
            <ContactForm />
            <p className="mt-10 text-sm text-stone-400">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-stone-200 hover:text-indigo-300">LinkedIn ↗</a>
              <span className="mx-3">·</span>
              {profile.location}
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-stone-900 pb-10 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} {profile.name}
      </footer>
      <ChatWidget />
    </>
  );
}

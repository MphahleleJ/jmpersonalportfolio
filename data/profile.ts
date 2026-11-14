// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change everything shown on the site.
// ─────────────────────────────────────────────────────────────

export const site = {
  title: "June Mphahlele | Strategic ICT Leader",
  description:
    "Strategic ICT leader and senior manager with 20+ years across South Africa's public sector, state-owned entities and higher education, advising leaders on technology strategy and AI-enabled digital transformation.",
  // Testimonials are hidden until real ones are added below. Set to true to show them.
  showTestimonials: false,
};

export const profile = {
  name: "June Mphahlele",
  greeting: "Thobela!",
  role: "Strategic ICT Leader | Senior Manager",
  credential: "Senior Manager and Acting Head of Department, national ICT state entity",
  tagline:
    "A seasoned technology strategist who works closely with senior leaders and clients to shape and advance technology strategy, bringing over 20 years of experience across South Africa’s public and private sectors.",
  location: "Pretoria, Gauteng, South Africa",
  email: "jgivenson@gmail.com",
  linkedin: "https://www.linkedin.com/in/junemphahlele",
  // Your photo lives in /public. A square image, at least 800x800, works best.
  portrait: "/june.jpg",
  // Stats strip under the hero
  stats: [
    { value: "20+ years", label: "In ICT" },
    { value: "5+ years", label: "In leadership in both Private and Public Sector" },
  ],
};

export const about = {
  title: "About me",
  paragraphs: [
    "I am a seasoned ICT leader with more than 20 years of experience across South Africa’s public sector, state-owned entities and higher education. I currently serve as Senior Manager and Acting Head of Department at a national ICT state entity.",
    "I work closely with senior leaders and clients to shape and advance technology strategy, ensuring ICT services are aligned with organisational mandates and strategic priorities.",
    "My focus includes strengthening ICT capabilities, building high-performing teams and enabling technology-driven outcomes that deliver meaningful value. I bring extensive experience in managing risk, security and compliance across complex public- and private-sector environments.",
    "As the digital landscape continues to evolve, I am particularly interested in the role of artificial intelligence and digital transformation in reshaping organisations and the way services are delivered. I see AI as an important part of the future of ICT leadership, with a particular interest in understanding how South Africa can harness its potential to improve service delivery, strengthen institutional capabilities and create sustainable value.",
  ],
};

// "How I lead" section. icon options: "strategy" | "transformation" | "governance" | "team" (see components/SkillIcon.tsx)
export const leadership = {
  title: "Leadership",
  areas: [
    { area: "ICT Strategy & Advisory", icon: "strategy", text: "Shaping ICT strategy and working with senior leaders and clients to align technology priorities with organisational objectives." },
    { area: "Digital Transformation", icon: "transformation", text: "Digital strategy and transformation initiatives aligned with organisational mandates and strategic priorities." },
    { area: "Team Leadership & Delivery", icon: "team", text: "Building, empowering and leading high-performing teams to deliver efficient, effective and client-focused services." },
  ],
};

export const projectsIntro = {
  title: "Projects",
  intro:
    "Behind my leadership is more than 15 years of leading database-driven web application development. My technical background covers web applications, database design, solution architecture, and project delivery.",
};

export const projects: {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  badge?: string; // e.g. "Upcoming" or "Coming soon"
  icon?: string; // icon options: "website" | "chatbot" (see components/SkillIcon.tsx)
}[] = [
  {
    title: "About This Website",
    icon: "website",
    description:
      "A responsive portfolio with an AI chatbot that answers visitor questions, and a contact form with a bot check that sends messages to my inbox. Partly built using AI prompting.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Claude AI", "Nodemailer", "Microsoft Azure"],
  },
  {
    title: "AI Interview Chatbot",
    icon: "chatbot",
    description:
      "An interactive AI-powered experience that allows you to engage with me through questions about my professional experience. Coming soon – interview me directly on this platform.",
    tags: ["AI", "Chatbot"],
    badge: "Upcoming",
  },
];

export const contact = {
  title: "Get in touch",
  body: "Get in touch through the form below, or ask my chat assistant a quick question.",
};

// Placeholder testimonials (hidden). Replace with real ones, then set site.showTestimonials = true.
export const testimonials: { quote: string; name: string; title: string }[] = [
  {
    quote: "June is a pleasure to work with. Replace this with a real quote from a colleague or client.",
    name: "Client Name",
    title: "Role, Company",
  },
  {
    quote: "Another placeholder testimonial. Short, specific quotes about results work best.",
    name: "Colleague Name",
    title: "Role, Company",
  },
  {
    quote: "A third testimonial goes here. You can add as many as you like.",
    name: "Manager Name",
    title: "Role, Company",
  },
];

// Extra context the chatbot uses to answer questions about you.
// Anything written here may be shared with site visitors.
export const chatbotNotes = `
Preferred contact: the contact form on this site, or LinkedIn.
`;

// Reply the chatbot gives while no AI key (ANTHROPIC_API_KEY) is set.
export const chatbotOfflineMessage = `I am currently undergoing extensive training to serve you better. While I'm still learning, I'll be ready to answer your questions soon!

In the meantime, please feel free to submit your enquiry through our contact form, and ${profile.name} will be happy to assist you.

Thank you for your patience and understanding! 😊`;

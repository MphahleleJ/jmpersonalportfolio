# June's Portfolio

Built with **Next.js 16 (App Router) + Tailwind CSS 4**, ready to deploy on Azure App Service (or Vercel).

## Run locally
```bash
npm install
npm run dev    # http://localhost:3000
```

## Edit your content
Everything on the page comes from **`data/profile.ts`**: page title and description, hero, stats, About me, How I lead, Projects, Testimonials (hidden for now: set `site.showTestimonials` to `true` to show them), contact text and LinkedIn.

**Portrait:** put your photo in `public/` (square, 800px+) and set its path as `portrait` in `data/profile.ts`. The current photo is `public/june.jpg`.

## Chatbot
- UI: `components/ChatWidget.tsx` (floating button, bottom right).
- API: `app/api/chat/route.ts`. It builds a system prompt from your profile data, so the bot answers questions about you.
- To switch on real AI replies, set `ANTHROPIC_API_KEY` in `.env` (get one at console.anthropic.com). Optional: `CHAT_MODEL`.
- Without a key the bot politely replies with your email, so the site works either way.
- To use another provider (OpenAI, a hosted bot, etc.), replace `generateReply()` in the route, or swap the widget for a third-party embed script in `app/layout.tsx`.

## Contact form
The Contact section has a form (name, email, message) with a "what is a + b?" check before the Send button.
The server signs the correct answer and checks it again on submit, so bots can't skip it. There is also a hidden honeypot field, a minimum fill time, and each question can only be used once.

Messages are emailed to you over SMTP. Set these in `.env` (and in Vercel's Environment Variables when you deploy):

| Variable | What to put |
|---|---|
| `CONTACT_TO_EMAIL` | Your email address, where messages arrive |
| `SMTP_HOST` / `SMTP_PORT` | Your mail server. Gmail: `smtp.gmail.com` / `465` |
| `SMTP_USER` | The email account that sends, e.g. your Gmail address |
| `SMTP_PASS` | That account's password. For Gmail use an **App password** (Google Account → Security → 2-Step Verification → App passwords), not your normal password |
| `CONTACT_FORM_SECRET` | Any long random string, e.g. from `openssl rand -hex 32`. Required in production |
| `CONTACT_FROM_EMAIL` | Optional "from" address (defaults to `SMTP_USER`) |

Hitting **Reply** on a contact email replies straight to the visitor. Code: `components/ContactForm.tsx`, `app/api/contact/route.ts`, `lib/captcha.ts`.

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. Import it at vercel.com/new.
3. Add `ANTHROPIC_API_KEY` and the contact form variables above under Project Settings → Environment Variables.

## Deploy (Azure App Service)
Files are in `azure/`: `main.bicep` (the Azure resources), `settings.sh` (region, name, size) and two scripts.
1. Install the Azure CLI (`brew install azure-cli`) and sign in: `az login`.
2. Check `azure/settings.sh`, then run `./azure/deploy-infra.sh` once. It reads your values and secrets from `.env`.
3. Run `./azure/deploy-app.sh` to upload the site. Run it again whenever you change the site.
To change a secret later, edit `.env` and run `./azure/deploy-infra.sh` again.

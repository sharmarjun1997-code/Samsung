# Samsung Full Stack Case Study

A complete full-stack frontend submission covering three deliverables:

1. **UserHub Explorer Dashboard** — Live user directory with search, filters, and stat tiles
2. **Multi-Step Contact Form** — 3-step validated enquiry form with conditional fields
3. **Newsletter Email Template** — Responsive HTML email with full campaign layout

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Hook Form
- RandomUser API
- REST Countries API

---

## Project Structure

```
/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── newsletter.html         ← Standalone email (open in browser/Gmail)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Dashboard.jsx
        └── ContactForm.jsx
```

---

## Setup & Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Features

### Dashboard
- Fetches 12 users from RandomUser API
- Live search by name, email, company, country
- Filter by All / Online / Recently Added
- Stat tiles: Total, Active, Organizations, Countries
- Glassmorphism cards with gradient avatars
- Loading spinner + error state with Retry

### Contact Form
- 3-step wizard with animated progress bar
- Step 1: Personal details + age validation (18+) + country dropdown (REST Countries API)
- Step 2: Enquiry type + conditional Business/Partnership fields
- Step 3: Subject, message with 500-char counter, Terms checkbox
- Per-step validation with inline error messages
- Success confirmation screen

### Email Newsletter
- Table-based layout, 600px max-width
- Hidden preheader text
- Navigation bar
- Hero banner + CTA button (44px tap target)
- Countdown strip (Hours / Minutes / Seconds)
- Featured products (2-column)
- Accessories (3-column)
- Trust signals (4 icons)
- App download promo + discount code
- Social media strip
- CAN-SPAM compliant footer with unsubscribe link
- Mobile responsive via media queries

---

## Deployment

Live Demo: [https://your-project.vercel.app](https://your-project.vercel.app)

Deployed via Vercel — auto-deploys on push to `main`.

# CoverCraft AI — $0 Deployment Guide

A complete, deployable AI cover letter generator. **Total cost: $0/month** until you outgrow the free tiers (which is a good problem to have).

## What you're getting

- `index.html` — the full app (frontend, styles, logic, all self-contained)
- `api/generate.js` — serverless function that calls Google Gemini's free tier
- `vercel.json` — deployment config
- `package.json` — Vercel needs this

## Stack

| Layer | Service | Cost |
|---|---|---|
| Hosting | Vercel | $0 (free tier: 100GB bandwidth/month) |
| AI | Google Gemini 1.5 Flash | $0 (free tier: 1,500 requests/day) |
| Domain | `*.vercel.app` subdomain | $0 (real domain optional later, ~$12/year) |

---

## Deploy in 10 minutes

### 1. Get a free Gemini API key (2 minutes)

1. Go to **https://aistudio.google.com/apikey**
2. Sign in with any Google account
3. Click **"Create API key"**
4. Copy the key (looks like `AIzaSy...`). Save it for step 3.

No card required. Free tier is real and persistent.

### 2. Get the code onto GitHub (3 minutes)

1. Make a new GitHub repo (free): https://github.com/new — call it `covercraft`, make it private if you prefer
2. Upload the four files into the repo (drag-and-drop works on github.com):
   - `index.html`
   - `api/generate.js` (keep the `api/` folder structure)
   - `vercel.json`
   - `package.json`

If you've never used GitHub: install **GitHub Desktop** (https://desktop.github.com/) — it's drag-and-drop simple.

### 3. Deploy to Vercel (3 minutes)

1. Go to **https://vercel.com/signup** — sign in with your GitHub account (free)
2. Click **"Add New Project"** → select your `covercraft` repo
3. Before clicking Deploy, expand **"Environment Variables"** and add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** (paste the key from step 1)
4. Click **Deploy**

Wait ~30 seconds. You'll get a URL like `covercraft-abc123.vercel.app`. That's your live product.

### 4. Test it (1 minute)

Open your URL, paste a job description and your background, click Generate. You should get a real cover letter in ~10 seconds. Try it once to confirm. Then try a second time — the paywall should appear (proves the freemium logic works).

---

## What works out of the box

- ✅ Real AI generation via Gemini
- ✅ 1 free letter per browser (uses localStorage)
- ✅ Paywall on second use
- ✅ Tone + length controls
- ✅ Copy to clipboard
- ✅ Mobile responsive
- ✅ Polished editorial design

## What's still placeholder (Stripe)

The "Start Pro" button currently shows an alert. To accept real payments:

1. Create a Stripe account (free): https://stripe.com
2. Create a product: $9.99/month subscription
3. Use **Stripe Payment Links** (no code needed): https://stripe.com/payments/payment-links
4. Replace the alert in `index.html` (search for `In production: redirect to Stripe`) with:
   ```js
   window.location.href = 'https://buy.stripe.com/YOUR_PAYMENT_LINK';
   ```
5. After someone pays, manually set them to Pro for now (later you'd automate this with Stripe webhooks + a database).

Stripe takes 2.9% + 30¢ per transaction. No monthly fees, no minimums.

---

## Making the first $1,000 — realistic plan

The product is built. The hard part is users.

**Week 1: Test the funnel**
- Share with 5 friends who are job hunting. Watch them use it. Fix anything confusing.

**Week 2: First real users**
- Post in **r/jobs**, **r/cscareerquestions**, **r/resumes**, **r/recruitinghell** (read each subreddit's rules — don't spam)
- LinkedIn post: "I built a free tool to generate cover letters that don't sound like AI. Try it: [URL]"
- Hebrew-language Facebook groups for Israeli job seekers (less competition in Hebrew market)

**Weeks 3–8: Iterate on conversion**
- Track: visits → free letter generated → paywall hit → purchase
- Typical funnel: 100 visits → 30 letters → 25 paywalls → 1 purchase (~1% conversion)
- To make $1,000/month at $9.99: need ~100 paying users = ~10,000 total visitors

**This is achievable in 2–4 months with consistent posting. It is not achievable overnight. Anyone telling you otherwise is selling something.**

---

## Limits to know

| Limit | Free tier | What happens if you hit it |
|---|---|---|
| Gemini API | 1,500 requests/day | Tool stops working until next day. Upgrade to paid (~$0.075 per 1M tokens) when you have revenue. |
| Vercel bandwidth | 100GB/month | Roughly 200,000+ visits. Upgrade to Pro ($20/month) only when needed. |
| Vercel function invocations | 100,000/month | Same threshold. You'll be making money before this hits. |

---

## What to build next (in order of impact)

1. **Email capture** — collect emails before paywall hits, even from non-buyers. Newsletter = future revenue.
2. **Stripe integration** — required for real revenue.
3. **Résumé tailoring** — same tech, second product, doubles your offering.
4. **ATS keyword scanner** — paste job + résumé, get a match score. High-value, easy to build.
5. **Hebrew language version** — underserved market in Israel.

When you're ready for any of these, ask me and I'll build them.

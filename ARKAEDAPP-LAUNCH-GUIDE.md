# ARKA-ED App: From Build to Live — Complete Launch Guide

> Your Cursor build compiles. Now here's every step to make it a real, working application that people can sign up for and use.

---

## Overview: What "Working App" Actually Requires

Your Cursor-generated code is the frontend and backend logic. But a working app needs real services connected behind it. Think of it like building a house — Cursor built the structure, but you still need to connect electricity, plumbing, and internet.

Here's what needs to happen, in order:

1. **Supabase (Database)** — Create the production database and run migrations
2. **Environment Variables** — Configure all secrets and API keys
3. **Auth Providers** — Set up Google and Apple OAuth
4. **Stripe** — Connect payment processing
5. **AI Provider** — Connect Claude or OpenAI for AI features
6. **Email Service** — Set up transactional emails
7. **Seed Data** — Load your question bank and content
8. **Local Testing** — Verify everything works end-to-end
9. **Vercel Deployment** — Deploy to production
10. **DNS & Domain** — Point your domain to the app
11. **Post-Launch** — Monitoring, analytics, iteration

---

## Step 1: Supabase Database Setup

You already have a Supabase account. You need a **new project** for the production ARKAEDAPP (don't reuse the demo project).

### 1a. Create a New Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Name it: `arka-ed-production`
4. Choose region: **US East (N. Virginia)** — closest to Vercel's iad1 region
5. Set a strong database password — **save this somewhere safe**
6. Wait for the project to provision (~2 minutes)

### 1b. Get Your Connection Strings

1. In your Supabase project, go to **Settings → Database**
2. Copy two connection strings:
   - **Connection string (Transaction mode)** → This becomes `DATABASE_URL`
   - **Connection string (Session mode)** → This becomes `DIRECT_URL`
3. Both strings look like: `postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
4. Replace `[YOUR-PASSWORD]` in each string with your database password

### 1c. Run Prisma Migrations

In your ARKAEDAPP project folder, open a terminal:

```bash
# Generate Prisma client from your schema
npx prisma generate

# Push schema to your new Supabase database
# (For first-time setup, db push is simpler than migrate)
npx prisma db push

# Verify it worked — this opens Prisma Studio (a visual DB browser)
npx prisma studio
```

You should see all your tables (User, Question, ClinicalCase, etc.) created but empty.

**If you get connection errors:**
- Make sure your `.env` file has the correct `DATABASE_URL` and `DIRECT_URL`
- Supabase's connection pooler uses port `6543` (transaction mode) or `5432` (session mode)
- Check that your IP isn't blocked in Supabase's network restrictions

### 1d. Enable Row Level Security (RLS)

Supabase enables RLS by default. Since you're using Prisma (which connects as the `postgres` role), RLS policies won't block your queries. But if you ever use Supabase client-side directly, you'll need policies.

For now, no action needed — Prisma bypasses RLS by using the service role connection.

---

## Step 2: Environment Variables

Create a `.env.local` file in your ARKAEDAPP root. This file should **never** be committed to git.

```env
# ============================================
# DATABASE (from Step 1)
# ============================================
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# ============================================
# AUTH (Step 3 — fill in after setting up OAuth)
# ============================================
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""

# ============================================
# STRIPE (Step 4 — fill in after Stripe setup)
# ============================================
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# ============================================
# AI (Step 5)
# ============================================
ANTHROPIC_API_KEY=""
# OPENAI_API_KEY=""  # Optional fallback

# ============================================
# EMAIL (Step 6)
# ============================================
RESEND_API_KEY=""

# ============================================
# REDIS / CACHING (Optional for launch, recommended)
# ============================================
# UPSTASH_REDIS_URL=""
# UPSTASH_REDIS_TOKEN=""

# ============================================
# ANALYTICS (Optional for launch)
# ============================================
# NEXT_PUBLIC_POSTHOG_KEY=""

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ARKA-ED"
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

Copy the output into your `.env.local` file.

---

## Step 3: Authentication Providers

### 3a. Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing): "ARKA-ED"
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Name: "ARKA-ED Production"
7. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production — add later)
8. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (add later)
9. Click Create → copy **Client ID** and **Client Secret** into `.env.local`

**Also configure the OAuth consent screen:**
- User type: External
- App name: ARKA-ED
- Support email: your email
- Scopes: `email`, `profile`, `openid`
- Test users: add your own email while in "Testing" status

### 3b. Apple Sign-In (Can defer — do Google first)

Apple Sign-In is more complex and requires an Apple Developer account ($99/year). You can launch with just Google + email/password and add Apple later.

If you want to set it up:
1. Go to [developer.apple.com](https://developer.apple.com)
2. Register a Services ID
3. Configure the domain and redirect URL
4. Generate a private key
5. The NextAuth Apple provider needs: clientId, clientSecret (which is a JWT you generate from the private key)

**Recommendation:** Launch with Google + credentials first. Add Apple before your mobile app launch.

---

## Step 4: Stripe Setup

### 4a. Create Stripe Account

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign up
2. Complete business verification (can use your personal details initially)
3. **Stay in Test Mode** until you're ready for real payments (toggle in top-right)

### 4b. Get API Keys

1. Go to **Developers → API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY`

### 4c. Create Products and Prices

In Stripe Dashboard → **Products**, create each subscription tier:

**Product 1: ARKA-ED Student**
- Monthly price: $19.99/month (recurring)
- Annual price: $149.99/year (recurring)
- Copy both Price IDs (starts with `price_`)

**Product 2: ARKA-ED Resident**
- Monthly: $29.99/month
- Annual: $229.99/year

**Product 3: ARKA-ED Professional**
- Monthly: $49.99/month
- Annual: $399.99/year

### 4d. Update Price IDs in Code

Find where your code maps plan names to Stripe Price IDs (likely in `lib/stripe/config.ts` or `lib/constants.ts`) and update with your real Price IDs:

```typescript
export const STRIPE_PRICES = {
  student: {
    monthly: 'price_XXXXXX',  // Your actual price ID
    annual: 'price_XXXXXX',
  },
  resident: {
    monthly: 'price_XXXXXX',
    annual: 'price_XXXXXX',
  },
  professional: {
    monthly: 'price_XXXXXX',
    annual: 'price_XXXXXX',
  },
};
```

### 4e. Set Up Webhook

1. In Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. For local testing: Use the Stripe CLI (see below)
4. For production: URL will be `https://your-domain.com/api/stripe/webhook`
5. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Copy the **Webhook Signing Secret** (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

### 4f. Local Webhook Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This gives you a local webhook secret — use it in `.env.local` for development.

---

## Step 5: AI Provider (Anthropic Claude)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add billing
3. Go to **API Keys** → Create a new key
4. Copy the key (starts with `sk-ant-`) → `ANTHROPIC_API_KEY`
5. Set a spending limit in **Plans & Billing** to avoid surprises (start with $20-50/month)

**Check your code's AI integration** — verify the model name in your AI config matches a current model (e.g., `claude-sonnet-4-5-20250514` or `claude-haiku-4-5-20251001`). Cursor may have used an older model name.

---

## Step 6: Email Service (Resend)

1. Go to [resend.com](https://resend.com) and create an account
2. Go to **API Keys** → Create key → copy to `RESEND_API_KEY`
3. **Add and verify your domain:**
   - Go to **Domains** → Add Domain
   - Add DNS records (DKIM, SPF) to your domain registrar
   - Wait for verification (~5 minutes to 24 hours)
4. Until your domain is verified, Resend lets you send from `onboarding@resend.dev` for testing

---

## Step 7: Seed Your Database

This is critical — your app is useless without content.

### 7a. Run the Seed Script

```bash
npx prisma db seed
```

This should run the `prisma/seed.ts` script that Cursor generated, which loads questions, cases, flashcards, achievements, and test users.

**If the seed script fails:**
- Check that `prisma/seed.ts` is referenced in your `package.json` under `prisma.seed`
- Make sure it's using the right imports from your seed data files
- Run it with more verbose output: `npx tsx prisma/seed.ts`

### 7b. Verify Seed Data

```bash
npx prisma studio
```

Check that these tables have data:
- `Question` — should have 50+ questions
- `QuestionOption` — should have 5 per question
- `ClinicalCase` — should have 12+ cases
- `Flashcard` — should have 200+ cards
- `FlashcardDeck` — should have system decks
- `Achievement` — should have all achievement definitions

### 7c. Create Your Admin User

If the seed script didn't create an admin user, or you want to use your own email:

```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('your-secure-password', 12);
  await prisma.user.upsert({
    where: { email: 'arrikanna2447@gmail.com' },
    update: {},
    create: {
      email: 'arrikanna2447@gmail.com',
      name: 'Arri',
      passwordHash: hash,
      role: 'ADMIN',
      onboardingComplete: true,
    },
  });
  console.log('Admin user created');
}
main().then(() => prisma.\$disconnect());
"
```

---

## Step 8: Local Testing

Now test every major flow:

### 8a. Start the Dev Server

```bash
npm run dev
```

Open `http://localhost:3000`

### 8b. Test Checklist

Work through each of these and note any issues:

**Auth Flow:**
- [ ] Register a new account with email/password
- [ ] Log out and log back in
- [ ] Log in with Google OAuth
- [ ] Access the dashboard after login
- [ ] Verify you're redirected to /login when accessing protected routes while logged out

**Study Session:**
- [ ] Go to /study and see the study home page
- [ ] Create a custom session (select category, difficulty, count)
- [ ] Answer questions — verify options are clickable
- [ ] Submit an answer — verify correct/incorrect feedback
- [ ] See the explanation panel after answering (in tutor mode)
- [ ] Complete a session — verify the results screen shows stats
- [ ] Check that your attempt is recorded (visible in analytics)

**Case-Based Learning:**
- [ ] Browse cases at /cases
- [ ] Start a case — go through each step
- [ ] Make an imaging choice — verify AIIE score feedback
- [ ] Complete the case — see summary

**Flashcards:**
- [ ] Browse decks at /flashcards
- [ ] Start a review session
- [ ] Flip a card — verify front/back display
- [ ] Rate a card — verify it moves to the next card
- [ ] Complete review — verify scheduling

**Analytics:**
- [ ] Visit /analytics — verify charts render (may need study data first)

**Subscription (Test Mode):**
- [ ] Go to /pricing
- [ ] Click a plan — verify Stripe Checkout opens
- [ ] Use test card `4242 4242 4242 4242` (any future expiry, any CVC)
- [ ] After payment, verify your plan is upgraded
- [ ] Check Stripe dashboard shows the test payment

**Admin Panel:**
- [ ] Access /admin with your admin account
- [ ] View the question list
- [ ] Create or edit a question
- [ ] View user list

### 8c. Fix Issues

Cursor-generated code commonly has these issues:

1. **Import path mismatches** — file was generated at a different path than expected. Fix with find-and-replace.
2. **Missing environment variable checks** — code references a var that doesn't exist. Add the var or add a fallback.
3. **Prisma schema drift** — if you modified the schema after generation, run `npx prisma generate` again.
4. **API route authentication** — some routes may not properly check the session. Test with logged-out state.
5. **Stripe webhook verification** — make sure the raw body is passed (not parsed JSON). Next.js App Router handles this differently from Pages Router.

---

## Step 9: Deploy to Vercel

### 9a. Push to GitHub

```bash
# In your ARKAEDAPP folder
git init
git add .
git commit -m "ARKA-ED production app - initial commit"

# Create a private repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/arkaedapp.git
git branch -M main
git push -u origin main
```

**Make sure `.env.local` is in your `.gitignore`** — never push secrets to GitHub.

### 9b. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `arkaedapp` repository
4. Framework preset: **Next.js** (should auto-detect)
5. **Before clicking Deploy**, add all environment variables:
   - Click **Environment Variables**
   - Add every variable from your `.env.local`
   - For `NEXTAUTH_URL`, use your production URL (e.g., `https://ed.arkahealth.com`)
   - For `NEXT_PUBLIC_SITE_URL`, same production URL
6. Click **Deploy**

### 9c. Post-Deploy Configuration

After the first deploy:

1. **Copy your Vercel URL** (e.g., `arkaedapp.vercel.app`)
2. **Update Google OAuth:**
   - Add `https://arkaedapp.vercel.app` to authorized origins
   - Add `https://arkaedapp.vercel.app/api/auth/callback/google` to redirect URIs
3. **Update Stripe Webhook:**
   - Create a new webhook endpoint: `https://arkaedapp.vercel.app/api/stripe/webhook`
   - Copy the new webhook secret to Vercel's environment variables
4. **Redeploy** after updating env vars (Vercel → Deployments → Redeploy)

---

## Step 10: Custom Domain

### 10a. Add Domain in Vercel

1. In Vercel project → **Settings → Domains**
2. Add your domain: `ed.arkahealth.com` (or whatever you choose)
3. Vercel will show DNS records to add

### 10b. Update DNS

At your domain registrar, add:
- **CNAME record:** `ed` → `cname.vercel-dns.com`
- Or if using apex domain: **A record** → Vercel's IP

Wait for DNS propagation (5 minutes to 48 hours, usually fast).

### 10c. Update All References

After domain is live, update:
- `NEXTAUTH_URL` → `https://ed.arkahealth.com`
- `NEXT_PUBLIC_SITE_URL` → `https://ed.arkahealth.com`
- Google OAuth redirect URIs
- Stripe webhook URL
- Resend verified domain (if different)

---

## Step 11: Post-Launch Essentials

### Monitoring

- **Vercel Analytics** — built in, just enable in project settings
- **Error tracking** — add Sentry (`npm install @sentry/nextjs`) for production error monitoring
- **Uptime monitoring** — use [betterstack.com](https://betterstack.com) or similar (free tier available)

### Backups

- **Supabase auto-backups** — enabled on Pro plan, daily backups
- **Manual backup:** `pg_dump` your database periodically

### Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in client-side code (only `NEXT_PUBLIC_` vars are exposed)
- [ ] Stripe webhook verifies signatures
- [ ] Rate limiting is active on auth routes
- [ ] CORS is configured properly
- [ ] CSP headers are set in `vercel.json`

### Going Live with Stripe (Real Payments)

When ready for real money:
1. Complete Stripe business verification
2. Switch from Test to Live mode in Stripe dashboard
3. Create Live mode products/prices (same as test, but live)
4. Update environment variables with Live API keys
5. Update webhook to Live endpoint
6. Test one real transaction with a small amount

---

## Quick Reference: Service Dashboard Links

| Service | Dashboard | What It Does |
|---------|-----------|-------------|
| Supabase | app.supabase.com | Database, auth, storage |
| Vercel | vercel.com/dashboard | Hosting, deployment, logs |
| Stripe | dashboard.stripe.com | Payments, subscriptions |
| Google Cloud | console.cloud.google.com | OAuth credentials |
| Anthropic | console.anthropic.com | AI API keys, usage |
| Resend | resend.com | Email delivery |
| GitHub | github.com | Source code, CI/CD |

---

## Estimated Timeline

| Step | Time | Can Be Parallel? |
|------|------|-------------------|
| Supabase setup + migrations | 30 min | No (must be first) |
| Environment variables | 15 min | No |
| Google OAuth | 30 min | Yes |
| Stripe setup | 45 min | Yes |
| Anthropic API key | 10 min | Yes |
| Resend email | 20 min | Yes |
| Seed database | 15 min | After Supabase |
| Local testing | 2-4 hours | After all above |
| Fix issues from testing | 1-3 hours | — |
| Vercel deployment | 30 min | After testing |
| Custom domain | 15 min + DNS wait | After Vercel |
| **Total** | **~6-10 hours** | — |

You can realistically go from "builds" to "live on the internet" in a single focused day.

---

## Common Gotchas

1. **Prisma + Supabase connection pooling:** Use `?pgbouncer=true` in your `DATABASE_URL` and the direct connection (port 5432) for `DIRECT_URL`. Prisma migrations need the direct connection.

2. **NextAuth + Vercel:** The `NEXTAUTH_URL` must exactly match your production URL including `https://`. Mismatches cause OAuth redirect failures.

3. **Stripe webhooks on Vercel:** Vercel's serverless functions have a 10-second timeout on the Hobby plan. Stripe retries failed webhooks, so this is usually fine, but watch your logs.

4. **Supabase free tier limits:** 500 MB database, 2 GB bandwidth, 50 MB file storage. Upgrade to Pro ($25/month) when you have real users.

5. **Anthropic rate limits:** New accounts start with lower limits. Request a limit increase through the console if needed.

6. **Next.js build on Vercel:** If your build fails on Vercel but works locally, check that all environment variables are set in Vercel's dashboard. Missing vars at build time cause `undefined` errors.

---

*Once live, your next priorities should be: (1) get 5-10 beta testers using it, (2) fix the bugs they find, (3) add real medical content beyond the seed data, and (4) switch Stripe to live mode when you're confident in the billing flow.*

# Supabase Setup Guide

## Overview

This guide will help you set up Supabase database and connect it to your ARKA-ED application.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `arka-ed` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created (~2 minutes)

## Step 2: Run Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the contents of `supabase/migrations/002_user_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify success message

### Verify Tables Created

Go to **Table Editor** and verify these tables exist:
- ✅ `profiles`
- ✅ `cases`
- ✅ `case_attempts`
- ✅ `assessments`
- ✅ `assessment_attempts`
- ✅ `user_achievements`

## Step 3: Get API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Step 4: Configure Environment Variables

### Local Development

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Vercel Production

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)

## Step 5: Seed Initial Data (Optional)

Run the seed script to populate sample cases and assessments:

```bash
npm install  # Install tsx if not already installed
npm run db:seed
```

This will create:
- 3 sample cases (chest pain, low back pain, headache)
- 3 sample assessments (quick, specialty, full)

## Step 6: Test Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Go to `/login`
   - Try signing up with a new account
   - Verify you can log in

3. Check Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - Verify your test user was created
   - Go to **Table Editor** → **profiles**
   - Verify profile was created automatically

## Step 7: Configure Authentication (Optional)

### Email Authentication

By default, email authentication is enabled. To configure:

1. Go to **Authentication** → **Providers**
2. Configure email settings:
   - Enable email confirmations (recommended)
   - Set email templates
   - Configure redirect URLs

### OAuth Providers (Optional)

To enable Google OAuth:

1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials
4. Add redirect URL: `https://your-domain.com/auth/callback`

## Database Schema Overview

### Tables

- **profiles**: User profiles extending Supabase auth.users
- **cases**: Clinical case studies
- **case_attempts**: User attempts at solving cases
- **assessments**: Assessment definitions
- **assessment_attempts**: User assessment attempts
- **user_achievements**: User achievement unlocks

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only view/update their own data
- Published cases are viewable by all authenticated users
- Admins have full access (configure admin role in profiles table)

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the SQL schema migration
- Check table names match exactly (case-sensitive)

### Authentication not working
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase Dashboard → Authentication → URL Configuration
- Ensure redirect URLs are configured

### RLS Policy Errors
- Check that RLS policies are created (see SQL migration)
- Verify user is authenticated (`auth.uid()` is not null)
- Check user role in profiles table

### Seed Script Fails
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that tables exist
- Ensure service role key has proper permissions

## Next Steps

1. ✅ Database schema deployed
2. ✅ Environment variables configured
3. ✅ Seed data populated (optional)
4. ✅ Authentication tested
5. 🚀 Ready for deployment!

See `DEPLOYMENT.md` for Vercel deployment instructions.

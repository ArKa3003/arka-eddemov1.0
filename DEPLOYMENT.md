# ARKA-ED Deployment Guide

## Pre-Deployment Checklist

### 1. Supabase Setup

#### Run Database Schema
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/migrations/002_user_schema.sql`
4. Verify all tables are created:
   - profiles
   - cases
   - case_attempts
   - assessments
   - assessment_attempts
   - user_achievements

#### Seed Initial Data (Optional)
```bash
npm run db:seed
```

### 2. Environment Variables

#### Local Development (.env.local)
Copy `.env.local.example` to `.env.local` and fill in:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Vercel Production
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin functions)
   - `NEXT_PUBLIC_APP_URL` (your production URL)

### 3. Build Verification

Test the build locally:
```bash
npm run build
```

Fix any TypeScript errors or build issues before deploying.

### 4. Pre-Deployment Checks

- [ ] All routes work locally (`npm run dev`)
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Loading states display correctly
- [ ] Auth flow complete (sign up, login, logout)
- [ ] Error pages exist (404, 500)
- [ ] Database schema is deployed to Supabase
- [ ] Environment variables are set in Vercel
- [ ] Build completes without errors

### 5. Deploy to Vercel

#### Option 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to Vercel Dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables in the setup
7. Click "Deploy"

#### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### 6. Post-Deployment

1. **Test Production URL**
   - Visit your deployed site
   - Test authentication flow
   - Test case viewing and attempts
   - Test assessment flow

2. **Verify Environment Variables**
   - Check that all env vars are set correctly
   - Test Supabase connection

3. **Monitor Logs**
   - Check Vercel logs for any errors
   - Monitor Supabase logs for database issues

4. **Set up Custom Domain** (Optional)
   - Go to Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run type-check`
- Verify all imports are correct
- Check for missing dependencies

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check RLS policies in Supabase
- Verify auth redirect URLs in Supabase dashboard

### Database Errors
- Check Supabase connection
- Verify RLS policies allow access
- Check table names match schema

### Environment Variables
- Ensure all required vars are set in Vercel
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new variables

## Vercel Configuration

The `vercel.json` file is already configured with:
- Next.js framework detection
- Security headers
- Cache control for static assets
- API route caching disabled

No additional configuration needed unless you have specific requirements.

## Database Migrations

To add new migrations:
1. Create SQL file in `supabase/migrations/`
2. Run in Supabase SQL Editor
3. Test locally before deploying

## Support

For issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console errors
4. Verify environment variables

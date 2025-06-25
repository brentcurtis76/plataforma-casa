# Railway Deployment Guide for Church Admin Platform

## Prerequisites
- GitHub account with access to your repository
- Railway account (sign up at https://railway.app)
- OpenAI API key ready

## Step 1: Set Up Railway Account
1. Go to https://railway.app
2. Sign up using GitHub (recommended) or email
3. Verify your account

## Step 2: Create New Project
1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub account
4. Select the church-admin repository

## Step 3: Configure Environment Variables
In the Railway dashboard, go to Variables tab and add:

```bash
# Supabase Configuration (copy from .env.railway.example)
NEXT_PUBLIC_SUPABASE_URL=https://sxlogxqzmarhqsblxmtj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bG9neHF6bWFyaHFzYmx4bXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjIyMjEsImV4cCI6MjA2Mjg5ODIyMX0.J6YJpTDvW6vz7d-N0BkGsLIZY51h_raFPNIQfU5UE5E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bG9neHF6bWFyaHFzYmx4bXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMyMjIyMSwiZXhwIjoyMDYyODk4MjIxfQ.OiyMUeIoCc_mH7G5xZms1AhDyYM3jXqqIjccSL0JmWI

# OpenAI Configuration (add your actual key)
OPENAI_API_KEY=sk-proj-... (your actual OpenAI key)

# Node Environment
NODE_ENV=production
```

## Step 4: Deploy Configuration
Railway will automatically detect:
- `nixpacks.toml` for build configuration
- `railway.json` for deployment settings
- Monorepo structure with pnpm workspaces

## Step 5: Deploy
1. Railway will automatically start the deployment
2. Monitor the build logs in the Railway dashboard
3. Once deployed, Railway will provide a URL like: `church-admin-production.up.railway.app`

## Step 6: Configure Custom Domain (Optional)
1. Go to Settings → Domains in Railway
2. Add your custom domain
3. Update DNS records as instructed

## Build Process Details
Railway will:
1. Install pnpm and Node.js 20
2. Run `pnpm install --frozen-lockfile`
3. Run `pnpm build` (builds all workspace packages)
4. Start the app with `cd apps/web && pnpm start`

## Monitoring
- View logs: Railway dashboard → Deployments → View logs
- Monitor performance: Railway dashboard → Metrics
- Set up alerts: Railway dashboard → Settings → Notifications

## Troubleshooting

### If build fails:
1. Check build logs for specific errors
2. Ensure all environment variables are set
3. Verify nixpacks.toml syntax

### If app crashes on start:
1. Check runtime logs
2. Verify PORT environment variable is used correctly
3. Ensure database connection works

### Common Issues:
- **Module not found**: Check pnpm-lock.yaml is committed
- **Build timeout**: Increase build timeout in Railway settings
- **Memory issues**: Upgrade Railway plan if needed

## Success Checklist
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] App accessible at Railway URL
- [ ] Meditation feature working
- [ ] Authentication functional
- [ ] Database queries working

## Next Steps After Deployment
1. Test meditation flow completely
2. Monitor performance metrics
3. Set up error tracking (consider Sentry)
4. Configure backup strategy
5. Plan Phase 3 features (audio generation)
# 🚀 Church Admin Platform - Production Deployment Guide

## GitHub Actions CI/CD Setup

### Prerequisites
- GitHub repository with the codebase
- Supabase project with database configured
- OpenAI API key for meditation features

### Step 1: Configure GitHub Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these repository secrets (click "New repository secret" for each):

| Secret Name | Value | Required |
|-------------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes |
| `OPENAI_API_KEY` | `sk-your-openai-api-key` | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | 🔶 Optional |

### Step 2: Activate CI/CD Workflow

The CI/CD pipeline (`.github/workflows/ci.yml`) will automatically:

1. **Run on every push** to `main` and `develop` branches
2. **Run on pull requests** to `main` branch
3. **Execute the test suite**:
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Performance tests (Lighthouse CI)
   - Build validation
   - Code quality checks

### Step 3: First Deployment Test

1. **Push to `develop` branch** to test the pipeline:
   ```bash
   git checkout -b develop
   git push origin develop
   ```

2. **Check GitHub Actions tab** to see the workflow running

3. **Review the test results** and artifacts

### Step 4: Production Deployment

1. **Create a pull request** from `develop` to `main`
2. **CI/CD will run automatically** on the PR
3. **Merge to `main`** after tests pass
4. **Deploy to production** (manual step - see deployment options below)

---

## Deployment Options

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option B: Docker
```bash
# Build Docker image
docker build -t church-admin .

# Run container
docker run -p 3001:3001 church-admin
```

### Option C: Manual Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables for Production

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

---

## Testing the Pipeline

### Local Testing Commands
```bash
# Run all tests
npm run test:all

# Individual test suites
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:performance # Performance tests
```

### CI/CD Pipeline Results
- ✅ **Test Reports**: Available as GitHub Actions artifacts
- ✅ **Performance Reports**: Lighthouse results uploaded
- ✅ **Build Verification**: Ensures deployable state
- ✅ **Code Quality**: Linting and formatting checks

---

## Monitoring & Maintenance

### Performance Monitoring
- **Lighthouse CI** runs on every deployment
- **Core Web Vitals** tracked for meditation pages
- **Accessibility** standards enforced (90%+ score)

### Test Coverage
- **32 E2E tests** covering critical meditation flows
- **Unit tests** for core business logic
- **Performance baselines** for spiritual UX

### Troubleshooting
1. **Check GitHub Actions logs** for specific failures
2. **Review test artifacts** for detailed reports
3. **Validate environment variables** in repository secrets
4. **Run tests locally** to reproduce issues

---

## Security Best Practices

- ✅ **Environment variables** stored as GitHub secrets
- ✅ **API keys** never committed to repository
- ✅ **Dependency scanning** via GitHub Actions
- ✅ **Build verification** before deployment

---

## Next Steps

1. ✅ **Configure GitHub secrets** (required)
2. ✅ **Test the pipeline** with a develop branch push
3. ✅ **Deploy to production** using your preferred method
4. 🎯 **Monitor performance** via Lighthouse reports
5. 🔄 **Iterate and improve** based on CI/CD feedback
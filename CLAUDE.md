# Church Admin Platform - Development Notes

## Important Configuration
- **Port**: This project runs on **PORT 3001** (not 3000)
  - Another Supabase project requires port 3000
  - All URLs should reference http://localhost:3001

## Project Context
- **Name**: Church Admin Platform (Plataforma CASA)
- **Database**: Uses existing CASA Supabase project
- **Tables**: All tables prefixed with `church_` to avoid conflicts
- **Theme**: Black and white branding for CASA church

## Key URLs (Port 3001)
- Church Website: http://localhost:3001/
- Admin Panel: http://localhost:3001/dashboard
- Auth Pages: http://localhost:3001/auth/login
- Accounting: http://localhost:3001/dashboard/accounting

## Supabase Connection
- Project: CASA (existing project)
- URL: https://sxlogxqzmarhqsblxmtj.supabase.co
- Tables share database with LMS project (use church_ prefix)

## Development Commands
```bash
cd ~/Documents/Plataforma CASA/church-admin
pnpm dev  # Runs on port 3001
```

OR from the web directory:
```bash
cd ~/Documents/Plataforma CASA/church-admin/apps/web
npm run dev
```

## Current Status (June 26, 2025)

### ✅ Completed
1. **Phase 1: Foundation** - COMPLETE
   - Database schema with organizations and profiles
   - Authentication with multi-tenancy
   - Dashboard with sidebar navigation
   - Role-based access (admin, treasurer, presenter, member)

2. **Phase 2: Accounting Module** - PAUSED (Wrong approach)
   - Created complex double-entry system
   - But church uses simple Excel cash tracking
   - Need complete redesign to match their workflow
   - See: FINANCE_REPORT_ANALYSIS.md

3. **Landing Page** - COMPLETE
   - Copied design from casa-web GitHub repository
   - Hero section with ca/sa branding elements
   - Proper Mont/Montserrat typography
   - Multiple content sections
   - Responsive design

4. **Phase 2.5: Meditation Module** - COMPLETE
   - All components created and tested locally
   - Fixed all TypeScript and build errors
   - OpenAI integration configured
   - Timer, emotion selection, scripture recommendations working

5. **Railway Deployment** - COMPLETE ✅
   - Successfully deployed to Railway with monorepo support
   - Clean architecture preserved
   - Production URL: https://paz-assistant-production.up.railway.app
   - All meditation features working in production

6. **Modern UI/UX Redesign** - COMPLETE ✅
   - **Phase 1**: Visual hierarchy with hero revenue card 2x larger
   - **Phase 2**: Contextual insights and data storytelling
   - Progressive disclosure for advanced analytics
   - Professional branding with CASA logo integration
   - "Plataforma de Administración" with "Iglesia Anglicana San Andrés"
   - Black/white color scheme with Mont typography
   - Subtle animations and modern design patterns

### ✅ Resolved Issues (June 26, 2025)
1. **Deployment Success**:
   - ✅ Railway properly supports npm workspaces
   - ✅ Monorepo architecture preserved
   - ✅ All features working in production
   - ✅ No more flattened structure workarounds

2. **UI/UX Modernization**:
   - ✅ Fixed visual hierarchy issues
   - ✅ Added intelligent data insights
   - ✅ Implemented progressive disclosure
   - ✅ Professional branding integration
   - ✅ Modern SaaS UI patterns

### 📋 Optional Next Steps
1. **Phase 3: Micro-interactions** (future enhancement)
   - Hover animations and transitions
   - Loading states and feedback
   - Interactive data visualizations

2. **Test Meditation Flow** (when needed)
   - Verify OpenAI integration in production
   - Test scripture recommendations
   - Check meditation timer functionality

3. **Eventually**: Redesign accounting to match Excel workflow

## Technical Details

### Deployment Configuration Issues
- **Monorepo Structure**: Uses npm workspaces (not supported by Vercel)
- **Packages**: web, database, shared (requires proper monorepo deployment)
- **Current Vercel Config**: Flattened structure loses architectural benefits
- **Solution**: Railway supports monorepos natively

### Database Tables Created
- `church_organizations` - Multi-tenant support
- `church_profiles` - User profiles with roles
- `church_accounts` - Chart of accounts
- `church_transactions` - Financial transactions
- `church_transaction_lines` - Double-entry lines
- `church_expense_reports` - Expense tracking
- `church_expense_items` - Expense details
- `church_meditation_sessions` - Meditation history (ready to create)
- `church_meditation_preferences` - User preferences (ready to create)

### Key Components
**Dashboard & Core:**
- `/components/dashboard/Sidebar.tsx` - Collapsible navigation
- `/components/church/Hero.tsx` - Landing page hero
- `/components/church/Header.tsx` - Public site header

**Accounting (Paused):**
- `/components/accounting/TransactionList.tsx` - Transaction display
- `/components/accounting/IncomeStatement.tsx` - P&L report
- `/components/accounting/BalanceSheet.tsx` - Balance sheet

**Meditation (Complete):**
- `/components/meditation/EmotionSelector.tsx` - Emotion selection UI
- `/components/meditation/Timer.tsx` - Meditation timer
- `/components/meditation/ScriptureDisplay.tsx` - Scripture viewer
- `/components/meditation/StreakDisplay.tsx` - Progress tracking
- `/components/meditation/LoadingStates.tsx` - Loading animations
- All components tested and working locally

### Environment Variables
```env
# Supabase (configured)
NEXT_PUBLIC_SUPABASE_URL=https://sxlogxqzmarhqsblxmtj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# OpenAI (configured in Vercel)
OPENAI_API_KEY=sk-proj-...

# Eleven Labs (for Phase 3)
ELEVEN_LABS_API_KEY=pending
```

### Important Notes
- OpenAI key added to Vercel but deployment blocked by monorepo issue
- All meditation components use 'use client' directive properly
- TypeScript strict mode enforced throughout
- Ready for Railway deployment tomorrow

## Remember
- Always use port 3001 for this project
- Check table prefixes when querying (church_*)
- CASA theme uses black/white color scheme
- Use Chilean currency formatting (CLP)
- All text in Spanish
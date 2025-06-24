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

## Current Status (June 23, 2025)

### ✅ Completed
1. **Phase 1: Foundation** - COMPLETE
   - Database schema with organizations and profiles
   - Authentication with multi-tenancy
   - Dashboard with sidebar navigation
   - Role-based access (admin, treasurer, presenter, member)

2. **Phase 2: Accounting Module** - PARTIALLY COMPLETE
   - Database schema for double-entry bookkeeping
   - Accounting dashboard with transaction list
   - Create new transactions with validation
   - Financial reports (Income Statement, Balance Sheet)
   - Transaction management with status tracking
   - Chart of accounts created with Chilean church structure

3. **Landing Page** - COMPLETE
   - Copied design from casa-web GitHub repository
   - Hero section with ca/sa branding elements
   - Proper Mont/Montserrat typography
   - Multiple content sections
   - Responsive design

### 🚧 In Progress
- Need to adjust finance structure to match PDF reference: `/Users/brentcurtis76/Documents/Plataforma CASA/Referencias/5-INFORMEFINANZAS-AMAYO2025(1).pdf`
- User stopped the implementation of chart updates - need to review PDF first
- Current approach was not aligned with their manual process

### 📋 Todo
- Review PDF finance report and understand current manual process
- Adjust accounting module to match their actual workflow
- Expense report submission with receipt upload
- Chilean bank API integration
- Phase 3: Presentation System
- Phase 4: AI Meditation
- Phase 5: Mobile App

## Technical Details

### Database Tables Created
- `church_organizations` - Multi-tenant support
- `church_profiles` - User profiles with roles
- `church_accounts` - Chart of accounts
- `church_transactions` - Financial transactions
- `church_transaction_lines` - Double-entry lines
- `church_expense_reports` - Expense tracking
- `church_expense_items` - Expense details

### Key Components
- `/components/dashboard/Sidebar.tsx` - Collapsible navigation
- `/components/accounting/TransactionList.tsx` - Transaction display
- `/components/accounting/IncomeStatement.tsx` - P&L report
- `/components/accounting/BalanceSheet.tsx` - Balance sheet
- `/components/church/Hero.tsx` - Landing page hero
- `/components/church/Header.tsx` - Public site header

### UI Components Added
- Badge
- Table (with all sub-components)
- Textarea
- Select (exists)
- Dialog (exists)

### Important Notes
- Chart of accounts migration created but NOT applied yet
- User wants accounting to match their manual process (see PDF)
- Need to understand their current workflow before proceeding

## Remember
- Always use port 3001 for this project
- Check table prefixes when querying (church_*)
- CASA theme uses black/white color scheme
- Use Chilean currency formatting (CLP)
- All text in Spanish
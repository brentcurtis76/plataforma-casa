# 📊 Church Finance Report Analysis - San Andrés de la Reina

## 🎯 Key Findings from Excel Report

### **Report Structure**
The church uses a **simple cash-based accounting system** with:
- Monthly income/expense tracking (January - May 2025)
- Two bank accounts: Banco Chile + Banco Santander
- Reserve funds and designated funds tracking
- Manual Excel spreadsheet with monthly columns

### **Income Categories (INGRESOS)**

#### **Fixed Income Sources:**
1. **Ofrendas (Liturgias-Domingo)** - Sunday offerings
   - Variable amounts: $471,390 - $1,190,400/month
   - Main source from Banco Santander

2. **Aportes Mensuales** - Monthly contributions
   - Banco Chile: $55,000 - $85,000/month
   - Banco Santander: $3,500,000 - $3,905,000/month (largest income source)

3. **Canasta Familiar** - Food basket donations
   - $30,000 - $90,000/month

#### **Special/Variable Income:**
- Aportes campaña Vitreaux (stained glass campaign)
- Devolución IVA (VAT refund)
- Retiro Familiar (family retreat fees)
- Venta Garage (garage sale)
- Ofrenda especial (special offerings)
- AIKIDO (rental income)
- Cenas de Navidad (Christmas dinners)

### **Expense Categories (EGRESOS)**

#### **Fixed Operational Expenses:**
1. **Utilities:**
   - Agua (Water) - PAC
   - Enel (Electricity) - ~$100,000/month
   - Alarma Verisure - ~$123,000/month  
   - Internet Movistar - ~$25,000/month

2. **Salaries & Contributions:**
   - Remuneración pastor - ~$2,562,408/month (largest expense)
   - Contribuciones (taxes/social security)
   - Imposiciones Brent - $352,000/month
   - Remuneración Brent Curtis - $1,500,000/month

3. **Regular Support Payments:**
   - Aporte Regional - $350,000/month (stopped in April)
   - Aporte Edificio - $30,000/month (stopped in April)
   - Eugenia Riffo (Administrator) - $600,000/month
   - Marisol Quezada (Cleaning) - $100,000-125,000/month
   - Samuel Alvarez (Liturgy Support) - $250,000/month
   - Jardinero (Gardener) - $90,000-150,000/month

4. **Special Church Contributions:**
   - Ofrenda especial Iglesia Vitacura - $150,000/month

#### **Variable Expenses:**
- Soporte Música (music support)
- Maintenance and repairs
- Canasta purchases
- Special events (anniversaries, Mother's Day)
- Building improvements
- Vitral (stained glass) project

### **Financial Management Features:**

1. **Fund Distribution:**
   - Fondo de Reserva (Reserve Fund): $12,000,000
   - Fondo de Inversiones (Investment Fund): $2,611,390
   - Designated funds for specific purposes

2. **Bank Account Tracking:**
   - Banco Chile balance: $9,311,939 (as of May 30)
   - Banco Santander balance: $1,586,486 (as of May 30)
   - Combined balance: $10,898,425

3. **Special Project Tracking:**
   - Christmas dinner income/expenses with carryover
   - Vitreaux (stained glass) campaign with separate accounting

4. **Monthly Net Result:**
   - Calculated as "Ingresos Fijos menos Egresos fijos"
   - Shows monthly surplus/deficit

---

## 🔧 Required Adjustments to Accounting Module

### **1. Simplify Account Structure**
Instead of complex double-entry bookkeeping, implement:
- **Income categories** matching the Excel report
- **Expense categories** matching the Excel report
- **Cash-based tracking** (not accrual)
- **Monthly column view** like their Excel

### **2. Multi-Bank Support**
- Track multiple bank accounts separately
- Show individual and combined balances
- Bank reconciliation by account

### **3. Fixed vs Variable Tracking**
- Mark certain income/expenses as "fixed monthly"
- Auto-populate fixed amounts each month
- Allow override for variations

### **4. Fund Management**
- Reserve funds tracking
- Designated funds (canastas, special projects)
- Investment fund tracking
- Automatic fund distribution calculations

### **5. Special Project Accounting**
- Campaign tracking (like Vitreaux)
- Multi-year project support (Christmas dinners)
- Carryover balances between years

### **6. Reporting Changes**

#### **Replace current reports with:**
1. **Monthly Summary Report** (like their Excel)
   - Income by category with monthly columns
   - Expenses by category with monthly columns
   - Net result per month
   - Bank balances

2. **Fund Status Report**
   - Reserve fund balance
   - Designated funds status
   - Available unrestricted funds

3. **Cash Flow Report**
   - Beginning balance
   - Total income
   - Total expenses
   - Ending balance
   - By bank account

4. **Annual Comparison**
   - Year-over-year by category
   - Trend analysis

### **7. Data Entry Simplification**
- **Bulk monthly entry** for fixed items
- **Quick entry forms** for common transactions
- **Import from bank statements** (Chilean bank format)
- **Excel export** matching their current format

### **8. Chilean-Specific Features**
- CLP currency formatting
- Chilean tax handling (IVA)
- RUT validation for vendors/donors
- Chilean date format (DD/MM/YYYY)

---

## 🎯 Implementation Priority

### **Phase 1: Core Adjustments (1 week)**
1. Simplify chart of accounts to match Excel categories
2. Add multi-bank account support
3. Create monthly column view for income/expenses
4. Implement cash-based reporting

### **Phase 2: Enhanced Features (1 week)**
1. Fund management system
2. Fixed monthly items automation
3. Special project tracking
4. Excel import/export

### **Phase 3: Chilean Integration (2 weeks)**
1. Bank statement import (Banco Chile, Santander)
2. Chilean tax compliance features
3. Donor/vendor management with RUT
4. Mobile-responsive for on-the-go entry

---

## 💡 Key Insight

The church doesn't need complex accounting software - they need a **digital version of their Excel workflow** with:
- Better data validation
- Automatic calculations
- Multi-user access
- Historical tracking
- Simple reporting

This is more of a **financial tracking system** than traditional accounting software, which perfectly matches their needs and technical comfort level.
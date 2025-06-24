-- Church Admin Platform - Accounting Module Schema

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS church_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_id UUID REFERENCES church_accounts(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Create indexes
CREATE INDEX idx_church_accounts_organization_id ON church_accounts(organization_id);
CREATE INDEX idx_church_accounts_parent_id ON church_accounts(parent_id);
CREATE INDEX idx_church_accounts_type ON church_accounts(type);

-- Transactions
CREATE TABLE IF NOT EXISTS church_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT,
  reference_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'reconciled', 'voided')),
  created_by UUID REFERENCES church_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Lines (Double-entry bookkeeping)
CREATE TABLE IF NOT EXISTS church_transaction_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES church_transactions(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES church_accounts(id),
  debit DECIMAL(12,2) DEFAULT 0,
  credit DECIMAL(12,2) DEFAULT 0,
  description TEXT,
  CHECK (debit >= 0 AND credit >= 0),
  CHECK (NOT (debit > 0 AND credit > 0))
);

-- Create indexes
CREATE INDEX idx_church_transactions_organization_id ON church_transactions(organization_id);
CREATE INDEX idx_church_transactions_date ON church_transactions(date);
CREATE INDEX idx_church_transaction_lines_transaction_id ON church_transaction_lines(transaction_id);
CREATE INDEX idx_church_transaction_lines_account_id ON church_transaction_lines(account_id);

-- Expense Reports
CREATE TABLE IF NOT EXISTS church_expense_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES church_profiles(id),
  approved_by UUID REFERENCES church_profiles(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'paid')),
  title TEXT NOT NULL,
  description TEXT,
  total_amount DECIMAL(12,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense Report Items
CREATE TABLE IF NOT EXISTS church_expense_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_report_id UUID NOT NULL REFERENCES church_expense_reports(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  amount DECIMAL(12,2) NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_church_expense_reports_organization_id ON church_expense_reports(organization_id);
CREATE INDEX idx_church_expense_reports_submitted_by ON church_expense_reports(submitted_by);
CREATE INDEX idx_church_expense_items_expense_report_id ON church_expense_items(expense_report_id);

-- Enable RLS
ALTER TABLE church_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_transaction_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_expense_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_expense_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for church_accounts
CREATE POLICY "Users can view accounts in their organization" 
  ON church_accounts FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM church_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and treasurers can manage accounts" 
  ON church_accounts FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM church_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

-- RLS Policies for church_transactions
CREATE POLICY "Users can view transactions in their organization" 
  ON church_transactions FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM church_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and treasurers can manage transactions" 
  ON church_transactions FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM church_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

-- RLS Policies for church_transaction_lines
CREATE POLICY "Users can view transaction lines" 
  ON church_transaction_lines FOR SELECT 
  USING (
    transaction_id IN (
      SELECT id FROM church_transactions 
      WHERE organization_id IN (
        SELECT organization_id FROM church_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and treasurers can manage transaction lines" 
  ON church_transaction_lines FOR ALL 
  USING (
    transaction_id IN (
      SELECT id FROM church_transactions 
      WHERE organization_id IN (
        SELECT organization_id FROM church_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

-- RLS Policies for church_expense_reports
CREATE POLICY "Users can view their own expense reports" 
  ON church_expense_reports FOR SELECT 
  USING (
    submitted_by = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM church_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

CREATE POLICY "Users can create their own expense reports" 
  ON church_expense_reports FOR INSERT 
  WITH CHECK (
    submitted_by = auth.uid() AND
    organization_id IN (
      SELECT organization_id FROM church_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their draft expense reports" 
  ON church_expense_reports FOR UPDATE 
  USING (
    (submitted_by = auth.uid() AND status = 'draft') OR
    (organization_id IN (
      SELECT organization_id FROM church_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'treasurer')
    ))
  );

-- RLS Policies for church_expense_items
CREATE POLICY "Users can view expense items" 
  ON church_expense_items FOR SELECT 
  USING (
    expense_report_id IN (
      SELECT id FROM church_expense_reports 
      WHERE submitted_by = auth.uid() OR
      organization_id IN (
        SELECT organization_id FROM church_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

CREATE POLICY "Users can manage expense items in their reports" 
  ON church_expense_items FOR ALL 
  USING (
    expense_report_id IN (
      SELECT id FROM church_expense_reports 
      WHERE submitted_by = auth.uid() AND status = 'draft'
    )
  );

-- Update triggers
CREATE TRIGGER update_church_accounts_updated_at
  BEFORE UPDATE ON church_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_church_transactions_updated_at
  BEFORE UPDATE ON church_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_church_expense_reports_updated_at
  BEFORE UPDATE ON church_expense_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to validate transaction balance
CREATE OR REPLACE FUNCTION validate_transaction_balance()
RETURNS TRIGGER AS $$
DECLARE
  total_debits DECIMAL(12,2);
  total_credits DECIMAL(12,2);
BEGIN
  SELECT 
    COALESCE(SUM(debit), 0),
    COALESCE(SUM(credit), 0)
  INTO total_debits, total_credits
  FROM church_transaction_lines
  WHERE transaction_id = NEW.transaction_id;
  
  IF total_debits != total_credits THEN
    RAISE EXCEPTION 'Transaction is not balanced. Debits: %, Credits: %', total_debits, total_credits;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure transactions are balanced
CREATE CONSTRAINT TRIGGER ensure_transaction_balanced
  AFTER INSERT OR UPDATE OR DELETE ON church_transaction_lines
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_balance();

-- Insert default chart of accounts for new organizations
CREATE OR REPLACE FUNCTION create_default_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Assets
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '1000', 'Activos', 'asset'),
    (NEW.id, '1100', 'Banco', 'asset'),
    (NEW.id, '1200', 'Cuentas por Cobrar', 'asset'),
    (NEW.id, '1500', 'Activos Fijos', 'asset');
  
  -- Liabilities
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '2000', 'Pasivos', 'liability'),
    (NEW.id, '2100', 'Cuentas por Pagar', 'liability');
  
  -- Equity
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '3000', 'Patrimonio', 'equity'),
    (NEW.id, '3100', 'Patrimonio Neto', 'equity');
  
  -- Revenue
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '4000', 'Ingresos', 'revenue'),
    (NEW.id, '4100', 'Diezmos', 'revenue'),
    (NEW.id, '4200', 'Ofrendas', 'revenue'),
    (NEW.id, '4300', 'Donaciones', 'revenue');
  
  -- Expenses
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '5000', 'Gastos', 'expense'),
    (NEW.id, '5100', 'Salarios', 'expense'),
    (NEW.id, '5200', 'Servicios Básicos', 'expense'),
    (NEW.id, '5300', 'Mantenimiento', 'expense'),
    (NEW.id, '5400', 'Ministerios', 'expense'),
    (NEW.id, '5500', 'Gastos Administrativos', 'expense');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default accounts for new organizations
CREATE TRIGGER create_default_accounts_trigger
  AFTER INSERT ON church_organizations
  FOR EACH ROW
  EXECUTE FUNCTION create_default_accounts();
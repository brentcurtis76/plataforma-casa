-- Update Chart of Accounts to match Chilean church financial structure
-- Based on typical Chilean church financial reporting

-- First, clear existing default accounts
DELETE FROM church_accounts WHERE organization_id IN (SELECT id FROM church_organizations);

-- Drop the old trigger
DROP TRIGGER IF EXISTS create_default_accounts_trigger ON church_organizations;
DROP FUNCTION IF EXISTS create_default_accounts();

-- Create new function with Chilean church account structure
CREATE OR REPLACE FUNCTION create_default_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- ACTIVOS (1000)
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '1000', 'ACTIVOS', 'asset'),
    (NEW.id, '1010', 'Activo Circulante', 'asset'),
    (NEW.id, '1011', 'Caja', 'asset'),
    (NEW.id, '1012', 'Banco', 'asset'),
    (NEW.id, '1013', 'Fondos por Rendir', 'asset'),
    (NEW.id, '1020', 'Activo Fijo', 'asset'),
    (NEW.id, '1021', 'Edificios', 'asset'),
    (NEW.id, '1022', 'Muebles y Equipos', 'asset'),
    (NEW.id, '1023', 'Vehículos', 'asset');
  
  -- PASIVOS (2000)
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '2000', 'PASIVOS', 'liability'),
    (NEW.id, '2010', 'Pasivo Circulante', 'liability'),
    (NEW.id, '2011', 'Cuentas por Pagar', 'liability'),
    (NEW.id, '2012', 'Préstamos por Pagar', 'liability'),
    (NEW.id, '2013', 'Retenciones por Pagar', 'liability');
  
  -- PATRIMONIO (3000)
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '3000', 'PATRIMONIO', 'equity'),
    (NEW.id, '3010', 'Capital Social', 'equity'),
    (NEW.id, '3020', 'Resultado del Ejercicio', 'equity'),
    (NEW.id, '3030', 'Resultados Acumulados', 'equity');
  
  -- INGRESOS (4000)
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '4000', 'INGRESOS', 'revenue'),
    -- Ingresos Ordinarios
    (NEW.id, '4100', 'Ingresos Ordinarios', 'revenue'),
    (NEW.id, '4110', 'Diezmos', 'revenue'),
    (NEW.id, '4120', 'Ofrendas', 'revenue'),
    (NEW.id, '4130', 'Ofrendas Especiales', 'revenue'),
    (NEW.id, '4140', 'Donaciones', 'revenue'),
    -- Ingresos por Actividades
    (NEW.id, '4200', 'Ingresos por Actividades', 'revenue'),
    (NEW.id, '4210', 'Eventos Especiales', 'revenue'),
    (NEW.id, '4220', 'Retiros y Campamentos', 'revenue'),
    (NEW.id, '4230', 'Ventas y Bazares', 'revenue'),
    -- Otros Ingresos
    (NEW.id, '4300', 'Otros Ingresos', 'revenue'),
    (NEW.id, '4310', 'Arriendos', 'revenue'),
    (NEW.id, '4320', 'Intereses Bancarios', 'revenue'),
    (NEW.id, '4330', 'Otros Ingresos Varios', 'revenue');
  
  -- EGRESOS/GASTOS (5000)
  INSERT INTO church_accounts (organization_id, code, name, type) VALUES
    (NEW.id, '5000', 'EGRESOS', 'expense'),
    -- Gastos de Personal
    (NEW.id, '5100', 'Gastos de Personal', 'expense'),
    (NEW.id, '5110', 'Sueldos y Salarios', 'expense'),
    (NEW.id, '5120', 'Honorarios Pastorales', 'expense'),
    (NEW.id, '5130', 'Leyes Sociales', 'expense'),
    (NEW.id, '5140', 'Gratificaciones', 'expense'),
    (NEW.id, '5150', 'Movilización Personal', 'expense'),
    -- Gastos Generales y Administración
    (NEW.id, '5200', 'Gastos Generales y Administración', 'expense'),
    (NEW.id, '5210', 'Electricidad', 'expense'),
    (NEW.id, '5220', 'Agua', 'expense'),
    (NEW.id, '5230', 'Gas', 'expense'),
    (NEW.id, '5240', 'Teléfono e Internet', 'expense'),
    (NEW.id, '5250', 'Materiales de Oficina', 'expense'),
    (NEW.id, '5260', 'Gastos Bancarios', 'expense'),
    (NEW.id, '5270', 'Seguros', 'expense'),
    -- Gastos de Mantención
    (NEW.id, '5300', 'Gastos de Mantención', 'expense'),
    (NEW.id, '5310', 'Mantención Edificio', 'expense'),
    (NEW.id, '5320', 'Mantención Equipos', 'expense'),
    (NEW.id, '5330', 'Aseo y Ornato', 'expense'),
    (NEW.id, '5340', 'Jardín', 'expense'),
    -- Gastos Ministeriales
    (NEW.id, '5400', 'Gastos Ministeriales', 'expense'),
    (NEW.id, '5410', 'Escuela Dominical', 'expense'),
    (NEW.id, '5420', 'Ministerio de Jóvenes', 'expense'),
    (NEW.id, '5430', 'Ministerio de Mujeres', 'expense'),
    (NEW.id, '5440', 'Ministerio de Hombres', 'expense'),
    (NEW.id, '5450', 'Evangelismo', 'expense'),
    (NEW.id, '5460', 'Misiones', 'expense'),
    (NEW.id, '5470', 'Música y Alabanza', 'expense'),
    (NEW.id, '5480', 'Santa Cena', 'expense'),
    -- Gastos de Actividades
    (NEW.id, '5500', 'Gastos de Actividades', 'expense'),
    (NEW.id, '5510', 'Retiros y Campamentos', 'expense'),
    (NEW.id, '5520', 'Eventos Especiales', 'expense'),
    (NEW.id, '5530', 'Aniversario Iglesia', 'expense'),
    (NEW.id, '5540', 'Navidad', 'expense'),
    (NEW.id, '5550', 'Semana Santa', 'expense'),
    -- Ayuda Social
    (NEW.id, '5600', 'Ayuda Social', 'expense'),
    (NEW.id, '5610', 'Ayuda a Hermanos', 'expense'),
    (NEW.id, '5620', 'Ayuda a la Comunidad', 'expense'),
    (NEW.id, '5630', 'Despensa Solidaria', 'expense'),
    -- Otros Gastos
    (NEW.id, '5700', 'Otros Gastos', 'expense'),
    (NEW.id, '5710', 'Gastos Diocesanos', 'expense'),
    (NEW.id, '5720', 'Contribuciones', 'expense'),
    (NEW.id, '5730', 'Otros Gastos Varios', 'expense');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER create_default_accounts_trigger
  AFTER INSERT ON church_organizations
  FOR EACH ROW
  EXECUTE FUNCTION create_default_accounts();

-- Update existing organizations with new accounts
DO $$
DECLARE
  org RECORD;
BEGIN
  FOR org IN SELECT id FROM church_organizations LOOP
    -- Delete old accounts
    DELETE FROM church_accounts WHERE organization_id = org.id;
    
    -- Create new accounts by calling the function manually
    PERFORM create_default_accounts() FROM church_organizations WHERE id = org.id;
  END LOOP;
END $$;
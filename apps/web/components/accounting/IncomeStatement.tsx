'use client'

interface Account {
  id: string
  code: string
  name: string
  type: string
  balance: number
}

interface IncomeStatementProps {
  accounts: Account[]
}

export function IncomeStatement({ accounts }: IncomeStatementProps) {
  // Filter accounts by type
  const revenueAccounts = accounts.filter(a => a.type === 'revenue')
  const expenseAccounts = accounts.filter(a => a.type === 'expense')
  
  // Calculate totals
  const totalRevenue = revenueAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalExpenses = expenseAccounts.reduce((sum, account) => sum + account.balance, 0)
  const netIncome = totalRevenue - totalExpenses

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('es-CL')}`
  }

  return (
    <div className="space-y-6">
      {/* Revenue Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Ingresos</h3>
        <div className="space-y-2">
          {revenueAccounts.map(account => (
            <div key={account.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {account.code} - {account.name}
              </span>
              <span className="font-medium">{formatCurrency(account.balance)}</span>
            </div>
          ))}
          {revenueAccounts.length === 0 && (
            <p className="text-sm text-gray-500">No hay ingresos registrados</p>
          )}
        </div>
        <div className="flex justify-between border-t pt-2 mt-3">
          <span className="font-semibold">Total Ingresos</span>
          <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      {/* Expense Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Gastos</h3>
        <div className="space-y-2">
          {expenseAccounts.map(account => (
            <div key={account.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {account.code} - {account.name}
              </span>
              <span className="font-medium">{formatCurrency(account.balance)}</span>
            </div>
          ))}
          {expenseAccounts.length === 0 && (
            <p className="text-sm text-gray-500">No hay gastos registrados</p>
          )}
        </div>
        <div className="flex justify-between border-t pt-2 mt-3">
          <span className="font-semibold">Total Gastos</span>
          <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {/* Net Income */}
      <div className="border-t-2 border-gray-900 pt-4">
        <div className="flex justify-between">
          <span className="text-lg font-bold">
            {netIncome >= 0 ? 'Superávit' : 'Déficit'} del Período
          </span>
          <span className={`text-lg font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netIncome)}
          </span>
        </div>
      </div>
    </div>
  )
}
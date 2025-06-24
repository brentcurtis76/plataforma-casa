'use client'

interface Account {
  id: string
  code: string
  name: string
  type: string
  balance: number
}

interface BalanceSheetProps {
  accounts: Account[]
}

export function BalanceSheet({ accounts }: BalanceSheetProps) {
  // Filter accounts by type
  const assetAccounts = accounts.filter(a => a.type === 'asset')
  const liabilityAccounts = accounts.filter(a => a.type === 'liability')
  const equityAccounts = accounts.filter(a => a.type === 'equity')
  
  // Calculate totals
  const totalAssets = assetAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalLiabilities = liabilityAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalEquity = equityAccounts.reduce((sum, account) => sum + account.balance, 0)
  
  // Include retained earnings (net income)
  const revenueAccounts = accounts.filter(a => a.type === 'revenue')
  const expenseAccounts = accounts.filter(a => a.type === 'expense')
  const netIncome = revenueAccounts.reduce((sum, a) => sum + a.balance, 0) - 
                    expenseAccounts.reduce((sum, a) => sum + a.balance, 0)
  
  const totalEquityWithEarnings = totalEquity + netIncome
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquityWithEarnings

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('es-CL')}`
  }

  return (
    <div className="space-y-6">
      {/* Assets Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Activos</h3>
        <div className="space-y-2">
          {assetAccounts.map(account => (
            <div key={account.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {account.code} - {account.name}
              </span>
              <span className="font-medium">{formatCurrency(account.balance)}</span>
            </div>
          ))}
          {assetAccounts.length === 0 && (
            <p className="text-sm text-gray-500">No hay activos registrados</p>
          )}
        </div>
        <div className="flex justify-between border-t pt-2 mt-3 font-semibold">
          <span>Total Activos</span>
          <span>{formatCurrency(totalAssets)}</span>
        </div>
      </div>

      {/* Liabilities Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Pasivos</h3>
        <div className="space-y-2">
          {liabilityAccounts.map(account => (
            <div key={account.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {account.code} - {account.name}
              </span>
              <span className="font-medium">{formatCurrency(account.balance)}</span>
            </div>
          ))}
          {liabilityAccounts.length === 0 && (
            <p className="text-sm text-gray-500">No hay pasivos registrados</p>
          )}
        </div>
        <div className="flex justify-between border-t pt-2 mt-3 font-semibold">
          <span>Total Pasivos</span>
          <span>{formatCurrency(totalLiabilities)}</span>
        </div>
      </div>

      {/* Equity Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Patrimonio</h3>
        <div className="space-y-2">
          {equityAccounts.map(account => (
            <div key={account.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {account.code} - {account.name}
              </span>
              <span className="font-medium">{formatCurrency(account.balance)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Resultado del Ejercicio</span>
            <span className={`font-medium ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </span>
          </div>
        </div>
        <div className="flex justify-between border-t pt-2 mt-3 font-semibold">
          <span>Total Patrimonio</span>
          <span>{formatCurrency(totalEquityWithEarnings)}</span>
        </div>
      </div>

      {/* Balance Check */}
      <div className="border-t-2 border-gray-900 pt-4">
        <div className="flex justify-between">
          <span className="text-lg font-bold">Total Pasivos + Patrimonio</span>
          <span className="text-lg font-bold">{formatCurrency(totalLiabilitiesAndEquity)}</span>
        </div>
        {Math.abs(totalAssets - totalLiabilitiesAndEquity) > 0.01 && (
          <p className="text-sm text-red-600 mt-2">
            ⚠️ El balance no cuadra. Diferencia: {formatCurrency(totalAssets - totalLiabilitiesAndEquity)}
          </p>
        )}
      </div>
    </div>
  )
}
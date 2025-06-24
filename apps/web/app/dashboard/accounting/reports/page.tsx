import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/ui'
import { Button } from '@/lib/ui'
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { IncomeStatement } from '@/components/accounting/IncomeStatement'
import { BalanceSheet } from '@/components/accounting/BalanceSheet'

export default async function ReportsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get user's organization
  const { data: profile } = await supabase
    .from('church_profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) return null

  // Get current month and year
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // Get all accounts with their balances
  const { data: accounts } = await supabase
    .from('church_accounts')
    .select(`
      *,
      church_transaction_lines (
        debit,
        credit,
        church_transactions!inner (
          date,
          status,
          organization_id
        )
      )
    `)
    .eq('organization_id', profile.organization_id)
    .order('code')

  // Calculate account balances
  const accountBalances = accounts?.map(account => {
    let balance = 0
    
    account.church_transaction_lines?.forEach((line: any) => {
      if (line.church_transactions?.status === 'posted' && 
          line.church_transactions?.organization_id === profile.organization_id) {
        // For assets and expenses, debits increase, credits decrease
        // For liabilities, equity, and revenue, credits increase, debits decrease
        if (['asset', 'expense'].includes(account.type)) {
          balance += (line.debit || 0) - (line.credit || 0)
        } else {
          balance += (line.credit || 0) - (line.debit || 0)
        }
      }
    })
    
    return { ...account, balance }
  }) || []

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes Financieros</h1>
          <p className="text-gray-600 mt-1">
            Estados financieros y análisis de tu iglesia
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {currentMonth}/{currentYear}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/accounting/reports/income-statement">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Estado de Resultados
              </CardTitle>
              <CardDescription>Ingresos y gastos del período</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/accounting/reports/balance-sheet">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                Balance General
              </CardTitle>
              <CardDescription>Activos, pasivos y patrimonio</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/accounting/reports/cash-flow">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Flujo de Efectivo
              </CardTitle>
              <CardDescription>Movimientos de efectivo</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Income Statement Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Resultados - {currentMonth}/{currentYear}</CardTitle>
            <CardDescription>
              Resumen de ingresos y gastos del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeStatement accounts={accountBalances} />
          </CardContent>
        </Card>

        {/* Balance Sheet Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Balance General - {currentMonth}/{currentYear}</CardTitle>
            <CardDescription>
              Posición financiera al final del período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BalanceSheet accounts={accountBalances} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
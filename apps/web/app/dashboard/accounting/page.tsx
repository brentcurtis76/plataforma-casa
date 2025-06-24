import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@church-admin/ui'
import { Button } from '@church-admin/ui'
import { Plus, Download, Upload, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { TransactionList } from '@/components/accounting/TransactionList'

export default async function AccountingPage() {
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

  // Get current month transactions
  const currentDate = new Date()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const { data: transactions } = await supabase
    .from('church_transactions')
    .select(`
      *,
      church_transaction_lines (
        id,
        account_id,
        debit,
        credit,
        description,
        church_accounts (
          id,
          code,
          name,
          type
        )
      )
    `)
    .eq('organization_id', profile.organization_id)
    .gte('date', firstDay.toISOString())
    .lte('date', lastDay.toISOString())
    .order('date', { ascending: false })

  // Calculate totals
  let totalIncome = 0
  let totalExpenses = 0

  transactions?.forEach(transaction => {
    transaction.church_transaction_lines?.forEach(line => {
      if (line.church_accounts?.type === 'revenue') {
        totalIncome += Number(line.credit) || 0
      } else if (line.church_accounts?.type === 'expense') {
        totalExpenses += Number(line.debit) || 0
      }
    })
  })

  const netIncome = totalIncome - totalExpenses

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las finanzas de tu iglesia
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Link href="/dashboard/accounting/transactions/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Transacción
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                ${totalIncome.toLocaleString('es-CL')}
              </span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gastos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                ${totalExpenses.toLocaleString('es-CL')}
              </span>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Balance Neto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netIncome.toLocaleString('es-CL')}
              </span>
              {netIncome >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/accounting/accounts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Plan de Cuentas</CardTitle>
              <CardDescription>Gestiona tu catálogo de cuentas</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/accounting/reports">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Reportes</CardTitle>
              <CardDescription>Estados financieros y análisis</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/accounting/expenses">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Rendición de Gastos</CardTitle>
              <CardDescription>Gestiona reembolsos y gastos</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/accounting/bank">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Conexión Bancaria</CardTitle>
              <CardDescription>Importa transacciones bancarias</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Últimas transacciones del mes actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions || []} />
        </CardContent>
      </Card>
    </div>
  )
}
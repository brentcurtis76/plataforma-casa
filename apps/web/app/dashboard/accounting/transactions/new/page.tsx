'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@church-admin/ui'
import { Button } from '@church-admin/ui'
import { Input } from '@church-admin/ui'
import { Label } from '@church-admin/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@church-admin/ui'
import { Textarea } from '@church-admin/ui'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface TransactionLine {
  account_id: string
  debit: number
  credit: number
  description: string
}

export default function NewTransactionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [description, setDescription] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [lines, setLines] = useState<TransactionLine[]>([
    { account_id: '', debit: 0, credit: 0, description: '' },
    { account_id: '', debit: 0, credit: 0, description: '' }
  ])
  
  const [accounts, setAccounts] = useState<any[]>([])

  // Load accounts on mount
  useState(() => {
    loadAccounts()
  })

  const loadAccounts = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('church_accounts')
      .select('id, code, name, type')
      .order('code')
    
    if (data) {
      setAccounts(data)
    }
  }

  const addLine = () => {
    setLines([...lines, { account_id: '', debit: 0, credit: 0, description: '' }])
  }

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index))
    }
  }

  const updateLine = (index: number, field: keyof TransactionLine, value: any) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    
    // Clear opposite field when entering debit/credit
    if (field === 'debit' && value > 0) {
      newLines[index].credit = 0
    } else if (field === 'credit' && value > 0) {
      newLines[index].debit = 0
    }
    
    setLines(newLines)
  }

  const calculateTotals = () => {
    const totalDebits = lines.reduce((sum, line) => sum + Number(line.debit), 0)
    const totalCredits = lines.reduce((sum, line) => sum + Number(line.credit), 0)
    return { totalDebits, totalCredits, isBalanced: totalDebits === totalCredits }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { isBalanced } = calculateTotals()
    if (!isBalanced) {
      setError('La transacción no está balanceada. Los débitos deben ser iguales a los créditos.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Get user's organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')
      
      const { data: profile } = await supabase
        .from('church_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()
      
      if (!profile?.organization_id) throw new Error('No se encontró la organización')

      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('church_transactions')
        .insert({
          organization_id: profile.organization_id,
          date,
          description,
          reference_number: referenceNumber || null,
          status: 'posted',
          created_by: user.id
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      // Create transaction lines
      const validLines = lines.filter(line => line.account_id && (line.debit > 0 || line.credit > 0))
      const lineData = validLines.map(line => ({
        transaction_id: transaction.id,
        account_id: line.account_id,
        debit: line.debit || 0,
        credit: line.credit || 0,
        description: line.description || null
      }))

      const { error: linesError } = await supabase
        .from('church_transaction_lines')
        .insert(lineData)

      if (linesError) throw linesError

      router.push('/dashboard/accounting')
      router.refresh()
    } catch (err) {
      console.error('Error creating transaction:', err)
      setError(err instanceof Error ? err.message : 'Error al crear la transacción')
    } finally {
      setLoading(false)
    }
  }

  const { totalDebits, totalCredits, isBalanced } = calculateTotals()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/accounting">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Transacción</h1>
          <p className="text-gray-600 mt-1">
            Registra una nueva transacción contable
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Transacción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="reference">Número de Referencia</Label>
                    <Input
                      id="reference"
                      placeholder="Opcional"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe la transacción..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Transaction Lines */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Líneas de Transacción</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLine}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Línea
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {lines.map((line, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Label>Cuenta</Label>
                          <Select
                            value={line.account_id}
                            onValueChange={(value) => updateLine(index, 'account_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cuenta" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Débito</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.debit || ''}
                            onChange={(e) => updateLine(index, 'debit', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Crédito</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.credit || ''}
                            onChange={(e) => updateLine(index, 'credit', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Descripción</Label>
                          <Input
                            placeholder="Opcional"
                            value={line.description}
                            onChange={(e) => updateLine(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLine(index)}
                            disabled={lines.length <= 2}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Balance Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
                <CardDescription>
                  Los débitos y créditos deben ser iguales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Débitos:</span>
                    <span className="font-medium">${totalDebits.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Créditos:</span>
                    <span className="font-medium">${totalCredits.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Diferencia:</span>
                      <span className={`font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(totalDebits - totalCredits).toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                  {!isBalanced && (
                    <p className="text-sm text-red-600 mt-2">
                      La transacción debe estar balanceada antes de guardar.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !isBalanced}
              >
                {loading ? 'Guardando...' : 'Guardar Transacción'}
              </Button>
              <Link href="/dashboard/accounting" className="block">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
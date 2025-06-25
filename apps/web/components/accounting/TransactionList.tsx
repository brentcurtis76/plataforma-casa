'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@church-admin/ui'
import { Badge } from '@church-admin/ui'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  date: string
  description: string
  reference_number?: string
  status: string
  church_transaction_lines?: Array<{
    id: string
    debit: number
    credit: number
    description?: string
    church_accounts?: {
      id: string
      code: string
      name: string
      type: string
    }
  }>
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendiente', variant: 'outline' as const },
      posted: { label: 'Registrado', variant: 'default' as const },
      reconciled: { label: 'Conciliado', variant: 'secondary' as const },
      voided: { label: 'Anulado', variant: 'destructive' as const },
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    )
  }

  const calculateTotal = (lines: Transaction['church_transaction_lines']) => {
    if (!lines) return 0
    return lines.reduce((sum, line) => sum + (line.debit || line.credit || 0), 0)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay transacciones para mostrar</p>
        <Link href="/dashboard/accounting/transactions/new">
          <button className="mt-4 text-blue-600 hover:text-blue-800">
            Crear primera transacción
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Cuentas</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  {transaction.reference_number && (
                    <p className="text-sm text-gray-500">
                      Ref: {transaction.reference_number}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {transaction.church_transaction_lines?.slice(0, 2).map((line) => (
                    <div key={line.id} className="text-sm">
                      <span className="font-medium">{line.church_accounts?.code}</span>
                      {' - '}
                      <span className="text-gray-600">{line.church_accounts?.name}</span>
                    </div>
                  ))}
                  {transaction.church_transaction_lines && 
                   transaction.church_transaction_lines.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{transaction.church_transaction_lines.length - 2} más
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${calculateTotal(transaction.church_transaction_lines).toLocaleString('es-CL')}
              </TableCell>
              <TableCell>
                {getStatusBadge(transaction.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/accounting/transactions/${transaction.id}/edit`}>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </Link>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
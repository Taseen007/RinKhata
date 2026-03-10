import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatDateTime, cn } from '@/lib/utils'
import { ArrowLeftRight, HandCoins, Receipt, X } from 'lucide-react'

const Transactions = () => {
  const [typeFilter, setTypeFilter] = useState<'Loan' | 'Payment' | ''>('')
  const [dateFilter, setDateFilter] = useState('')

  const { data, isLoading } = useTransactions()

  const transactions = data?.data || []

  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = !typeFilter || transaction.type === typeFilter
    const dateMatch =
      !dateFilter ||
      new Date(transaction.createdAt).toISOString().substring(0, 10) === dateFilter
    return typeMatch && dateMatch
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-wrap gap-3 items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Types</option>
          <option value="Loan">Loan Created</option>
          <option value="Payment">Payment Made</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {(typeFilter || dateFilter) && (
          <button
            onClick={() => { setTypeFilter(''); setDateFilter('') }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Summary Cards */}
      {!isLoading && filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold mt-1">{filteredTransactions.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loans Created</p>
                <p className="text-2xl font-bold mt-1">
                  {filteredTransactions.filter((t) => t.type === 'Loan').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-warning" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payments Made</p>
                <p className="text-2xl font-bold mt-1">
                  {filteredTransactions.filter((t) => t.type === 'Payment').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <HandCoins className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-secondary animate-pulse rounded" />
            ))}
          </div>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Date & Time</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Person</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-3 text-sm">{formatDateTime(transaction.createdAt)}</td>
                    <td className="px-5 py-3 text-sm font-medium">{transaction.loanId?.personName || 'Unknown'}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                        transaction.type === 'Loan' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                      )}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold">
                      {(() => {
                        const isIncoming = 
                          (transaction.type === 'Payment' && transaction.loanId?.loanType === 'Lent') ||
                          (transaction.type === 'Loan' && transaction.loanId?.loanType === 'Borrowed')
                        return (
                          <span className={isIncoming ? 'text-emerald-400' : 'text-red-400'}>
                            {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{transaction.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ArrowLeftRight className="mx-auto w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-1">No transactions found</p>
          <p className="text-xs text-muted-foreground">
            {typeFilter || dateFilter ? 'Try adjusting your filters' : 'Create loans to see transactions here'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Transactions

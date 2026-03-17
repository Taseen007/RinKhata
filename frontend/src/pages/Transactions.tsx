import { useState, useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatDateTime, cn } from '@/lib/utils'
import { ArrowLeftRight, HandCoins, Receipt, X, Calendar, Filter, User } from 'lucide-react'

const Transactions = () => {
  const [typeFilter, setTypeFilter] = useState<'Loan' | 'Payment' | ''>('')
  const [dateFilter, setDateFilter] = useState('')
  const [personFilter, setPersonFilter] = useState('')

  const { data, isLoading } = useTransactions()
  const transactions = data?.data || []

  // Extract unique people for the filter
  const uniquePeople = useMemo(() => {
    const people = new Set<string>()
    transactions.forEach(t => {
      if (t.loanId?.personName) people.add(t.loanId.personName)
    })
    return Array.from(people).sort()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const typeMatch = !typeFilter || transaction.type === typeFilter
      const dateMatch = !dateFilter || new Date(transaction.createdAt).toISOString().substring(0, 10) === dateFilter
      const personMatch = !personFilter || transaction.loanId?.personName === personFilter
      return typeMatch && dateMatch && personMatch
    })
  }, [transactions, typeFilter, dateFilter, personFilter])

  const stats = useMemo(() => {
    return {
      total: filteredTransactions.length,
      loans: filteredTransactions.filter(t => t.type === 'Loan').length,
      payments: filteredTransactions.filter(t => t.type === 'Payment').length
    }
  }, [filteredTransactions])

  const getDelay = (index: number) => ({ animationDelay: `${index * 0.1}s` })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-12">
      {/* 1. Page Header Section */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-bold text-[#E2E8F0]">Transactions</h1>
          <p className="text-sm text-[#94A3B8] mt-1">History of all your financial movements</p>
        </div>
      </div>

      {/* 2. Combined Filter Section */}
      <div 
        className="animate-slide-up opacity-0 bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl space-y-4"
        style={{ animationDelay: '0.2s' }}
      >
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Filter by</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full h-11 pl-12 pr-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer appearance-none"
            >
              <option value="">All Types</option>
              <option value="Loan">Loan Created</option>
              <option value="Payment">Payment Made</option>
            </select>
          </div>

          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] transition-all [color-scheme:dark]"
            />
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer appearance-none"
            >
              <option value="">All People</option>
              {uniquePeople.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>
        </div>

        {(typeFilter || dateFilter || personFilter) && (
          <button
            onClick={() => { setTypeFilter(''); setDateFilter(''); setPersonFilter('') }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* 3. Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'TOTAL TRANSACTIONS', value: stats.total, icon: ArrowLeftRight, color: 'border-t-emerald-500', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
          { label: 'LOANS CREATED', value: stats.loans, icon: Receipt, color: 'border-t-blue-500', iconColor: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { label: 'PAYMENTS MADE', value: stats.payments, icon: HandCoins, color: 'border-t-amber-500', iconColor: 'text-amber-500', bgColor: 'bg-amber-500/10' }
        ].map((card, i) => (
          <div 
            key={card.label}
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            className={cn(
              "opacity-0 animate-pop-in bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl",
              "border-t-2", card.color
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{card.label}</p>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-[#334155]/50", card.bgColor)}>
                <card.icon className={cn("w-5 h-5", card.iconColor)} />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-white leading-tight">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* 4. Transactions Table Section */}
      <div 
        style={{ animationDelay: '0.6s' }}
        className="opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#334155]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Person</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-[#0F172A] rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <tr 
                    key={tx._id} 
                    style={getDelay(index)}
                    className="opacity-0 animate-slide-left group hover:bg-[#0F172A]/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[#E2E8F0] font-medium">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#E2E8F0]">
                      {tx.loanId?.personName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter",
                        tx.type === 'Loan' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(() => {
                        const isIncoming = 
                          (tx.type === 'Payment' && tx.loanId?.loanType === 'Lent') ||
                          (tx.type === 'Loan' && tx.loanId?.loanType === 'Borrowed')
                        return (
                          <span className={cn("text-sm font-bold", isIncoming ? 'text-emerald-400' : 'text-rose-400')}>
                            {isIncoming ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8] max-w-[200px] truncate">
                      {tx.note || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <ArrowLeftRight className="mx-auto w-12 h-12 text-[#334155] mb-4" />
                    <p className="text-[#94A3B8] font-medium">No transactions found</p>
                    <p className="text-xs text-[#64748B] mt-1">Try adjusting your filters to see more results</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions

import { useLoanStats, useLoans } from '@/hooks/useLoans'
import { useTransactions } from '@/hooks/useTransactions'
import { useWallets } from '@/hooks/useWallets'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet, HandCoins, Landmark, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useLoanStats()
  const { data: loansData, isLoading: loansLoading, error: loansError } = useLoans({ status: 'Active' })
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useTransactions()
  const { data: walletsData, isLoading: walletsLoading } = useWallets()
  const { data: allLoansData } = useLoans({})

  // Error state
  if (statsError || loansError || transactionsError) {
    const errorMessage = (statsError as any)?.response?.data?.message || 
                         (loansError as any)?.response?.data?.message || 
                         (transactionsError as any)?.response?.data?.message ||
                         (statsError as any)?.message ||
                         (loansError as any)?.message ||
                         (transactionsError as any)?.message ||
                         'Failed to load data'

    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Dashboard</h2>
        <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
        <div className="text-sm text-muted-foreground space-y-1 mb-4">
          <p className="font-medium mb-1">Troubleshooting:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure backend server is running on <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">http://localhost:5000</code></li>
            <li>Check browser console (F12) for detailed errors</li>
            <li>Try logging out and logging in again</li>
          </ul>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
          className="px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded-lg hover:bg-destructive/90 transition-colors"
        >
          Logout and Try Again
        </button>
      </div>
    )
  }

  const stats = statsData?.data
  const recentLoans = loansData?.data?.slice(0, 5) || []
  const recentTransactions = transactionsData?.data?.slice(0, 5) || []
  const wallets = walletsData?.data || []
  const allLoans = allLoansData?.data || []

  // Calculate wallet balance breakdown by type
  const walletBreakdown = wallets.reduce((acc, wallet) => {
    const type = wallet.type.toLowerCase()
    if (!acc[type]) acc[type] = 0
    acc[type] += wallet.balance
    return acc
  }, {} as Record<string, number>)

  const totalWalletBalance = Object.values(walletBreakdown).reduce((sum, val) => sum + val, 0)

  // Calculate lent/borrowed breakdowns
  const lentBreakdown = allLoans
    .filter(loan => loan.loanType === 'Lent' && loan.status === 'Active')
    .reduce((acc, loan) => {
      const type = loan.walletId?.type?.toLowerCase() || 'unknown'
      if (!acc[type]) acc[type] = 0
      acc[type] += loan.balanceAmount
      return acc
    }, {} as Record<string, number>)

  const borrowedBreakdown = allLoans
    .filter(loan => loan.loanType === 'Borrowed' && loan.status === 'Active')
    .reduce((acc, loan) => {
      const type = loan.walletId?.type?.toLowerCase() || 'unknown'
      if (!acc[type]) acc[type] = 0
      acc[type] += loan.balanceAmount
      return acc
    }, {} as Record<string, number>)

  // Build chart data from transactions
  const chartData = useMemo(() => {
    const txs = transactionsData?.data || []
    if (txs.length === 0) return []

    const grouped: Record<string, { lent: number; borrowed: number }> = {}
    txs.forEach(tx => {
      const date = new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!grouped[date]) grouped[date] = { lent: 0, borrowed: 0 }
      if (tx.loanId?.loanType === 'Lent') {
        grouped[date].lent += tx.amount
      } else {
        grouped[date].borrowed += tx.amount
      }
    })

    return Object.entries(grouped)
      .map(([date, vals]) => ({ date, ...vals }))
      .slice(-15)
  }, [transactionsData])

  const netBalance = stats?.netBalance || 0

  // Stat cards config
  const statCards = [
    {
      title: 'Available Balance',
      value: formatCurrency(totalWalletBalance),
      subtitle: 'Total money in your wallets',
      description: `${wallets.length} wallet${wallets.length !== 1 ? 's' : ''} active`,
      icon: Wallet,
      trend: totalWalletBalance >= 0 ? 'up' as const : 'down' as const,
      loading: walletsLoading,
      breakdown: walletBreakdown,
    },
    {
      title: 'Total Lent',
      value: formatCurrency(stats?.totalLentRemaining || 0),
      subtitle: 'Money you lent to others',
      description: `${stats?.activeLoans || 0} active loans`,
      icon: ArrowUpRight,
      trend: 'up' as const,
      loading: statsLoading,
      breakdown: lentBreakdown,
    },
    {
      title: 'Total Borrowed',
      value: formatCurrency(stats?.totalBorrowedRemaining || 0),
      subtitle: 'Money you borrowed from others',
      description: `${stats?.settledLoans || 0} settled loans`,
      icon: ArrowDownRight,
      trend: 'down' as const,
      loading: statsLoading,
      breakdown: borrowedBreakdown,
    },
    {
      title: 'Net Balance',
      value: formatCurrency(netBalance),
      subtitle: netBalance >= 0 ? 'You are owed this amount' : 'You owe this amount',
      description: `${stats?.totalLoans || 0} total loans`,
      icon: Landmark,
      trend: netBalance >= 0 ? 'up' as const : 'down' as const,
      loading: statsLoading,
      breakdown: {},
    },
  ]

  const BreakdownRow = ({ label, amount }: { label: string; amount: number }) => (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground capitalize">{label}:</span>
      <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-primary/20 bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
                card.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            </div>
            {card.loading ? (
              <div className="h-8 bg-secondary animate-pulse rounded mb-2" />
            ) : (
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            {Object.keys(card.breakdown).length > 0 && (
              <div className="mt-3 pt-3 border-t border-border space-y-1">
                {Object.entries(card.breakdown).map(([key, val]) => (
                  <BreakdownRow key={key} label={key} amount={val} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Transaction Activity Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Transaction Activity</h3>
            <p className="text-sm text-muted-foreground">Lent vs Borrowed over time</p>
          </div>
        </div>
        {transactionsLoading ? (
          <div className="h-[250px] bg-secondary/50 animate-pulse rounded-lg" />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="lentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="borrowedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="lent"
                stroke="#2563EB"
                fillOpacity={1}
                fill="url(#lentGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="borrowed"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#borrowedGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
            No transaction data to display
          </div>
        )}
      </div>

      {/* Active Loans Quick Stats */}
      {!statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/loans?status=Active" className="rounded-xl border border-border bg-card p-5 hover:bg-accent/50 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-3xl font-bold mt-1">{stats?.activeLoans || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HandCoins className="w-5 h-5 text-primary" />
              </div>
            </div>
          </a>
          <a href="/loans?status=Settled" className="rounded-xl border border-border bg-card p-5 hover:bg-accent/50 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Settled Loans</p>
                <p className="text-3xl font-bold mt-1">{stats?.settledLoans || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-success" />
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Recent Loans Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">Recent Active Loans</h3>
        </div>
        {loansLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-secondary animate-pulse rounded" />
            ))}
          </div>
        ) : recentLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Person</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Balance</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => (
                  <tr key={loan._id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium">{loan.personName}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                        loan.loanType === 'Lent'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      )}>
                        {loan.loanType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm">{formatCurrency(loan.principalAmount)}</td>
                    <td className="px-5 py-3 text-sm font-semibold">{formatCurrency(loan.balanceAmount)}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(loan.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground text-sm">No active loans</div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">Recent Transactions</h3>
        </div>
        {transactionsLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-secondary animate-pulse rounded" />
            ))}
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="divide-y divide-border">
            {recentTransactions.map((transaction) => {
              const displayName = transaction.loanId?.personName || 
                                 transaction.note?.split('-')[1]?.trim() ||
                                 transaction.note || 
                                 'Unknown'
              
              return (
                <div key={transaction._id} className="flex items-center justify-between px-5 py-3 hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.type} &bull; {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <p className={cn(
                    "text-sm font-semibold",
                    transaction.type === 'Loan' ? 'text-warning' : 'text-success'
                  )}>
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground text-sm">No transactions yet</div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

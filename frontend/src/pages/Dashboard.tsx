import { useLoanStats } from '@/hooks/useLoans'
import { useTransactions } from '@/hooks/useTransactions'
import { useWallets } from '@/hooks/useWallets'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { RefreshCcw, CheckCircle2, ArrowRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Transaction } from '@/services/transactionService'

const CountUp = ({ end, duration = 2000, prefix = 'BDT ' }: { end: number; duration?: number; prefix?: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOutQuad = (t: number) => t * (2 - t)
      setCount(Math.floor(easeOutQuad(progress) * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [end, duration])

  return (
    <span>
      {prefix}{count.toLocaleString()}
    </span>
  )
}

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useLoanStats()
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions()
  const { data: walletsData } = useWallets()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = statsData?.data
  const wallets = walletsData?.data || []
  const recentTransactions = transactionsData?.data?.slice(0, 5) || []

  const totalWalletBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)
  const netBalance = stats?.netBalance || 0

  // Animation delay calculation
  const getDelay = (index: number) => ({ animationDelay: `${index * 0.15}s` })

  const chartData = useMemo(() => {
    const txs = transactionsData?.data || []
    if (txs.length === 0) return []
    
    // Create map of months for the last 6 months up to now
    const monthData: Record<string, { lent: number; borrowed: number }> = {}
    const months: string[] = []
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthName = d.toLocaleString('en-US', { month: 'short' })
      months.push(monthName)
      monthData[monthName] = { lent: 0, borrowed: 0 }
    }

    // Process real transactions
    txs.forEach((tx: Transaction) => {
      const date = new Date(tx.createdAt)
      const monthName = date.toLocaleString('en-US', { month: 'short' })
      if (monthData[monthName]) {
        if (tx.type === 'Loan' || tx.type === 'Payment') {
          // Determine if lent or borrowed based on loan metadata
          // Assuming amount is always positive, we check tx.type or loan type
          // For now, simple grouping by type if available, otherwise mock-ish but based on real count
          if (tx.loanId?.loanType === 'Lent') {
            monthData[monthName].lent += tx.amount
          } else {
            monthData[monthName].borrowed += tx.amount
          }
        }
      }
    })

    return months.map(name => ({
      name,
      lent: monthData[name].lent,
      borrowed: monthData[name].borrowed
    }))
  }, [transactionsData])

  const statCards = [
    {
      title: 'AVAILABLE BALANCE',
      value: totalWalletBalance,
      description: `${wallets.length} wallets active`,
      color: 'border-t-emerald-500'
    },
    {
      title: 'TOTAL LENT',
      value: stats?.totalLentRemaining || 0,
      description: `${stats?.activeLoans || 0} active loans`,
      color: 'border-t-blue-500'
    },
    {
      title: 'TOTAL BORROWED',
      value: stats?.totalBorrowedRemaining || 0,
      description: `${stats?.settledLoans || 0} settled loans`,
      color: 'border-t-red-500'
    },
    {
      title: 'NET BALANCE',
      value: netBalance,
      description: `${stats?.totalLoans || 0} total loans`,
      color: 'border-t-cyan-500'
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* Header with Live Pulse */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-green" />
            <h1 className="text-2xl font-bold text-[#E2E8F0]">Lending Dashboard</h1>
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">Overview of all wallet and loan activity</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-[#E2E8F0] font-bold">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[11px] text-[#475569] font-bold uppercase tracking-wider">
            {currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div 
            key={card.title} 
            style={getDelay(i)}
            className={cn(
              "opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl",
              "border-t-2", card.color,
              "hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-2xl hover:border-[#475569] transition-all duration-500 ease-out cursor-default group"
            )}
          >
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-4 group-hover:text-[#94A3B8] transition-colors">{card.title}</p>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white leading-tight group-hover:scale-[1.05] origin-left transition-transform duration-500">
                {statsLoading ? (
                  <div className="h-9 w-32 bg-slate-700 animate-pulse rounded" />
                ) : (
                  <CountUp end={card.value} />
                )}
              </h2>
              <p className="text-sm text-[#94A3B8] group-hover:text-[#E2E8F0] transition-colors">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Chart and Bottom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Activity Chart Section */}
        <div 
          style={getDelay(4)}
          className="lg:col-span-2 opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Transaction Activity</h3>
              <p className="text-sm text-[#94A3B8]">Lent vs Borrowed over time</p>
            </div>
            <div className="flex items-center gap-6 text-xs font-semibold">
              <div className="flex items-center gap-2 text-[#2563EB]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Lent
              </div>
              <div className="flex items-center gap-2 text-[#EF4444]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Borrowed
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
          {transactionsLoading ? (
            <div className="h-full w-full bg-slate-700 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} key={`chart-${chartData.length}`}>
                <defs>
                  <linearGradient id="colorLent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickFormatter={(value) => `৳${value > 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                />
                <Tooltip
                  cursor={{ stroke: '#334155', strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="lent" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLent)" 
                  isAnimationActive={true}
                  animationDuration={3500}
                  animationBegin={500}
                  animationEasing="ease-in-out"
                />
                <Area 
                  type="monotone" 
                  dataKey="borrowed" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBorrowed)" 
                  isAnimationActive={true}
                  animationDuration={3500}
                  animationBegin={800}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        </div>

        {/* Vertical Status Cards */}
        <div className="space-y-6">
          {/* Active Loans Card */}
          <div 
            style={getDelay(5)}
            className="opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Active Loans</p>
              <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center border border-[#334155]">
                <RefreshCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
            </div>
            <h4 className="text-5xl font-bold text-white mb-4">{stats?.activeLoans || 0}</h4>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-[#0F172A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(((stats?.activeLoans || 0) / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#475569] font-bold uppercase">Active Pipeline</p>
            </div>
          </div>

          {/* Settled Loans Card */}
          <div 
            style={getDelay(6)}
            className="opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Settled Loans</p>
              <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center border border-[#334155]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
            <h4 className="text-5xl font-bold text-white mb-4">{stats?.settledLoans || 0}</h4>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-[#0F172A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(((stats?.settledLoans || 0) / 20) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#475569] font-bold uppercase">Monthly Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section (Restored) */}
      <div 
        style={getDelay(7)}
        className="opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-xl mb-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <p className="text-sm text-[#94A3B8]">Latest money movements</p>
          </div>
          <Link to="/transactions" className="flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#334155]">
                <th className="pb-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="pb-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Person</th>
                <th className="pb-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Type</th>
                <th className="pb-4 text-right text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50">
              {transactionsLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="py-4">
                      <div className="h-4 bg-slate-700/50 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((tx: Transaction) => (
                  <tr key={tx._id} className="group hover:bg-[#0F172A]/30 transition-colors">
                    <td className="py-4 text-sm text-[#E2E8F0] font-medium">{formatDate(tx.createdAt)}</td>
                    <td className="py-4 text-sm text-[#94A3B8]">{tx.loanId?.personName || 'Unknown'}</td>
                    <td className="py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter",
                        tx.loanId?.loanType === 'Lent' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      )}>
                        {tx.loanId?.loanType === 'Lent' ? 'Lent' : 'Borrowed'}
                      </span>
                    </td>
                    <td className={cn(
                      "py-4 text-sm font-bold text-right",
                      tx.loanId?.loanType === 'Lent' ? "text-emerald-400" : "text-red-400"
                    )}>
                      {tx.loanId?.loanType === 'Lent' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-[#64748B]">No recent transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

import { useLoanStats, useLoans } from '../hooks/useLoans'
import { useTransactions } from '../hooks/useTransactions'
import { useWallets } from '../hooks/useWallets'

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useLoanStats()
  const { data: loansData, isLoading: loansLoading, error: loansError } = useLoans({ status: 'Active' })
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useTransactions()
  const { data: walletsData, isLoading: walletsLoading } = useWallets()

  // Display errors if any API call fails
  if (statsError || loansError || transactionsError) {
    const errorMessage = (statsError as any)?.response?.data?.message || 
                         (loansError as any)?.response?.data?.message || 
                         (transactionsError as any)?.response?.data?.message ||
                         (statsError as any)?.message ||
                         (loansError as any)?.message ||
                         (transactionsError as any)?.message ||
                         'Failed to load data'

    const errorCode = (statsError as any)?.response?.status || 
                      (loansError as any)?.response?.status || 
                      (transactionsError as any)?.response?.status

    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-red-700 mb-2">{errorMessage}</p>
        {errorCode && <p className="text-sm text-red-600 mb-2">Error Code: {errorCode}</p>}
        <div className="mt-4 text-sm text-red-700">
          <p className="font-semibold mb-1">Troubleshooting:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure backend server is running on <code className="bg-red-100 px-1 rounded">http://localhost:5000</code></li>
            <li>Check browser console (F12) for detailed errors</li>
            <li>Try logging out and logging in again</li>
          </ul>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

  // Calculate wallet balance breakdown by type
  const walletBreakdown = wallets.reduce((acc, wallet) => {
    const type = wallet.type.toLowerCase()
    if (!acc[type]) {
      acc[type] = 0
    }
    acc[type] += wallet.balance
    return acc
  }, {} as Record<string, number>)

  const totalWalletBalance = Object.values(walletBreakdown).reduce((sum, val) => sum + val, 0)

  // Get all loans to calculate lent/borrowed breakdown by wallet type
  const { data: allLoansData } = useLoans({})
  const allLoans = allLoansData?.data || []

  // Calculate lent breakdown by wallet type
  const lentBreakdown = allLoans
    .filter(loan => loan.loanType === 'Lent' && loan.status === 'Active')
    .reduce((acc, loan) => {
      const type = loan.walletId?.type?.toLowerCase() || 'unknown'
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type] += loan.balanceAmount
      return acc
    }, {} as Record<string, number>)

  // Calculate borrowed breakdown by wallet type
  const borrowedBreakdown = allLoans
    .filter(loan => loan.loanType === 'Borrowed' && loan.status === 'Active')
    .reduce((acc, loan) => {
      const type = loan.walletId?.type?.toLowerCase() || 'unknown'
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type] += loan.balanceAmount
      return acc
    }, {} as Record<string, number>)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available Balance</h3>
          {walletsLoading ? (
            <div className="h-9 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <>
              <p className={`text-3xl font-bold ${
                totalWalletBalance >= 0 ? 'text-primary-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalWalletBalance)}
              </p>
              {Object.keys(walletBreakdown).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                  {walletBreakdown.cash !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Cash:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(walletBreakdown.cash)}</span>
                    </div>
                  )}
                  {walletBreakdown.bank !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(walletBreakdown.bank)}</span>
                    </div>
                  )}
                  {walletBreakdown.mfs !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">MFS:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(walletBreakdown.mfs)}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Total money in your wallets
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Lent</h3>
          {statsLoading ? (
            <div className="h-9 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(stats?.totalLentRemaining || 0)}
              </p>
              {Object.keys(lentBreakdown).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                  {lentBreakdown.cash !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Cash:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(lentBreakdown.cash)}</span>
                    </div>
                  )}
                  {lentBreakdown.bank !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(lentBreakdown.bank)}</span>
                    </div>
                  )}
                  {lentBreakdown.mfs !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">MFS:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(lentBreakdown.mfs)}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Money you lent to others (remaining)
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Borrowed</h3>
          {statsLoading ? (
            <div className="h-9 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(stats?.totalBorrowedRemaining || 0)}
              </p>
              {Object.keys(borrowedBreakdown).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                  {borrowedBreakdown.cash !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Cash:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(borrowedBreakdown.cash)}</span>
                    </div>
                  )}
                  {borrowedBreakdown.bank !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(borrowedBreakdown.bank)}</span>
                    </div>
                  )}
                  {borrowedBreakdown.mfs !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">MFS:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(borrowedBreakdown.mfs)}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Money you borrowed from others (remaining)
          </p>
        </div>
      </div>

      {/* Net Balance Summary */}
      {!statsLoading && (
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg shadow text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-2 opacity-90">Net Balance (Lent - Borrowed)</h3>
              <p className="text-4xl font-bold">
                {formatCurrency(stats?.netBalance || 0)}
              </p>
              <p className="text-sm mt-2 opacity-90">
                {(stats?.netBalance || 0) >= 0
                  ? 'You are owed this amount overall'
                  : 'You owe this amount overall'}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs opacity-90 mb-1">Available Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(totalWalletBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Loans Stats */}
      {!statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a href="/loans?status=Active" className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer">
            <h3 className="text-sm font-medium mb-2 opacity-90">Active Loans</h3>
            <p className="text-4xl font-bold">{stats?.activeLoans || 0}</p>
          </a>
          <a href="/loans?status=Settled" className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow text-white hover:from-purple-600 hover:to-purple-700 transition-all cursor-pointer">
            <h3 className="text-sm font-medium mb-2 opacity-90">Settled Loans</h3>
            <p className="text-4xl font-bold">{stats?.settledLoans || 0}</p>
          </a>
        </div>
      )}

      {/* Recent Loans */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Active Loans</h2>
        {loansLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : recentLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3 font-medium">Person</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => (
                  <tr key={loan._id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{loan.personName}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          loan.loanType === 'Lent'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {loan.loanType}
                      </span>
                    </td>
                    <td className="py-3">{formatCurrency(loan.principalAmount)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(loan.balanceAmount)}</td>
                    <td className="py-3 text-gray-600 text-sm">{formatDate(loan.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No active loans</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        {transactionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              // Determine display name from loanId or note
              const displayName = transaction.loanId?.personName || 
                                 transaction.note?.split('-')[1]?.trim() ||
                                 transaction.note || 
                                 'Unknown'
              
              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.type} • {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <p className={`font-bold ${
                    transaction.type === 'Loan' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard

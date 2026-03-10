import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'

const Transactions = () => {
  const [typeFilter, setTypeFilter] = useState<'Loan' | 'Payment' | ''>('')
  const [dateFilter, setDateFilter] = useState('')

  const { data, isLoading } = useTransactions()

  const transactions = data?.data || []

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = !typeFilter || transaction.type === typeFilter
    const dateMatch =
      !dateFilter ||
      new Date(transaction.createdAt).toISOString().substring(0, 10) === dateFilter
    return typeMatch && dateMatch
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transactions</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          <option value="Loan">Loan Created</option>
          <option value="Payment">Payment Made</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {(typeFilter || dateFilter) && (
          <button
            onClick={() => {
              setTypeFilter('')
              setDateFilter('')
            }}
            className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Transaction Summary */}
      {!isLoading && filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
            <p className="text-sm opacity-90 mb-2">Total Transactions</p>
            <p className="text-3xl font-bold">{filteredTransactions.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
            <p className="text-sm opacity-90 mb-2">Loans Created</p>
            <p className="text-3xl font-bold">
              {filteredTransactions.filter((t) => t.type === 'Loan').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
            <p className="text-sm opacity-90 mb-2">Payments Made</p>
            <p className="text-3xl font-bold">
              {filteredTransactions.filter((t) => t.type === 'Payment').length}
            </p>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.loanId?.personName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'Loan'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {(() => {
                        const isIncoming = 
                          (transaction.type === 'Payment' && transaction.loanId?.loanType === 'Lent') ||
                          (transaction.type === 'Loan' && transaction.loanId?.loanType === 'Borrowed')
                        
                        return (
                          <span className={isIncoming ? 'text-green-600' : 'text-red-600'}>
                            {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount).replace('BDT', 'BDT ')}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 mb-2">No transactions found</p>
          <p className="text-sm text-gray-400">
            {typeFilter || dateFilter
              ? 'Try adjusting your filters'
              : 'Create loans to see transactions here'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Transactions

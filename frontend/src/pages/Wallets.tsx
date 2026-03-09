const Wallets = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          + Add Wallet
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cash Wallet</h3>
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Cash
            </span>
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-4">$0</p>
          <button className="w-full px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
            Add Transaction
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Create wallets to manage your finances</p>
      </div>
    </div>
  )
}

export default Wallets

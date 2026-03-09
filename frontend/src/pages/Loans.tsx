const Loans = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          + Create Loan
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by borrower name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="settled">Settled</option>
        </select>
      </div>

      {/* Loans List */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No loans yet. Create your first loan!</p>
      </div>
    </div>
  )
}

export default Loans

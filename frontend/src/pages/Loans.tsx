import { useState } from 'react'
import { useLoans, useCreateLoan, useUpdateLoan, useDeleteLoan, usePayLoan } from '../hooks/useLoans'
import { useWallets } from '../hooks/useWallets'
import type { Loan, CreateLoanData } from '../services/loanService'

const Loans = () => {
  // Read status from URL params on mount
  const urlParams = new URLSearchParams(window.location.search)
  const initialStatus = urlParams.get('status') as 'Active' | 'Settled' | '' || ''
  
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null)
  const [payingLoan, setPayingLoan] = useState<Loan | null>(null)
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Settled' | ''>(initialStatus)
  const [typeFilter, setTypeFilter] = useState<'Lent' | 'Borrowed' | ''>('')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState<CreateLoanData>({
    walletId: '',
    personName: '',
    personContact: '',
    loanType: 'Lent',
    principalAmount: 0,
    purposeNote: '',
    dueDate: '',
  })

  const [paymentAmount, setPaymentAmount] = useState(0)

  const { data: walletsData } = useWallets()
  const { data, isLoading } = useLoans({ 
    status: statusFilter || undefined,
    loanType: typeFilter || undefined 
  })
  const createLoan = useCreateLoan()
  const updateLoan = useUpdateLoan()
  const deleteLoan = useDeleteLoan()
  const payLoan = usePayLoan()

  const wallets = walletsData?.data || []
  const loans = data?.data || []

  // Filter loans by search term
  const filteredLoans = loans.filter(loan =>
    loan.personName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingLoan) {
        await updateLoan.mutateAsync({
          id: editingLoan._id,
          data: {
            personName: formData.personName,
            personContact: formData.personContact,
            purposeNote: formData.purposeNote,
            dueDate: formData.dueDate,
          },
        })
      } else {
        await createLoan.mutateAsync(formData)
      }
      
      setShowModal(false)
      resetForm()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving loan')
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!payingLoan) return

    try {
      await payLoan.mutateAsync({
        id: payingLoan._id,
        data: { 
          amount: paymentAmount,
          walletId: payingLoan.walletId._id,
          note: payingLoan.loanType === 'Lent' 
            ? `Received from ${payingLoan.personName}` 
            : `Payment to ${payingLoan.personName}`
        },
      })
      
      setShowPayModal(false)
      setPayingLoan(null)
      setPaymentAmount(0)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error processing payment')
    }
  }

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan)
    setFormData({
      walletId: loan.walletId._id,
      personName: loan.personName,
      personContact: loan.personContact,
      loanType: loan.loanType,
      principalAmount: loan.principalAmount,
      purposeNote: loan.purposeNote || '',
      dueDate: loan.dueDate ? loan.dueDate.substring(0, 10) : '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan.mutateAsync(id)
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting loan')
      }
    }
  }

  const handlePay = (loan: Loan) => {
    setPayingLoan(loan)
    setPaymentAmount(loan.balanceAmount)
    setShowPayModal(true)
  }

  const resetForm = () => {
    setFormData({
      walletId: '',
      personName: '',
      personContact: '',
      loanType: 'Lent',
      principalAmount: 0,
      purposeNote: '',
      dueDate: '',
    })
    setEditingLoan(null)
  }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Loan
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by person name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Settled">Settled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          <option value="Lent">Lent</option>
          <option value="Borrowed">Borrowed</option>
        </select>
      </div>

      {/* Loans List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredLoans.length > 0 ? (
        <div className="space-y-4">
          {filteredLoans.map((loan) => (
            <div key={loan._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{loan.personName}</h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        loan.loanType === 'Lent'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {loan.loanType}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        loan.status === 'Active'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Contact: {loan.personContact}</p>
                  <p className="text-sm text-gray-600 mb-1">Wallet: {loan.walletId?.name || 'Unknown'}</p>
                  {loan.purposeNote && (
                    <p className="text-sm text-gray-600 mb-1">Purpose: {loan.purposeNote}</p>
                  )}
                  {loan.dueDate && (
                    <p className="text-sm text-gray-600">Due: {formatDate(loan.dueDate)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Principal</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(loan.principalAmount)}</p>
                  <p className="text-sm text-gray-600 mb-1">Paid: {formatCurrency(loan.paidAmount)}</p>
                  <p className="text-sm font-bold text-primary-600">
                    {loan.loanType === 'Lent' ? 'To Receive:' : 'To Pay:'} {formatCurrency(loan.balanceAmount)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {loan.status === 'Active' && (
                  <button
                    onClick={() => handlePay(loan)}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {loan.loanType === 'Lent' ? 'Receive' : 'Pay'}
                  </button>
                )}
                <button
                  onClick={() => handleEdit(loan)}
                  className="px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loan._id)}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No loans found</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Loan
          </button>
        </div>
      )}

      {/* Add/Edit Loan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingLoan ? 'Edit Loan' : 'Create New Loan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person Name *
                </label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter person name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact *
                </label>
                <input
                  type="text"
                  value={formData.personContact}
                  onChange={(e) => setFormData({ ...formData, personContact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Phone or email"
                  required
                />
              </div>

              {!editingLoan && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wallet *
                    </label>
                    <select
                      value={formData.walletId}
                      onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a wallet</option>
                      {wallets.map((wallet) => (
                        <option key={wallet._id} value={wallet._id}>
                          {wallet.name} ({wallet.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Type *
                    </label>
                    <select
                      value={formData.loanType}
                      onChange={(e) => setFormData({ ...formData, loanType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="Lent">Lent (I gave money)</option>
                      <option value="Borrowed">Borrowed (I took money)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      value={formData.principalAmount || ''}
                      onChange={(e) => setFormData({ ...formData, principalAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose Note
                </label>
                <textarea
                  value={formData.purposeNote}
                  onChange={(e) => setFormData({ ...formData, purposeNote: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Optional note about the loan"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoan.isPending || updateLoan.isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {createLoan.isPending || updateLoan.isPending
                    ? 'Saving...'
                    : editingLoan
                    ? 'Update'
                    : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && payingLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {payingLoan.loanType === 'Lent' ? 'Receive Payment' : 'Make Payment'}
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">Loan Details:</p>
              <p className="font-semibold text-lg">{payingLoan.personName}</p>
              <p className="text-sm text-gray-600">Balance: {formatCurrency(payingLoan.balanceAmount)}</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <input
                  type="number"
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter payment amount"
                  min="0.01"
                  max={payingLoan.balanceAmount}
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Maximum: {formatCurrency(payingLoan.balanceAmount)}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayModal(false)
                    setPayingLoan(null)
                    setPaymentAmount(0)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payLoan.isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {payLoan.isPending ? 'Processing...' : payingLoan.loanType === 'Lent' ? 'Receive' : 'Pay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Loans

import { useState } from 'react'
import { useLoans, useCreateLoan, useUpdateLoan, useDeleteLoan, usePayLoan } from '@/hooks/useLoans'
import { useWallets } from '@/hooks/useWallets'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Plus, Search, X, Pencil, Trash2, HandCoins } from 'lucide-react'
import type { Loan, CreateLoanData } from '@/services/loanService'

const Loans = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loans</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Loan
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by person name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Settled">Settled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="h-20 bg-secondary animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : filteredLoans.length > 0 ? (
        <div className="space-y-3">
          {filteredLoans.map((loan) => (
            <div key={loan._id} className="rounded-xl border border-border bg-card p-5 hover:bg-accent/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{loan.personName}</h3>
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      loan.loanType === 'Lent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    )}>
                      {loan.loanType}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      loan.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                    )}>
                      {loan.status}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-sm text-muted-foreground">
                    <p>Contact: {loan.personContact}</p>
                    <p>Wallet: {loan.walletId?.name || 'Unknown'}</p>
                    {loan.purposeNote && <p>Purpose: {loan.purposeNote}</p>}
                    {loan.dueDate && <p>Due: {formatDate(loan.dueDate)}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Principal</p>
                  <p className="text-2xl font-bold mb-1">{formatCurrency(loan.principalAmount)}</p>
                  <p className="text-xs text-muted-foreground">Paid: {formatCurrency(loan.paidAmount)}</p>
                  <p className={cn("text-sm font-semibold mt-1", loan.loanType === 'Lent' ? 'text-success' : 'text-destructive')}>
                    {loan.loanType === 'Lent' ? 'To Receive:' : 'To Pay:'} {formatCurrency(loan.balanceAmount)}
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              {loan.principalAmount > 0 && (
                <div className="mt-1 mb-2">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Repayment Progress</span>
                    <span className="font-medium">{Math.round((loan.paidAmount / loan.principalAmount) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        (() => {
                          const pct = (loan.paidAmount / loan.principalAmount) * 100
                          if (pct <= 30) return 'bg-destructive'
                          if (pct <= 70) return 'bg-warning'
                          return 'bg-success'
                        })()
                      )}
                      style={{ width: `${Math.min((loan.paidAmount / loan.principalAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-border">
                {loan.status === 'Active' && (
                  <button
                    onClick={() => handlePay(loan)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                  >
                    <HandCoins className="w-3.5 h-3.5" />
                    {loan.loanType === 'Lent' ? 'Receive' : 'Pay'}
                  </button>
                )}
                <button
                  onClick={() => handleEdit(loan)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loan._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No loans found</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Your First Loan
          </button>
        </div>
      )}

      {/* Add/Edit Loan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="rounded-xl border border-border bg-card shadow-xl w-full max-w-md p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editingLoan ? 'Edit Loan' : 'Create New Loan'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm() }} className="p-1 rounded-lg hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Person Name *</label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter person name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Contact *</label>
                <input
                  type="text"
                  value={formData.personContact}
                  onChange={(e) => setFormData({ ...formData, personContact: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Phone or email"
                  required
                />
              </div>

              {!editingLoan && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Wallet *</label>
                    <select
                      value={formData.walletId}
                      onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Loan Type *</label>
                    <select
                      value={formData.loanType}
                      onChange={(e) => setFormData({ ...formData, loanType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      required
                    >
                      <option value="Lent">Lent (I gave money)</option>
                      <option value="Borrowed">Borrowed (I took money)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Amount *</label>
                    <input
                      type="number"
                      value={formData.principalAmount || ''}
                      onChange={(e) => setFormData({ ...formData, principalAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Purpose Note</label>
                <textarea
                  value={formData.purposeNote}
                  onChange={(e) => setFormData({ ...formData, purposeNote: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  placeholder="Optional note about the loan"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Due Date (Optional)</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm() }}
                  className="flex-1 px-4 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoan.isPending || updateLoan.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {createLoan.isPending || updateLoan.isPending ? 'Saving...' : editingLoan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && payingLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-xl border border-border bg-card shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {payingLoan.loanType === 'Lent' ? 'Receive Payment' : 'Make Payment'}
              </h2>
              <button onClick={() => { setShowPayModal(false); setPayingLoan(null); setPaymentAmount(0) }} className="p-1 rounded-lg hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="bg-secondary rounded-lg p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Loan Details</p>
              <p className="font-semibold">{payingLoan.personName}</p>
              <p className="text-sm text-muted-foreground">Balance: {formatCurrency(payingLoan.balanceAmount)}</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Payment Amount *</label>
                <input
                  type="number"
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter payment amount"
                  min="0.01"
                  max={payingLoan.balanceAmount}
                  step="0.01"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Maximum: {formatCurrency(payingLoan.balanceAmount)}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowPayModal(false); setPayingLoan(null); setPaymentAmount(0) }}
                  className="flex-1 px-4 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payLoan.isPending}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
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

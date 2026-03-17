import { useState, useMemo } from 'react'
import { useLoans, useCreateLoan, useUpdateLoan, useDeleteLoan, usePayLoan } from '@/hooks/useLoans'
import { useWallets } from '@/hooks/useWallets'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Plus, Search, X, Pencil, Trash2, HandCoins, Filter } from 'lucide-react'
import type { Loan, CreateLoanData } from '@/services/loanService'
import { AxiosError } from 'axios'

interface ApiError {
  message: string
}

const Loans = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const initialStatus = urlParams.get('status') as 'Active' | 'Settled' | '' || ''
  
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null)
  const [payingLoan, setPayingLoan] = useState<Loan | null>(null)
  const [paymentWalletId, setPaymentWalletId] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Settled' | ''>(initialStatus)
  const [typeFilter, setTypeFilter] = useState<'Lent' | 'Borrowed' | ''>('')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState<Omit<CreateLoanData, 'principalAmount'> & { principalAmount: number | '' }>({
    walletId: '',
    personName: '',
    personContact: '',
    loanType: 'Lent',
    principalAmount: '',
    purposeNote: '',
    dueDate: '',
  })
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('')

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

  const filteredLoans = useMemo(() => {
    const loansData = data?.data || []
    return loansData.filter(loan =>
      loan.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.personContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.purposeNote && loan.purposeNote.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [data?.data, searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.principalAmount || Number(formData.principalAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    if (!formData.walletId) {
      alert('Please select a wallet')
      return
    }
    try {
      if (editingLoan) {
        await updateLoan.mutateAsync({
          id: editingLoan._id,
          data: {
            personName: formData.personName,
            personContact: formData.personContact,
            purposeNote: formData.purposeNote,
            dueDate: formData.dueDate || undefined,
          },
        })
      } else {
        const payload = {
          ...formData,
          principalAmount: Number(formData.principalAmount),
          dueDate: formData.dueDate || undefined,
        }
        await createLoan.mutateAsync(payload as any)
      }
      setShowModal(false)
      resetForm()
    } catch (error) {
      const err = error as any
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors?.[0]?.msg || 
                         'Error saving loan'
      alert(errorMessage)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payingLoan || !paymentAmount || Number(paymentAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    try {
      await payLoan.mutateAsync({
        id: payingLoan._id,
        data: { 
          amount: Number(paymentAmount),
          walletId: paymentWalletId,
          note: payingLoan.loanType === 'Lent' 
            ? `Received from ${payingLoan.personName}` 
            : `Payment to ${payingLoan.personName}`
        },
      })
      setShowPayModal(false)
      setPayingLoan(null)
      setPaymentAmount('')
      setPaymentWalletId('')
    } catch (error) {
      const err = error as AxiosError<ApiError>
      alert(err.response?.data?.message || 'Error processing payment')
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
      } catch (error) {
        const err = error as AxiosError<ApiError>
        alert(err.response?.data?.message || 'Error deleting loan')
      }
    }
  }

  const handlePay = (loan: Loan) => {
    setPayingLoan(loan)
    setPaymentAmount(loan.balanceAmount)
    setPaymentWalletId(loan.walletId._id)
    setShowPayModal(true)
  }

  const resetForm = () => {
    setFormData({
      walletId: '',
      personName: '',
      personContact: '',
      loanType: 'Lent',
      principalAmount: '',
      purposeNote: '',
      dueDate: '',
    })
    setEditingLoan(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-12">
      {/* 1. Page Header Section */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-bold text-[#E2E8F0]">Loans</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage and track your lending activities</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="animate-pop-in opacity-0 inline-flex items-center gap-2 h-11 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#2563EB]/20"
          style={{ animationDelay: '0.2s' }}
        >
          <Plus className="w-4 h-4" />
          Create Loan
        </button>
      </div>

      {/* 2. Filter & Search Section */}
      <div 
        className="animate-slide-up opacity-0 bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl space-y-6"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
            <input
              type="text"
              placeholder="Search by person name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'Active' | 'Settled' | '')}
                className="appearance-none h-11 pl-4 pr-10 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Settled">Settled</option>
              </select>
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'Lent' | 'Borrowed' | '')}
                className="appearance-none h-11 pl-4 pr-10 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Lent">Lent</option>
                <option value="Borrowed">Borrowed</option>
              </select>
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Tabs Section */}
        <div className="flex gap-2 p-1 bg-[#0F172A] rounded-xl w-fit">
          {['All', 'Lent', 'Borrowed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab === 'All' ? '' : tab as 'Lent' | 'Borrowed')}
              className={cn(
                "px-6 py-2 text-xs font-bold rounded-[10px] transition-all duration-200",
                (typeFilter === tab || (typeFilter === '' && tab === 'All'))
                  ? "bg-[#1E293B] text-[#E2E8F0] shadow-sm"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Loans List Section */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#1E293B] border border-[#334155] rounded-2xl animate-pulse" />
          ))
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => (
            <div 
              key={loan._id} 
              className="opacity-0 animate-slide-left bg-[#1E293B] border border-[#334155] rounded-2xl p-5 hover:bg-[#0F172A]/30 transition-all hover:translate-x-1 group shadow-lg"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-5">
                {/* Person Avatar Circle */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  loan.loanType === 'Lent' ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"
                )}>
                  {loan.personName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-[#E2E8F0] truncate">{loan.personName}</h3>
                    <div className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider",
                      loan.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                    )}>
                      {loan.status}
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] font-medium truncate">
                    {loan.purposeNote || 'Personal loan'} • {formatDate(loan.createdAt)}
                  </p>
                  
                  {/* Payment Progress Bar */}
                  <div className="mt-3 space-y-1.5 max-w-[200px]">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                      <span className={cn(
                        loan.status === 'Settled' ? "text-emerald-500" : "text-[#475569]"
                      )}>
                        {loan.status === 'Settled' ? 'Payment Settled' : 'Repayment Progress'}
                      </span>
                      <span className="text-[#E2E8F0]">{Math.round((loan.paidAmount / loan.principalAmount) * 100)}%</span>
                    </div>
                    <div className="h-1 w-full bg-[#0F172A] rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          loan.status === 'Settled' ? "bg-emerald-500" : (loan.loanType === 'Lent' ? "bg-emerald-500" : "bg-blue-500")
                        )}
                        style={{ width: `${(loan.paidAmount / loan.principalAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {loan.status === 'Settled' ? (
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-bold text-emerald-400 leading-tight">
                        {formatCurrency(loan.principalAmount)}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-500/50 uppercase mt-1">
                        Fully Settled
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className={cn(
                        "text-lg font-bold leading-tight",
                        loan.loanType === 'Lent' ? "text-blue-400" : "text-red-400"
                      )}>
                        {loan.loanType === 'Lent' ? '+' : '-'} {formatCurrency(loan.balanceAmount)}
                      </p>
                      <p className="text-[10px] font-bold text-[#475569] uppercase mt-1">
                        {loan.loanType === 'Lent' ? 'You lent' : 'You borrowed'}
                      </p>
                    </>
                  )}
                </div>

                {/* Quick Actions (Appear on Hover) */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  {loan.status === 'Active' && (
                    <button
                      onClick={() => handlePay(loan)}
                      title={loan.loanType === 'Lent' ? 'Receive Payment' : 'Make Payment'}
                      className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <HandCoins className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(loan)}
                    title="Edit Loan"
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(loan._id)}
                    title="Delete Loan"
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div 
            className="animate-slide-up opacity-0 rounded-2xl border border-dashed border-[#334155] bg-[#0F172A]/30 p-12 text-center"
            style={{ animationDelay: '0.4s' }}
          >
            <p className="text-[#64748B] mb-6 font-medium">No loans matching your filters</p>
            <button
              onClick={() => { resetForm(); setShowModal(true) }}
              className="px-6 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-[#E2E8F0] text-sm font-semibold rounded-xl transition-all border border-[#334155]"
            >
              Add New Loan
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Loan Modal (Updated Style) */}
      {showModal && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="animate-pop-in bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-[#64748B] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingLoan ? 'Edit Loan Details' : 'Create New Loan Record'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#0F172A] rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, loanType: 'Lent' })}
                  className={cn(
                    "py-2.5 text-xs font-bold rounded-[10px] transition-all duration-300",
                    formData.loanType === 'Lent' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-[#64748B] hover:text-[#94A3B8]"
                  )}
                >
                  LENT
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, loanType: 'Borrowed' })}
                  className={cn(
                    "py-2.5 text-xs font-bold rounded-[10px] transition-all duration-300",
                    formData.loanType === 'Borrowed' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-[#64748B] hover:text-[#94A3B8]"
                  )}
                >
                  BORROWED
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Person Name</label>
                <input
                  type="text"
                  required
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  className="w-full h-11 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                  placeholder="e.g. Rafiq Ahmed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Contact</label>
                  <input
                    type="text"
                    required
                    value={formData.personContact}
                    onChange={(e) => setFormData({ ...formData, personContact: e.target.value })}
                    className="w-full h-11 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                    placeholder="Mobile number"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Amount</label>
                  <input
                    type="number"
                    required
                    disabled={!!editingLoan}
                    value={formData.principalAmount}
                    onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full h-11 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all disabled:opacity-50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Select Wallet</label>
                <select
                  required
                  disabled={!!editingLoan}
                  value={formData.walletId}
                  onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                  className="w-full h-11 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all cursor-pointer"
                >
                  <option value="">Choose payment source</option>
                  {wallets.map(w => <option key={w._id} value={w._id}>{w.name} (BDT {w.balance.toLocaleString()})</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Purpose / Note</label>
                <textarea
                  value={formData.purposeNote}
                  onChange={(e) => setFormData({ ...formData, purposeNote: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all resize-none"
                  rows={2}
                  placeholder="What is this for?"
                />
              </div>

              <button
                type="submit"
                disabled={createLoan.isPending || updateLoan.isPending}
                className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#2563EB]/30 active:scale-[0.98] disabled:opacity-50"
              >
                {createLoan.isPending || updateLoan.isPending ? 'Saving...' : editingLoan ? 'Update Record' : 'Confirm Loan Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal (Updated Style) */}
      {showPayModal && payingLoan && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="animate-pop-in bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
            <button onClick={() => setShowPayModal(false)} className="absolute right-6 top-6 text-[#64748B] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">
              {payingLoan.loanType === 'Lent' ? 'Receive Payment' : 'Repay Loan'}
            </h2>
            <p className="text-sm text-[#94A3B8] mb-6">Settling with {payingLoan.personName}</p>
            
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Amount to {payingLoan.loanType === 'Lent' ? 'Receive' : 'Pay'}</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#475569] group-focus-within:text-[#2563EB] transition-colors">BDT</span>
                  <input
                    type="number"
                    required
                    autoFocus
                    max={payingLoan.balanceAmount}
                    min={1}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full h-12 pl-14 pr-4 bg-[#0F172A] border border-[#334155] rounded-xl text-lg font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                    placeholder="0"
                  />
                </div>
                <p className="text-[10px] text-[#64748B] font-bold mt-1 ml-1 uppercase tracking-tighter">REMAINING BALANCE: {formatCurrency(payingLoan.balanceAmount)}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Select Wallet</label>
                <select
                  required
                  value={paymentWalletId}
                  onChange={(e) => setPaymentWalletId(e.target.value)}
                  className="w-full h-11 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all cursor-pointer"
                >
                  <option value="">Choose payment source</option>
                  {wallets.map(w => <option key={w._id} value={w._id}>{w.name} (BDT {w.balance.toLocaleString()})</option>)}
                </select>
              </div>

              <button
                type="submit"
                disabled={payLoan.isPending}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
              >
                {payLoan.isPending ? 'Processing...' : 'Confirm Settlement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Loans

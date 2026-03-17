import { useState, useEffect, useMemo } from 'react'
import { useWallets, useCreateWallet, useUpdateWallet, useDeleteWallet } from '@/hooks/useWallets'
import { Plus, Pencil, Trash2, Wallet as WalletIcon, Building2, Smartphone, X } from 'lucide-react'
import type { Wallet as WalletType, CreateWalletData } from '@/services/walletService'
import { formatCurrency, cn } from '@/lib/utils'
import { AxiosError } from 'axios'

interface ApiError {
  message: string
}

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

const Wallets = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null)
  const [formData, setFormData] = useState<Omit<CreateWalletData, 'initialBalance'> & { initialBalance: number | '' }>({
    name: '',
    type: 'cash',
    initialBalance: '',
    currency: 'BDT',
  })

  const { data, isLoading } = useWallets()
  const createWallet = useCreateWallet()
  const updateWallet = useUpdateWallet()
  const deleteWallet = useDeleteWallet()

  const wallets = data?.data || []

  const totalBalance = useMemo(() => wallets.reduce((sum, w) => sum + w.balance, 0), [wallets])
  const largestWallet = useMemo(() => wallets.reduce((max, w) => w.balance > (max?.balance || 0) ? w : max, wallets[0]), [wallets])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        initialBalance: formData.initialBalance === '' ? 0 : Number(formData.initialBalance),
        balance: formData.initialBalance === '' ? 0 : Number(formData.initialBalance),
      }
      if (editingWallet) {
        await updateWallet.mutateAsync({
          id: editingWallet._id,
          data: {
            name: formData.name,
            type: formData.type,
            balance: payload.balance,
          },
        })
      } else {
        await createWallet.mutateAsync(payload as any)
      }
      setShowModal(false)
      resetForm()
    } catch (error) {
      const err = error as AxiosError<ApiError>
      alert(err.response?.data?.message || 'Error saving wallet')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await deleteWallet.mutateAsync(id)
      } catch (error) {
        const err = error as AxiosError<ApiError>
        alert(err.response?.data?.message || 'Error deleting wallet')
      }
    }
  }

  const resetForm = () => {
    setEditingWallet(null)
    setFormData({ name: '', type: 'cash', initialBalance: '', currency: 'BDT' })
  }

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'cash': return <WalletIcon className="w-6 h-6 text-emerald-400" />
      case 'bank': return <Building2 className="w-6 h-6 text-blue-400" />
      case 'mfs': return <Smartphone className="w-6 h-6 text-purple-400" />
      default: return <WalletIcon className="w-6 h-6 text-gray-400" />
    }
  }

  const getWalletColor = (type: string) => {
    switch (type) {
      case 'cash': return 'border-t-emerald-500'
      case 'bank': return 'border-t-blue-500'
      case 'mfs': return 'border-t-purple-500'
      default: return 'border-t-gray-500'
    }
  }

  const getWalletBadgeColor = (type: string) => {
    switch (type) {
      case 'cash': return 'bg-emerald-500/10 text-emerald-400'
      case 'bank': return 'bg-blue-500/10 text-blue-400'
      case 'mfs': return 'bg-purple-500/10 text-purple-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'cash': return 'bg-emerald-500'
      case 'bank': return 'bg-blue-500'
      case 'mfs': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-12">
      {/* 1. Page Header Section */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-bold text-[#E2E8F0]">Wallets</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage your funding sources</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="animate-pop-in opacity-0 inline-flex items-center gap-2 h-11 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#2563EB]/20"
          style={{ animationDelay: '0.2s' }}
        >
          <Plus className="w-4 h-4" />
          Add Wallet
        </button>
      </div>

      {/* 2. Summary Bar */}
      <div 
        className="animate-slide-up opacity-0 grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-2xl hover:border-[#475569] transition-all duration-500 ease-out cursor-default group">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 group-hover:text-[#94A3B8] transition-colors">Total Balance</p>
          <h3 className="text-3xl font-bold text-white group-hover:scale-[1.05] origin-left transition-transform duration-500">
            <CountUp end={totalBalance} />
          </h3>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-2xl hover:border-[#475569] transition-all duration-500 ease-out cursor-default group">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 group-hover:text-[#94A3B8] transition-colors">Active Wallets</p>
          <h3 className="text-3xl font-bold text-white group-hover:scale-[1.05] origin-left transition-transform duration-500">{wallets.length}</h3>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-2xl hover:border-[#475569] transition-all duration-500 ease-out cursor-default group">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 group-hover:text-[#94A3B8] transition-colors">Largest Wallet</p>
          <h3 className="text-xl font-bold text-white truncate group-hover:scale-[1.05] origin-left transition-transform duration-500">{largestWallet?.name || 'N/A'}</h3>
          <p className="text-sm text-[#94A3B8] mt-1 group-hover:text-[#E2E8F0] transition-colors">{largestWallet ? formatCurrency(largestWallet.balance) : '-'}</p>
        </div>
      </div>

      {/* 3. Wallet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-[#1E293B] border border-[#334155] rounded-2xl animate-pulse" />
          ))
        ) : wallets.length > 0 ? (
          wallets.map((wallet, index) => (
            <div 
              key={wallet._id}
              className={cn(
                "opacity-0 animate-slide-up bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-2xl hover:border-[#475569] transition-all duration-500 ease-out group relative overflow-hidden cursor-default",
                "border-t-4", getWalletColor(wallet.type)
              )}
              style={{ animationDelay: `${0.4 + index * 0.17}s` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center border border-[#334155] group-hover:scale-110 transition-transform duration-300">
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                    <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1", getWalletBadgeColor(wallet.type))}>
                      {wallet.type}
                    </span>
                  </div>
                </div>
                {/* Dynamic Percentage Badge */}
                {totalBalance > 0 && (
                  <div className={cn(
                    "px-2 py-1 rounded-lg text-[11px] font-bold bg-[#0F172A] border border-[#334155]",
                    "text-emerald-400"
                  )}>
                    {((wallet.balance / totalBalance) * 100).toFixed(1)}%
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-3xl font-bold text-white mb-2">
                  <CountUp end={wallet.balance} />
                </h4>
                <div className="h-1.5 w-full bg-[#0F172A] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out animate-grow-up", getProgressColor(wallet.type))}
                    style={{ width: `${totalBalance > 0 ? (wallet.balance / totalBalance) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#334155]/50">
                <button
                  onClick={() => {
                    setEditingWallet(wallet)
                    setFormData({
                      name: wallet.name,
                      type: wallet.type,
                      initialBalance: wallet.balance,
                      currency: wallet.currency,
                    })
                    setShowModal(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#334155] transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(wallet._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-[#1E293B] border border-[#334155] rounded-2xl border-dashed">
            <p className="text-[#94A3B8] mb-4">No wallets found. Create one to get started.</p>
            <button
              onClick={() => { resetForm(); setShowModal(true) }}
              className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors"
            >
              Create First Wallet
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Wallet Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="animate-pop-in bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-[#64748B] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingWallet ? 'Edit Wallet Details' : 'Add New Wallet'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Wallet Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                  placeholder="e.g. Personal Cash"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Wallet Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', label: 'Cash', icon: WalletIcon, color: 'text-emerald-400', activeBg: 'bg-emerald-500/10', activeBorder: 'border-emerald-500' },
                    { id: 'mfs', label: 'MFS', icon: Smartphone, color: 'text-purple-400', activeBg: 'bg-purple-500/10', activeBorder: 'border-purple-500' },
                    { id: 'bank', label: 'Bank', icon: Building2, color: 'text-blue-400', activeBg: 'bg-blue-500/10', activeBorder: 'border-blue-500' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.id as any })}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                        formData.type === type.id
                          ? `${type.activeBg} ${type.activeBorder} ${type.color}`
                          : "bg-[#0F172A] border-[#334155] text-[#64748B] hover:border-[#475569]"
                      )}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="text-xs font-bold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">
                  {editingWallet ? 'Current Balance' : 'Initial Balance'}
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#475569] group-focus-within:text-[#2563EB] transition-colors">BDT</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full h-11 pl-14 pr-4 bg-[#0F172A] border border-[#334155] rounded-xl text-lg font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createWallet.isPending || updateWallet.isPending}
                className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#2563EB]/30 active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {createWallet.isPending || updateWallet.isPending ? 'Saving...' : editingWallet ? 'Update Wallet' : 'Create Wallet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallets

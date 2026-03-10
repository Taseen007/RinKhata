import { useState } from 'react'
import { useWallets, useCreateWallet, useUpdateWallet, useDeleteWallet } from '@/hooks/useWallets'
import { formatCurrency, cn } from '@/lib/utils'
import { Plus, X, Pencil, Trash2, Wallet, Landmark, Smartphone } from 'lucide-react'
import type { Wallet as WalletType, CreateWalletData } from '@/services/walletService'

const Wallets = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null)
  const [formData, setFormData] = useState<CreateWalletData>({
    name: '',
    type: 'cash',
    initialBalance: 0,
    currency: 'BDT',
  })

  const { data, isLoading } = useWallets()
  const createWallet = useCreateWallet()
  const updateWallet = useUpdateWallet()
  const deleteWallet = useDeleteWallet()

  const wallets = data?.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingWallet) {
        await updateWallet.mutateAsync({
          id: editingWallet._id,
          data: { name: formData.name, type: formData.type },
        })
      } else {
        await createWallet.mutateAsync(formData)
      }
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving wallet:', error)
    }
  }

  const handleEdit = (wallet: WalletType) => {
    setEditingWallet(wallet)
    setFormData({
      name: wallet.name,
      type: wallet.type,
      initialBalance: wallet.balance,
      currency: wallet.currency,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await deleteWallet.mutateAsync(id)
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting wallet')
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: '', type: 'cash', initialBalance: 0, currency: 'BDT' })
    setEditingWallet(null)
  }

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'cash': return Wallet
      case 'bank': return Landmark
      case 'mfs': return Smartphone
      default: return Wallet
    }
  }

  const getWalletAccent = (type: string) => {
    switch (type) {
      case 'cash': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' }
      case 'bank': return { bg: 'bg-blue-500/10', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400' }
      case 'mfs': return { bg: 'bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400' }
      default: return { bg: 'bg-secondary', text: 'text-muted-foreground', badge: 'bg-secondary text-muted-foreground' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Wallet
        </button>
      </div>

      {/* Wallet Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="h-28 bg-secondary animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : wallets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wallets.map((wallet) => {
            const accent = getWalletAccent(wallet.type)
            const Icon = getWalletIcon(wallet.type)
            return (
              <div key={wallet._id} className="rounded-xl border border-border bg-card p-5 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", accent.bg)}>
                      <Icon className={cn("w-5 h-5", accent.text)} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{wallet.name}</h3>
                      <span className={cn("inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-0.5", accent.badge)}>
                        {wallet.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-4">{formatCurrency(wallet.balance)}</p>
                <div className="flex gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEdit(wallet)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(wallet._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No wallets yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Your First Wallet
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-xl border border-border bg-card shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editingWallet ? 'Edit Wallet' : 'Add New Wallet'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm() }} className="p-1 rounded-lg hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Wallet Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="e.g., My Cash Wallet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Wallet Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="mfs">Mobile Financial Service</option>
                </select>
              </div>

              {!editingWallet && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Initial Balance (optional)</label>
                  <input
                    type="number"
                    value={formData.initialBalance || ''}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              )}

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
                  disabled={createWallet.isPending || updateWallet.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {createWallet.isPending || updateWallet.isPending ? 'Saving...' : editingWallet ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallets

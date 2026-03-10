import { useState } from 'react'
import { useWallets, useCreateWallet, useUpdateWallet, useDeleteWallet } from '../hooks/useWallets'
import type { Wallet, CreateWalletData } from '../services/walletService'

const Wallets = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null)
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

  const handleEdit = (wallet: Wallet) => {
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
    setFormData({
      name: '',
      type: 'cash',
      initialBalance: 0,
      currency: 'BDT',
    })
    setEditingWallet(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'cash':
        return 'bg-green-100 text-green-800'
      case 'bank':
        return 'bg-blue-100 text-blue-800'
      case 'mfs':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Wallet
        </button>
      </div>

      {/* Wallet Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      ) : wallets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div key={wallet._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{wallet.name}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getWalletTypeColor(wallet.type)}`}>
                  {wallet.type}
                </span>
              </div>
              <p className="text-3xl font-bold text-primary-600 mb-4">{formatCurrency(wallet.balance)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(wallet)}
                  className="flex-1 px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(wallet._id)}
                  className="flex-1 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No wallets yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Wallet
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingWallet ? 'Edit Wallet' : 'Add New Wallet'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., My Cash Wallet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="mfs">Mobile Financial Service</option>
                </select>
              </div>

              {!editingWallet && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Balance (optional)
                  </label>
                  <input
                    type="number"
                    value={formData.initialBalance || ''}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              )}

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
                  disabled={createWallet.isPending || updateWallet.isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {createWallet.isPending || updateWallet.isPending
                    ? 'Saving...'
                    : editingWallet
                    ? 'Update'
                    : 'Create'}
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

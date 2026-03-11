import { useState } from 'react'
import { useEffect } from 'react'
import { useWallets, useCreateWallet, useUpdateWallet, useDeleteWallet } from '@/hooks/useWallets'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Wallet as WalletType, CreateWalletData } from '@/services/walletService'

const Wallets = () => {
  const [toast, setToast] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null)
  const [formData, setFormData] = useState<CreateWalletData>({
    name: '',
    type: 'cash',
    initialBalance: 0,
    currency: 'BDT',
  })

  const { data } = useWallets()
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
          data: {
            name: formData.name,
            type: formData.type,
            balance: formData.initialBalance,
          },
        })
      } else {
        const result = await createWallet.mutateAsync(formData)
        if (result && result.message && result.message.includes('Cash wallet already exists')) {
          setToast('Cash wallet already exists. Balance updated.')
        }
      }
      setShowModal(false)
      setEditingWallet(null)
      setFormData({ name: '', type: 'cash', initialBalance: 0, currency: 'BDT' })
    } catch (err) {
      // handle error
    }
  }

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Main render
  return (
    <div className="px-8 py-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Wallets</h2>
        <button
          className="flex items-center gap-2 text-lg font-medium px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => {
            setShowModal(true)
            setEditingWallet(null)
            setFormData({ name: '', type: 'cash', initialBalance: 0, currency: 'BDT' })
          }}
        >
          <Plus size={22} /> Add Wallet
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallets.map((wallet: WalletType) => {
          // Icon and color for wallet type
          let icon, typeColor, typeBg;
          if (wallet.type === 'cash') {
            icon = <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/></svg>;
            typeColor = 'text-green-500';
            typeBg = 'bg-green-900';
          } else if (wallet.type === 'bank') {
            icon = <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M5 10v10M19 10v10M12 10v10M2 6l10-4 10 4"/></svg>;
            typeColor = 'text-blue-500';
            typeBg = 'bg-blue-900';
          } else if (wallet.type === 'mfs') {
            icon = <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>;
            typeColor = 'text-purple-500';
            typeBg = 'bg-purple-900';
          }
          return (
            <div key={wallet._id} className="bg-[#232a36] rounded-xl p-6 flex flex-col justify-between shadow-md">
              <div className="flex items-center gap-4 mb-2">
                {icon}
                <div>
                  <div className="text-2xl font-bold text-white">{wallet.name}</div>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${typeColor} ${typeBg}`}>{wallet.type}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-4">BDT {wallet.balance.toLocaleString()}</div>
              <div className="flex gap-4 mt-auto">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#232a36] border border-[#232a36] text-white hover:bg-[#1a202c]"
                  onClick={() => {
                    setShowModal(true)
                    setEditingWallet(wallet)
                    setFormData({
                      name: wallet.name,
                      type: wallet.type,
                      initialBalance: wallet.balance,
                      currency: wallet.currency,
                    })
                  }}
                >
                  <Pencil size={18} /> Edit
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#232a36] border border-[#232a36] text-red-400 hover:bg-[#1a202c]"
                  onClick={() => deleteWallet.mutateAsync(wallet._id)}
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[#232a36] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">{editingWallet ? 'Edit Wallet' : 'Create Wallet'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Wallet Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a202c] border border-[#232a36] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="e.g., My Cash Wallet"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Wallet Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#1a202c] border border-[#232a36] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="mfs">Mobile Financial Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">{editingWallet ? 'Balance' : 'Initial Balance (optional)'}</label>
                <input
                  type="number"
                  value={formData.initialBalance || ''}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#1a202c] border border-[#232a36] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="0"
                  min="0"
                  step="100"
                />
                {editingWallet && (
                  <small className="text-xs text-blue-200">You can increment or decrement the wallet balance here.</small>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => { setShowModal(false); setEditingWallet(null); }}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingWallet ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallets;

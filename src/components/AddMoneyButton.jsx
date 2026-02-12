import { useState, useContext } from 'react'
import { Plus, X } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { UserContext } from '../context/UserContext'

export default function AddMoneyButton() {
  const { userId } = useContext(UserContext)

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return
    if (!userId) return

    setLoading(true)

    await addDoc(
      collection(db, 'users', userId, 'credits'),
      {
        amount: Number(amount),
        remarks: remarks || '',
        createdAt: serverTimestamp()
      }
    )

    setAmount('')
    setRemarks('')
    setOpen(false)
    setLoading(false)
  }

  return (
    <>
      {/* ➕ ROUND BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          absolute
          top-4
          right-4
          w-9
          h-9
          rounded-full
          bg-emerald-500
          text-black
          flex
          items-center
          justify-center
          hover:bg-emerald-400
          transition
        "
        title="Add money"
      >
        <Plus size={18} />
      </button>

      {/* 🪟 MODAL */}
      {open && (
        <div className=" inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 top-60 " style={{zIndex:'500',position:'fixed',top:'0px'}}>
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative modal-custom">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h3 className="text-sm font-semibold text-white mb-4">
              Add Money
            </h3>

            {/* Amount */}
            <div className="mb-3">
              <label className="text-xs text-zinc-400">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="₹0"
                className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none"
              />
            </div>

            {/* Remarks */}
            <div className="mb-4">
              <label className="text-xs text-zinc-400">
                Remarks (optional)
              </label>
              <input
                type="text"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Reimbursement / Debt returned"
                className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3" style={{marginTop:'10px'}}>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSave}
                className="
                  bg-emerald-500
                  hover:bg-emerald-400
                  disabled:opacity-60
                  text-black
                  text-xs
                  font-semibold
                  px-4
                  py-2
                  rounded-xl
                  transition
                "
              >
                {loading ? 'Saving...' : 'Add'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

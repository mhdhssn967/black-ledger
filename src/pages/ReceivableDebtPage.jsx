import { useContext, useEffect, useState } from 'react'
import {
  Plus,
  Calendar,
  IndianRupee,
  X,
  ArrowLeft,
  Check
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  fetchPendingReceivables,
  saveReceivable,
  clearReceivable
} from '../service/debtService'
import { UserContext } from '../context/UserContext'
import TriangleLoader from '../components/TriangleLoader'

export default function ReceivableDebtPage() {
  const user_id = useContext(UserContext)
  const navigate = useNavigate()

  const [receivables, setReceivables] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newReceivable, setNewReceivable] = useState({
    amount: '',
    owedBy: '',
    dueDate: ''
  })

  /* 🔄 LOAD RECEIVABLES */
  useEffect(() => {
    if(user_id.userId){loadReceivables()}
  }, [user_id])

  const loadReceivables = async () => {
    const data = await fetchPendingReceivables(user_id.userId)
    setReceivables(data)
    setLoading(false)
  }

  const totalReceivable = receivables.reduce(
    (sum, r) => sum + Number(r.amount),
    0
  )

  const addReceivable = async () => {
    if (!newReceivable.amount || !newReceivable.owedBy || !newReceivable.dueDate)
      return

    await saveReceivable(newReceivable, user_id.userId)
    setNewReceivable({ amount: '', owedBy: '', dueDate: '' })
    setShowModal(false)
    loadReceivables()
  }

  const markReceived = async id => {
    await clearReceivable(id, user_id.userId)
    loadReceivables()
  }

  return (
    <>
      {loading && <TriangleLoader />}

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white"
        style={{ margin: '10px' }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="min-h-screen bg-black text-white px-5 py-6">
        <h1 className="text-xl font-semibold mb-6" style={{marginBottom:'20px'}}>
          Money Owed To Me
        </h1>

        {/* TOTAL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
          <p className="text-sm text-zinc-400 mb-1">
            Total Receivable
          </p>
          <div className="flex items-center text-3xl font-bold text-emerald-400">
            <IndianRupee size={28} />
            {totalReceivable}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {receivables.map(item => (
            <div style={{marginTop:'10px'}}
              key={item.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  {item.owedBy}
                </p>
                <p className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar size={12} />
                  Due {new Date(item.dueDate).toDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-semibold text-emerald-400">
                  <IndianRupee size={16} />
                  {item.amount}
                </div>

                {/* ✔ RECEIVED */}
                <button
                  onClick={() => markReceived(item.id)}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-emerald-500 text-black p-4 rounded-full shadow-lg"
        >
          <Plus />
        </button>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-zinc-400"
              >
                <X />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Add Receivable
              </h2>

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newReceivable.amount}
                  onChange={e =>
                    setNewReceivable({
                      ...newReceivable,
                      amount: e.target.value
                    })
                  }
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="Owed by"
                  value={newReceivable.owedBy}
                  onChange={e =>
                    setNewReceivable({
                      ...newReceivable,
                      owedBy: e.target.value
                    })
                  }
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="date"
                  value={newReceivable.dueDate}
                  onChange={e =>
                    setNewReceivable({
                      ...newReceivable,
                      dueDate: e.target.value
                    })
                  }
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <button
                onClick={addReceivable}
                className="mt-5 w-full bg-emerald-500 text-black font-semibold py-3 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

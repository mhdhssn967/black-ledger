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
  fetchPendingDebts,
  saveDebt,
  clearDebt
} from '../service/debtService'
import { UserContext } from '../context/UserContext'
import TriangleLoader from '../components/TriangleLoader'

export default function DebtPage() {
    const user_id=useContext(UserContext)
  const navigate = useNavigate()

  const [debts, setDebts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading,setLoading]=useState(true)

  const [newDebt, setNewDebt] = useState({
    amount: '',
    owedTo: '',
    dueDate: ''
  })

  /* 🔄 LOAD DEBTS */
  useEffect(() => {
    loadDebts()
  }, [])

  const loadDebts = async () => {
    const data = await fetchPendingDebts(user_id.userId)
    setDebts(data)
    setLoading(false)
  }

  const totalDebt = debts.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  )

  const addDebt = async () => {
    if (!newDebt.amount || !newDebt.owedTo || !newDebt.dueDate) return

    await saveDebt(newDebt,user_id.userId)
    setNewDebt({ amount: '', owedTo: '', dueDate: '' })
    setShowModal(false)
    loadDebts()
  }

  const markCleared = async id => {
    await clearDebt(id,user_id.userId)
    loadDebts()
  }

  return (
    <>
    {loading&&<TriangleLoader/>}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white"
        style={{ margin: '30px' }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="min-h-screen bg-black text-white px-5 py-6">

        <h1 className="text-xl font-semibold mb-6">
          My Debts
        </h1>

        {/* TOTAL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8"style={{marginTop:'10px'}}>
          <p className="text-sm text-zinc-400 mb-1">
            Total Debt
          </p>
          <div className="flex items-center text-3xl font-bold text-emerald-400">
            <IndianRupee size={28} />
            {totalDebt}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {debts.map(debt => (
            <div style={{marginTop:'10px'}}
              key={debt.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  {debt.owedTo}
                </p>
                <p className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar size={12} />
                  Due {new Date(debt.dueDate).toDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-semibold text-red-400">
                  <IndianRupee size={16} />
                  {debt.amount}
                </div>

                {/* ✔ CLEAR */}
                <button
                  onClick={() => markCleared(debt.id)}
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
                Add New Debt
              </h2>

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newDebt.amount}
                  onChange={e =>
                    setNewDebt({ ...newDebt, amount: e.target.value })
                  }
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="Owed to"
                  value={newDebt.owedTo}
                  onChange={e =>
                    setNewDebt({ ...newDebt, owedTo: e.target.value })
                  }
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="date"
                  value={newDebt.dueDate}
                  onChange={e =>
                    setNewDebt({ ...newDebt, dueDate: e.target.value })
                  }
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <button
                onClick={addDebt}
                className="mt-5 w-full bg-emerald-500 text-black font-semibold py-3 rounded-xl" style={{marginTop:'10px'}}
              >
                Save Debt
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

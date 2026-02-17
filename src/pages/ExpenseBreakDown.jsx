import { useContext, useEffect, useState } from 'react'
import { getExpenseSummary } from '../service/fetchExpenseSummary'
import { fetchFilteredExpenses } from '../service/fetchFilteredExpenses'
import {
  ArrowLeft,
  ChartAreaIcon,
  CreditCard,
  Tag,
  Users,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import TriangleLoader from '../components/TriangleLoader'

export default function ExpenseBreakdown() {

  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })
  }

  const [monthFilter, setMonthFilter] = useState(getCurrentMonth())
  const USER_ID = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  const [summary, setSummary] = useState({
    total: 0,
    byCategory: {},
    bySource: {},
    byContext: {},
    months: []
  })

  // Modal States
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalExpenses, setModalExpenses] = useState([])
  const [modalLoading, setModalLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadSummary()
  }, [monthFilter, USER_ID])

  const loadSummary = async () => {
    if (USER_ID.userId) {
      const data = await getExpenseSummary(monthFilter, USER_ID.userId)
      setSummary(data)
      setLoading(false)
    }
  }

  // Open Modal + Fetch Filtered Data
  const openFilteredModal = async (field, value) => {
    if (!USER_ID.userId) return

    setModalOpen(true)
    setModalTitle(`${value}`)
    setModalLoading(true)

    const data = await fetchFilteredExpenses(
      USER_ID.userId,
      field,
      value
    )

    setModalExpenses(data)
    setModalLoading(false)
  }

  function Section({ title, icon: Icon, children }) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5" style={{ marginTop: '20px' }}>
          <div className="bg-zinc-800 p-2 rounded-xl">
            <Icon className="text-emerald-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
        </div>

        <div
          className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-4 space-y-4 backdrop-blur-sm"
          style={{ margin: '10px auto 10px auto' }}
        >
          {children}
        </div>
      </div>
    )
  }

  function BreakdownRow({ label, value, total = summary.total, onClick }) {
    const percentage = total > 0 ? (value / total) * 100 : 0

    return (
      <div
        onClick={onClick}
        className="cursor-pointer bg-zinc-950/70 border border-zinc-800 rounded-2xl px-5 py-4 hover:border-emerald-500/40 transition-all duration-300"
        style={{ margin: '10px auto 10px auto' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="text-xs text-zinc-500">
              {percentage.toFixed(1)}%
            </p>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg">
            ₹{Number(value).toLocaleString()}
          </div>
        </div>

        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {loading && <TriangleLoader />}

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white "
        style={{ margin: '10px' }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="min-h-screen bg-black text-white px-5 py-6">

        <div className="flex items-center justify-between mb-6 gap-6">
          <h1 className="text-xl font-semibold text-white" style={{ marginBottom: '10px' }}>
            Expense Breakdown
          </h1>

          <select
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            className="bg-zinc-800 text-white rounded-xl px-4 py-2 outline-none"
          >
            <option value="">All time</option>
            {summary.months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 border border-emerald-500/20 rounded-3xl p-6 mb-8 backdrop-blur-xl"
          style={{ marginBottom: '20px' }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />

          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-sm text-zinc-400 mb-2 tracking-wide">
                Total Spent
              </p>
              <h2 className="text-4xl font-bold text-emerald-400 tracking-tight">
                ₹{summary.total.toLocaleString()}
              </h2>
            </div>

            <button
              onClick={() => navigate('/expensebreakdowncharts')}
              className="bg-emerald-500 hover:bg-emerald-600 transition p-4 rounded-2xl shadow-lg"
            >
              <ChartAreaIcon size={20} />
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <Section title="By Category" icon={Tag}>
            {Object.entries(summary.byCategory).map(([key, val]) => (
              <BreakdownRow
                key={key}
                label={key}
                value={val}
                onClick={() => openFilteredModal("category", key)}
              />
            ))}
          </Section>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <Section title="By Source" icon={CreditCard}>
            {Object.entries(summary.bySource).map(([key, val]) => (
              <BreakdownRow
                key={key}
                label={key}
                value={val}
                onClick={() => openFilteredModal("source", key)}
              />
            ))}
          </Section>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <Section title="By Context" icon={Users}>
            {Object.entries(summary.byContext).map(([key, val]) => (
              <BreakdownRow
                key={key}
                label={key}
                value={val}
                onClick={() => openFilteredModal("context", key)}
              />
            ))}
          </Section>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div style={{width:'95%'}} className="bg-zinc-900 w-full max-w-md rounded-2xl p-3 border border-zinc-800 relative max-h-[80vh] overflow-y-auto">

            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-6 text-emerald-400" style={{marginBottom:'20px'}}>
              {modalTitle}
            </h2>

            {modalLoading ? (
              <div className='loader-exp bg-zinc-900'>
                <img style={{width:'80px'}} src="/loader_2.png" alt="" />
              </div>
            ) : modalExpenses.length === 0 ? (
              <p className="text-zinc-500 text-sm">No expenses found.</p>
            ) : (
              modalExpenses.map(exp => (
                <div style={{marginBottom:'10px'}}
                  key={exp.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-3"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{exp.transactionDate}</span>
                    <span className="text-emerald-400 font-semibold">
                      ₹{Number(exp.amount).toLocaleString()}
                    </span>
                  </div>

                  {exp.remarks && (
                    <p className="text-xs text-zinc-500 mt-2">
                      {exp.remarks}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}

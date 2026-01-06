import { useEffect, useState } from 'react'
import { getExpenseSummary } from '../service/fetchExpenseSummary'
import {
    ArrowLeft,
  BarChart2,
  CreditCard,
  IndianRupee,
  Tag,
  Users,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
export default function ExpenseBreakdown() {
  const [monthFilter, setMonthFilter] = useState('')
  const [summary, setSummary] = useState({
    total: 0,
    byCategory: {},
    bySource: {},
    byContext: {},
    months: []
  })
const navigate = useNavigate()
  useEffect(() => {
    loadSummary()
  }, [monthFilter])

  const loadSummary = async () => {
    const data = await getExpenseSummary(monthFilter)
    setSummary(data)
  }
function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-emerald-400" size={20} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
function BreakdownRow({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"style={{marginBottom:'10px'}}>
      <p className="font-medium text-white">{label}</p>
      <p className="flex items-center gap-1 text-emerald-400 font-semibold">
        <IndianRupee size={16} />
        {value.toLocaleString()}
      </p>
    </div>
  )
}

  return (
    <>
    <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white " style={{margin:'30px'}}
      >
        <ArrowLeft size={18} />
        Back
      </button>

        <div className="min-h-screen bg-black text-white px-5 py-6">
           {/* Title + Month Dropdown */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-white" style={{marginBottom:'10px'}}>
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
        
          {/* Total */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6"style={{marginBottom:'10px'}}>
            <p className="text-sm text-zinc-400">Total Spent</p>
            <h2 className="text-3xl font-extrabold text-emerald-400">
              ₹{summary.total.toLocaleString()}
            </h2>
          </div>
        
          {/* ➤ Category Breakdown */}
          <div style={{marginBottom:'10px'}}>
            <Section title="By Category" icon={Tag}>
              {Object.entries(summary.byCategory).map(([key, val]) => (
                <BreakdownRow key={key} label={key} value={val} />
              ))}
            </Section>
          </div>
        
          {/* ➤ Source Breakdown */}
          <div style={{marginBottom:'10px'}}>
            <Section title="By Source" icon={CreditCard}>
              {Object.entries(summary.bySource).map(([key, val]) => (
                <BreakdownRow key={key} label={key} value={val} />
              ))}
            </Section>
          </div>
        
          {/* ➤ Context Breakdown */}
          <div style={{marginBottom:'10px'}}>
            <Section title="By Context" icon={Users}>
              {Object.entries(summary.byContext).map(([key, val]) => (
                <BreakdownRow key={key} label={key} value={val} />
              ))}
            </Section>
          </div>
        </div>
    </>
  )
}

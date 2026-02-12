import { useContext, useEffect, useState } from 'react'
import { getExpenseSummary } from '../service/fetchExpenseSummary'
import {
    ArrowLeft,
  BarChart2,
  ChartAreaIcon,
  CreditCard,
  IndianRupee,
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
  const [loading,setLoading]=useState(true)
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
  }, [monthFilter,USER_ID])

  const loadSummary = async () => {
   if(USER_ID.userId){ const data = await getExpenseSummary(monthFilter,USER_ID.userId)
    setSummary(data)
    setLoading(false)
  }
  }
function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-10" >

      {/* Header */}
      <div className="flex items-center gap-3 mb-5" style={{marginTop:'20px'}}>
        <div className="bg-zinc-800 p-2 rounded-xl">
          <Icon className="text-emerald-400" size={18} />
        </div>

        <h2 className="text-lg font-semibold tracking-tight" >
          {title}
        </h2>
      </div>

      {/* Content Container */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-4 space-y-4 backdrop-blur-sm"style={{margin:'10px auto 10px auto'}}>
        {children}
      </div>
    </div>
  )
}

function BreakdownRow({ label, value, total=summary.total }) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  console.log(total);
  

  return (
    <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl px-5 py-4 hover:border-emerald-500/40 transition-all duration-300" style={{margin:'10px auto 10px auto'}}>

      {/* Top Row */}
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

      {/* Progress Bar */}
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
    {loading&&<TriangleLoader/>}
    <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white " style={{margin:'10px'}}
      >
        <ArrowLeft size={18} />
        Back
      </button>

        <div className="min-h-screen bg-black text-white px-5 py-6">
           {/* Title + Month Dropdown */}
          <div className="flex items-center justify-between mb-6 gap-6">
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
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 border border-emerald-500/20 rounded-3xl p-6 mb-8 backdrop-blur-xl" style={{marginBottom:'20px'}}>

  {/* Glow */}
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

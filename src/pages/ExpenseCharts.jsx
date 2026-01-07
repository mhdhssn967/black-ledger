import { useContext, useEffect, useState } from 'react'
import { getExpenseSummary } from '../service/fetchExpenseSummary'
import { ArrowLeft, Tag, CreditCard, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function ExpenseCharts() {
  const [monthFilter, setMonthFilter] = useState('')
  const USER_ID = useContext(UserContext)
  const navigate = useNavigate()

  const [summary, setSummary] = useState({
    total: 0,
    byCategory: {},
    bySource: {},
    byContext: {},
    months: []
  })

  useEffect(() => {
    if (USER_ID.userId) loadSummary()
  }, [monthFilter, USER_ID])

  const loadSummary = async () => {
    const data = await getExpenseSummary(monthFilter, USER_ID.userId)
    setSummary(data)
  }

  const toChartData = obj =>
    Object.entries(obj).map(([key, value]) => ({
      name: key,
      value
    }))

  return (
    <>
      {/* Back */}
      <button style={{margin:'20px'}}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white m-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="min-h-screen bg-black text-white px-5 pb-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6" style={{margin:'10px'}}>
          <h1 className="text-xl font-semibold">Expense Analysis</h1>

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
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
          <p className="text-sm text-zinc-400">Total Spent</p>
          <h2 className="text-3xl font-extrabold text-emerald-400">
            ₹{summary.total.toLocaleString()}
          </h2>
        </div>

        {/* Charts */}
        <ChartSection
          title="By Category"
          icon={Tag}
          data={toChartData(summary.byCategory)}
        />

        <ChartSection
          title="By Source"
          icon={CreditCard}
          data={toChartData(summary.bySource)}
        />

        <ChartSection
          title="By Context"
          icon={Users}
          data={toChartData(summary.byContext)}
        />
      </div>
    </>
  )
}

/* ---------- Chart Section ---------- */

function ChartSection({ title, icon: Icon, data }) {
  if (!data.length) return null

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={20} className="text-emerald-400" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={val => `₹${val.toLocaleString()}`}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fill="#34d399"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { useContext, useEffect, useState } from 'react'
import { CreditCard, Wifi, Calendar, User, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFinanceSummary, getMonthlyBalance } from '../service/getFinanceSummary'
import { UserContext } from '../context/UserContext'
import AddMoneyButton from './AddMoneyButton'

export default function FinanceCard() {
  const navigate = useNavigate()
  const userId = useContext(UserContext)

  const [monthlyBalance, setMonthlyBalance] = useState(0)
const [loading, setLoading] = useState(true)
  
  const [data, setData] = useState({
    salary: 0,
    monthlyExpenses: 0 // 👈 IMPORTANT: must come from backend
  })
  


  useEffect(() => {
    const loadData = async () => {
      if (userId.userId) {
        const summary = await getFinanceSummary(userId.userId)
        setData(summary)

        const monthBalanceRef = await getMonthlyBalance(userId.userId)
        setMonthlyBalance(monthBalanceRef)
      }
    }
    loadData()
  }, [userId])

  useEffect(() => {
  const loadData = async () => {
    if (userId.userId) {
      const summary = await getFinanceSummary(userId.userId)
      setData(summary)

      const monthBalanceRef = await getMonthlyBalance(userId.userId)
      setMonthlyBalance(monthBalanceRef)

      setLoading(false) // 👈 important
    }
  }
  loadData()
}, [userId])


  // ✅ Correct percentage calculation
  const percentUsed =
    data.salary > 0
      ? Math.min((monthlyBalance.monthlyExpenses / data.salary) * 100, 100)
      : 0

  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentUsed / 100) * circumference

 return (
  <>
    {loading ? (
      <div className="w-[95vw] max-w-md rounded-3xl p-7 
                      bg-gradient-to-br from-zinc-900 via-zinc-950 to-black 
                      border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                      animate-pulse">

        <div className="h-4 w-32 bg-zinc-700 rounded mb-4" />
        <div className="h-10 w-48 bg-zinc-700 rounded mb-8" style={{marginTop:'5px'}}/>

        <div className="flex justify-between items-center mb-6" style={{marginTop:'20px'}}>
          <div className="w-28 h-28 bg-zinc-800 rounded-full" />
          <div className="space-y-3">
            <div className="h-4 w-24 bg-zinc-700 rounded" />
            <div className="h-6 w-32 bg-zinc-700 rounded" style={{marginTop:'5px'}}/>
            <div className="h-3 w-20 bg-zinc-700 rounded"style={{marginTop:'5px'}} />
          </div>
        </div>

        <div className="h-10 w-full bg-zinc-700 rounded-2xl" style={{marginTop:'20px'}}/>
      </div>
    ) : (
      <div style={{width:'95vw'}} className="relative  max-w-md rounded-3xl p-5 text-white overflow-hidden 
                      bg-gradient-to-br from-zinc-900 via-zinc-950 to-black 
                      border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      
        {/* Add Money Button (Top Right) */}
        <div className="absolute top-5 right-5 ">
          <AddMoneyButton />
        </div>
      
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
      
        {/* Balance */}
        <div className="mb-8 relative ">
          <p className="text-sm text-zinc-400 uppercase tracking-wider">
            Available Balance
          </p>
      
          <h2 className="text-5xl font-bold mt-3 tracking-tight bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            ₹{monthlyBalance?.monthlyBalance?.toLocaleString()}
          </h2>
        </div>
      
        {/* Circular Spending Indicator */}
        <div className="flex items-center justify-between mb-6 relative ">
      
          {/* Ring */}
          <div className="relative w-28 h-28">
            <svg className="rotate-[-90deg]" width="100%" height="100%">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#27272a"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="url(#grad)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="grad">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
      
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              {percentUsed.toFixed(0)}%
            </div>
          </div>
      
          {/* Stats */}
          <div className="text-right">
            <p className="text-sm text-zinc-400">This Month Spent</p>
            <p className="text-xl font-semibold">
              ₹{monthlyBalance.monthlyExpenses}
            </p>
      
            <p className="text-xs text-zinc-500 mt-2">
              of ₹{data.salary.toLocaleString()}
            </p>
          </div>
        </div>
      
        {/* CTA */}
        <button style={{display:'flex',gap:'10px'}}
          onClick={() => navigate('/expensebreakdown')}
          className="relative  w-full py-3 text-emerald-400 font-semibold shadow-lg"
        >
          Expense Analysis
          <ArrowRight/>
        </button>
      </div>
    )}
  </>
)
}

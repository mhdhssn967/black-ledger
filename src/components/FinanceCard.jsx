import { useContext, useEffect, useState } from 'react'
import { CreditCard, Wifi, Calendar, User, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFinanceSummary } from '../service/getFinanceSummary'
import { UserContext } from '../context/UserContext'

export default function FinanceCard() {
  const navigate = useNavigate()
 const userId = useContext(UserContext)

  // replace with auth.uid later
 
  const [data, setData] = useState({
    balance: 0,
    salary: 0,
    totalExpenses: 0
  })

  useEffect(() => {
    const loadData = async () => {
      if(userId.userId){
      const summary = await getFinanceSummary(userId.userId)
      setData(summary)
      }
      
    }
    loadData()
  }, [userId])

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div style={{width:'90vw'}} className=" max-w-sm bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">

      {/* Top icons */}
      <div className="flex justify-between items-center mb-8">
        <CreditCard/>
        <Wifi size={20} className="text-zinc-400" />
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-sm text-zinc-400 uppercase">Balance</p>
        <h3 className="text-3xl  tracking-tight">
          ₹{data.balance.toLocaleString()}
        </h3>
      </div>

      {/* Salary + date */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-zinc-400">Salary</p>
          <p className=" text-lg">
            ₹{data.salary.toLocaleString()}
          </p>
        </div>
        <div className="text-sm text-zinc-400 flex flex-col items-end">
          <Calendar size={16} />
          <span>{today}</span>
        </div>
      </div>

      {/* Name + View expenses */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <User size={16} className="text-zinc-400" />
          <p className="font-semibold">{data?.profile?.name}</p>
        </div>

        <button
          onClick={() => navigate('/insights')}
          className="flex items-center gap-1 text-sm bg-black text-emerald-400 rounded p-2 hover:text-emerald-300 transition"
        >
          View expenses <ArrowRight size={14} />
        </button>
      </div>

      {/* Decorative shapes */}
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-gray-500 rounded-full opacity-10 rotate-45"></div>
      <div className="absolute -top-20 -left-10 w-56 h-56 bg-gray-500 rounded-full opacity-10 rotate-12"></div>
    </div>
  )
}

import { useContext, useEffect, useState } from 'react'
import { IndianRupee, Calendar } from 'lucide-react'
import { fetchExpenses } from '../service/expenseService'
import { UserContext } from '../context/UserContext'

export default function TodayExpenseCard() {
  const { userId } = useContext(UserContext)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    loadTodayExpenses()
  }, [userId])

  const loadTodayExpenses = async () => {
    setLoading(true)

    const expenses = await fetchExpenses(userId)

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const todayTotal = expenses.reduce((sum, exp) => {
      if (!exp.createdAt) return sum

      const date = exp.createdAt.toDate()
      if (date >= startOfToday && date <= endOfToday) {
        return sum + Number(exp.amount || 0)
      }

      return sum
    }, 0)

    setTotal(todayTotal)
    setLoading(false)
  }

  return (
    <div className='today'><p style={{color:'white'}}>Todays Spend</p>
      {loading ? (
        <p className="text-zinc-500 text-sm">Calculating…</p>
      ) : (
        <p className="text-2xl font-bold text-emerald-400">
          ₹{total.toLocaleString()}
        </p>
      )}
    </div>
  )
}

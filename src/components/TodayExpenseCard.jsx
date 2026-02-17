import { useContext, useEffect, useState } from 'react'
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
    <div className='today text-sm' ><p className='text-zinc-300'> Today's Spend</p>
    
      {loading ? (
        <p className="text-zinc-500 ">Calculating…</p>
      ) : (
        <p className="text-sm font-bold text-red-500">
          ₹{total.toLocaleString()}
        </p>
      )}
    </div>
  )
}

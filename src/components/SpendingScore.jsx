import { useEffect, useState, useContext } from 'react'
import { TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react'
import { fetchExpenses } from '../service/expenseService'
import { fetchLimits, saveLimits } from '../service/limitService'
import EditLimitsModal from './EditLimitsModal'
import { UserContext } from '../context/UserContext'

export default function SpendingScore() {
  const user = useContext(UserContext)

  const [limits, setLimits] = useState({
    daily: 500,
    weekly: 3500,
    monthly: 15000
  })

  const [score, setScore] = useState(70)
  const [status, setStatus] = useState('neutral')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user?.userId) return

    fetchLimits(user.userId).then(setLimits)
  }, [user])

  useEffect(() => {
    if (!user?.userId) return

    const calculateScore = async () => {
      let finalScore = 70
      const expenses = await fetchExpenses(user.userId)
      const now = new Date()

      let dailySpend = 0
      let weeklySpend = 0
      let monthlySpend = 0

      expenses.forEach(exp => {
        if (!exp.createdAt) return
        const date = exp.createdAt.toDate()
        const diffDays = (now - date) / 86400000

        if (diffDays < 1) dailySpend += +exp.amount
        if (diffDays < 7) weeklySpend += +exp.amount
        if (date.getMonth() === now.getMonth())
          monthlySpend += +exp.amount
      })

      if (dailySpend === 0) finalScore += 2
      else if (dailySpend < limits.daily) finalScore += 1
      else if (dailySpend <= limits.daily * 1.1) finalScore -= 1
      else finalScore -= 2

      if (weeklySpend < limits.weekly) finalScore += 3
      else if (weeklySpend <= limits.weekly * 1.1) finalScore -= 2
      else finalScore -= 5

      if (monthlySpend < limits.monthly) finalScore += 10
      else if (monthlySpend <= limits.monthly * 1.1) finalScore -= 5
      else finalScore -= 10

      finalScore = Math.max(0, Math.min(100, finalScore))
      setScore(finalScore)

      setStatus(
        finalScore >= 80 ? 'good' :
        finalScore >= 60 ? 'neutral' : 'bad'
      )
    }

    calculateScore()
  }, [user, limits])

  const color =
    status === 'good'
      ? 'text-emerald-400'
      : status === 'bad'
      ? 'text-red-400'
      : 'text-yellow-400'

  const Icon =
    status === 'good'
      ? ShieldCheck
      : status === 'bad'
      ? TrendingDown
      : TrendingUp

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="absolute top-13 right-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-3 py-2 w-40 cursor-pointer hover:scale-[0.98] transition"
        style={{ transform: 'scale(0.8)',zIndex:'200' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <p className={`font-semibold ${color}`}>{score}</p>
            <p className="text-xs text-zinc-500 mb-1">/100</p>
          </div>
          <Icon size={16} className={color} />
        </div>

        <p className="text-xs text-zinc-400 mt-1">
          {status === 'good'
            ? 'Smart Spender'
            : status === 'neutral'
            ? 'Stable'
            : 'Overspending'}
        </p>
      </div>

      <EditLimitsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        limits={limits}
        setLimits={setLimits}
        onSave={async () => {
          await saveLimits(user.userId, limits)
          setOpen(false)
        }}
      />
    </>
  )
}

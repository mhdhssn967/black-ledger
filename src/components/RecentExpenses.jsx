import { useEffect, useState, useContext } from "react"
import { fetchRecentExpenses } from "../service/expenseService"
import { UserContext } from "../context/UserContext"
import { IndianRupee, Tag } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RecentExpenses() {
  const USER_ID = useContext(UserContext)
  const [expenses, setExpenses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadRecent()
  }, [USER_ID])

  const loadRecent = async () => {
    if (USER_ID.userId) {
      const data = await fetchRecentExpenses(USER_ID.userId)
      setExpenses(data)
    }
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg text-white font-semibold" style={{margin:'20px 5px -5px 30px'}} >Recent Expenses</h2>
        
      </div>

      {/* List */}
      <div className="space-y-4">
        {expenses.length === 0 && (
          <p className="text-zinc-500 text-sm">No recent expenses</p>
        )}

        {expenses.map(exp => {
          const date = new Date(exp.transactionDate)

          const formattedDate = date
            ? date.toLocaleDateString()
            : ""

          return (
            <div style={{maxWidth:'95%',margin:'10px'}}
              key={exp.id}
              className="flex justify-between items-center bg-zinc-950/70 border border-zinc-800 rounded-2xl px-4 py-3 hover:border-emerald-500/40 transition"
            >

              {/* Left */}
              <div>
                <p className="text-white font-medium">
                  {exp.category || "Expense"}
                </p>
                <p className="text-xs text-zinc-500">
                  {formattedDate}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <IndianRupee size={16} />
                {Number(exp.amount).toLocaleString()}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

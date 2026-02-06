import { useContext, useEffect, useState } from 'react'
import {
  fetchCredits,
  deleteCredit,
  updateCredit
} from '../service/creditService'
import {
  Trash2,
  Pencil,
  X,
  Calendar,
  IndianRupee
} from 'lucide-react'
import { UserContext } from '../context/UserContext'
import TriangleLoader from './TriangleLoader'

export default function CreditTable() {
  const [credits, setCredits] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')

  const userId = useContext(UserContext)

  useEffect(() => {
    if (userId.userId) loadCredits()
  }, [userId])

  const loadCredits = async () => {
    const data = await fetchCredits(userId.userId)
    setCredits(data)
    setLoading(false)
  }

  /* 📅 AVAILABLE MONTHS */
  const availableMonths = Array.from(
    new Set(
      credits
        .filter(c => c.createdAt)
        .map(c =>
          c.createdAt.toDate().toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })
        )
    )
  )

  /* 🔍 FILTERS */
  const filteredCredits = credits.filter(cred => {
    if (!cred.createdAt) return false
    const date = cred.createdAt.toDate()

    if (fromDate && date < new Date(fromDate)) return false
    if (toDate && date > new Date(toDate)) return false

    if (selectedMonth) {
      const monthKey = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
      })
      if (monthKey !== selectedMonth) return false
    }

    return true
  })

  /* 📦 GROUP BY MONTH */
  const groupedCredits = filteredCredits.reduce((acc, cred) => {
    const date = cred.createdAt.toDate()
    const monthKey = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })

    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(cred)
    return acc
  }, {})

  return (
    <div className="max-w-xl mx-auto px-4 pb-10">
      {loading && <TriangleLoader />}

      <h1 className="text-xl font-semibold text-white mb-2" style={{marginBottom:'10px'}}>
        Credits
      </h1>

      {/* 🔍 FILTERS */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 mb-6 space-y-4">

        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="w-full bg-zinc-800 rounded-xl px-4 py-2 text-white outline-none"
        >
          <option value="">All months</option>
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <input style={{width:'140px'}}
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="flex-1 bg-zinc-800 rounded-xl px-4 py-2 text-white outline-none"
          />

          <input
          style={{width:'140px'}}
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="flex-1 bg-zinc-800 rounded-xl px-4 py-2 text-white outline-none"
          />
        </div>

        {(fromDate || toDate || selectedMonth) && (
          <button
            onClick={() => {
              setFromDate('')
              setToDate('')
              setSelectedMonth('')
            }}
            className="text-sm text-emerald-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* 📄 LIST */}
      <div className="space-y-8">
        {Object.entries(groupedCredits).map(([month, monthCredits]) => {
          const monthTotal = monthCredits.reduce(
            (sum, c) => sum + Number(c.amount || 0),
            0
          )

          return (
            <div key={month}>
              <div className="flex justify-between items-center mb-3 mt-5">
                <h2 className="text-sm font-semibold text-emerald-400" style={{marginBottom:'10px',marginTop:'20px'}}>
                  {month}
                </h2>

                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <IndianRupee size={14} />
                  {monthTotal.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                {monthCredits.map(cred => (
                  <div style={{marginBottom:'10px'}}
                    key={cred.id}
                    onClick={() => setSelected(cred)}
                    className="flex justify-between items-center bg-zinc-900/80 p-4 rounded-2xl cursor-pointer hover:bg-zinc-900 border border-zinc-800"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-white">
                        {cred.source || 'Credit'}
                      </p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {cred.createdAt?.toDate().toDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <IndianRupee size={16} />
                      {cred.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <CreditModal
          credit={selected}
          onClose={() => setSelected(null)}
          onDelete={async () => {
            await deleteCredit(selected.id, userId.userId)
            setSelected(null)
            loadCredits()
          }}
          onSave={async updated => {
            await updateCredit(selected.id, updated, userId.userId)
            setSelected(null)
            loadCredits()
          }}
        />
      )}
    </div>
  )
}

/* ================= MODAL ================= */

function CreditModal({ credit, onClose, onDelete, onSave }) {
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({ ...credit })

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-sm border border-zinc-800 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-white mb-6">
          Credit details
        </h2>

        <div className="space-y-3 text-sm">
          {['amount', 'source', 'remarks'].map(key => (
            <div
              key={key}
              className="flex justify-between gap-4 bg-zinc-900/60 rounded-xl px-4 py-3"
            >
              <p className="text-xs text-zinc-400 uppercase">
                {key}
              </p>

              {edit ? (
                <input
                  value={data[key] || ''}
                  onChange={e =>
                    setData({ ...data, [key]: e.target.value })
                  }
                  className="bg-zinc-800 rounded-lg px-3 py-1 text-white outline-none text-sm"
                />
              ) : (
                <p className="text-white font-medium">
                  {credit[key] || '—'}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>

          {edit ? (
            <button
              onClick={() => onSave(data)}
              className="bg-emerald-500 text-black px-5 py-2 rounded-xl"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="flex items-center gap-2 text-emerald-400 text-sm"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

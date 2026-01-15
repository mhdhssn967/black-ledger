import { useContext, useEffect, useState } from 'react'
import {
  fetchExpenses,
  deleteExpense,
  updateExpense
} from '../service/expenseService'
import {
  Trash2,
  Pencil,
  X,
  Calendar,
  IndianRupee
} from 'lucide-react'
import { UserContext } from '../context/UserContext'
import TriangleLoader from './TriangleLoader'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading,setLoading]=useState(true)
   const userId = useContext(UserContext)

  const [fromDate, setFromDate] = useState('')
const [toDate, setToDate] = useState('')
const [selectedMonth, setSelectedMonth] = useState('')
const availableMonths = Array.from(
  new Set(
    expenses
      .filter(e => e.createdAt)
      .map(e =>
        e.createdAt.toDate().toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
      )
  )
)


  useEffect(() => {
    if(userId.userId){loadExpenses()}
  }, [userId])

  const loadExpenses = async () => {
    const data = await fetchExpenses(userId.userId)
    setExpenses(data)
    setLoading(false)
  }
const filteredExpenses = expenses.filter(exp => {
  if (!exp.createdAt) return false

  const date = exp.createdAt.toDate()

  // 📅 From date
  if (fromDate && date < new Date(fromDate)) return false

  // 📅 To date
  if (toDate && date > new Date(toDate)) return false

  // 📆 Month dropdown
  if (selectedMonth) {
    const monthKey = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })
    if (monthKey !== selectedMonth) return false
  }

  return true
})

const groupedExpenses = filteredExpenses.reduce((acc, exp) => {
  const date = exp.createdAt.toDate()
  const monthKey = date.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })

  if (!acc[monthKey]) acc[monthKey] = []
  acc[monthKey].push(exp)

  return acc
}, {})


  return (
    <div className="max-w-xl mx-auto px-4 pb-10">
{loading&&<TriangleLoader/>}
      {/* 🔹 HEADING */}
      <h1 className="text-xl font-semibold text-white mb-2" style={{marginBottom:'5px'}}>
        Expenses
      </h1>
     {/* 🔍 FILTERS */}
<div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 mb-6 space-y-4">

  {/* Month Dropdown */}
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

  {/* Date Range */}
  <div className="flex gap-3">
    <input
    style={{width:'120px'}}
      type="date"
      value={fromDate}
      onChange={e => setFromDate(e.target.value)}
      className="flex-1 bg-zinc-800 rounded-xl px-4 py-2 text-white outline-none"
    />

    <input
    style={{width:'120px'}}
      type="date"
      value={toDate}
      onChange={e => setToDate(e.target.value)}
      className="flex-1 bg-zinc-800 rounded-xl px-4 py-2 text-white outline-none"
    />
  </div>

  {/* Clear */}
  {(fromDate || toDate || selectedMonth) && (
    <button
      onClick={() => {
        setFromDate('')
        setToDate('')
        setSelectedMonth('')
      }}
      className="text-sm text-emerald-400 hover:text-emerald-300" style={{margin:'10px'}}
    >
      Clear filters
    </button>
  )}
</div>


      {/* 🔹 LIST */}
      <div className="space-y-8">
  {Object.entries(groupedExpenses).map(([month, monthExpenses]) => {
  const monthTotal = monthExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  )

  return (
    <div key={month}>

      {/* 🔹 Month Header */}
      <div className="flex justify-between items-center mb-3 mt-5" style={{margin:'20px 10px'}}>
  <h2 className="text-sm font-semibold text-emerald-400 tracking-wide">
    {month}
  </h2>

  <div className="flex items-center gap-1 text-red-400 font-semibold text-md">
    <IndianRupee size={14} />
    {monthTotal.toLocaleString()}
  </div>
</div>


      {/* 🔹 Expenses */}
      <div className="space-y-3">
        {monthExpenses.map(exp => (
          <div
            key={exp.id}
            onClick={() => setSelected(exp)}
            className="flex justify-between items-center bg-zinc-900/80 p-4 rounded-2xl cursor-pointer hover:bg-zinc-900 transition border border-zinc-800"
            style={{ margin: '10px auto' }}
          >
            <div className="space-y-1">
              <p className="font-medium text-white">
                {exp.category}
              </p>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <Calendar size={12} />
                {exp.createdAt?.toDate().toDateString()}
              </p>
            </div>

            <div className="flex items-center gap-1 text-red-400 font-semibold">
              <IndianRupee size={16} />
              {exp.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )})}
</div>


      {/* 🔹 MODAL */}
      {selected && (
        <ExpenseModal
          expense={selected}
          onClose={() => setSelected(null)}
          onDelete={async () => {
            await deleteExpense(selected.id,userId.userId)
            setSelected(null)
            loadExpenses()
          }}
          onSave={async updated => {
            await updateExpense(selected.id, updated,userId.userId)
            setSelected(null)
            loadExpenses()
          }}
        />
      )}
    </div>
  )
}

/* ================= MODAL ================= */

function ExpenseModal({ expense, onClose, onDelete, onSave }) {
  const user_id = useContext(UserContext)
  const usePreferenceItems = (type, user_id) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user_id?.userId) return;

      const ref = doc(
        db,
        'users',
        user_id.userId,
        'preferences',
        'settings'
      );

      const snap = await getDoc(ref);
      if (snap.exists()) {
        setItems(snap.data()[type] || []);
      }
    };

    fetchData();
  }, [type, user_id]);

  return items;
};
const categories = usePreferenceItems('categories', user_id);
const sources = usePreferenceItems('sources', user_id);
const contexts = usePreferenceItems('contexts', user_id);

  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({ ...expense })
  const renderField = (key) => {
  if (['category', 'source', 'context'].includes(key)) {
    const options =
      key === 'category' ? categories :
      key === 'source' ? sources :
      contexts;

    return (
      <select
        value={data[key] || ''}
        onChange={e =>
          setData({ ...data, [key]: e.target.value })
        }
        className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-white outline-none text-sm"
      >
        <option value="">Select {key}</option>
        {options.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }

  // amount & remarks
  return (
    <input
      value={data[key] || ''}
      onChange={e =>
        setData({ ...data, [key]: e.target.value })
      }
      className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-white outline-none text-sm"
    />
  );
};

  

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-sm relative border border-zinc-800 modal-custom">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-white mb-6">
          Expense details
        </h2>

        {/* Fields */}
        <div className="space-y-3 text-sm">
  {['amount', 'category', 'source', 'context', 'remarks'].map(key => (
    <div
      key={key}
      className="flex items-start justify-between gap-4 bg-zinc-900/60 rounded-xl px-4 py-3"
    >
      {/* Label */}
      <div className="w-32 shrink-0">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">
          {key}
        </p>
      </div>

      {/* Value */}
      <div className="flex-1 text-right">
  {edit ? (
    renderField(key)
  ) : (
    <p className="text-white font-medium">
      {expense[key] || '—'}
    </p>
  )}
</div>

    </div>
  ))}
</div>


        {/* Actions */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm" style={{color:'red'}}
          >
            <Trash2 size={16} />
            Delete
          </button>

          {edit ? (
            <button
              onClick={() => onSave(data)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl font-medium transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
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

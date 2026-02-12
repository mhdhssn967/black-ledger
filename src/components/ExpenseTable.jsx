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

import {
  Tag,
  CreditCard,
  Users,
  FileText
} from "lucide-react"


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
      .filter(e => e.transactionDate)
      .map(e =>
        new Date(e.transactionDate).toLocaleString('default', {
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
  if (!exp.transactionDate) return false

  const dateStr = exp.transactionDate // "YYYY-MM-DD"

  // 📅 From date
  if (fromDate && dateStr < fromDate) return false

  // 📅 To date
  if (toDate && dateStr > toDate) return false

  // 📆 Month dropdown
  if (selectedMonth) {
    const monthKey = new Date(dateStr).toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })

    if (monthKey !== selectedMonth) return false
  }

  return true
})


const groupedExpenses = filteredExpenses.reduce((acc, exp) => {
  if (!exp.transactionDate) return acc

  const monthKey = exp.transactionDate.slice(0, 7) // "YYYY-MM"

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
  {new Date(month + "-01").toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })}
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
                {exp.transactionDate}
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
const InfoCard = ({
  icon,
  label,
  value,
  edit,
  options = [],
  onChange,
  textarea = false
}) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm " style={{marginBottom:'10px'}}>

      <div className="flex items-center gap-3 mb-2 text-emerald-400 text-xs uppercase tracking-wide">
        {icon}
        <span >{label}</span>
      </div>

      {edit ? (
        textarea ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-800 rounded-xl px-3 py-2 text-white outline-none text-sm" 
          />
        ) : (
          <select style={{marginTop:'15px'}}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-800 rounded-xl px-3 py-2 text-white outline-none text-sm"
          >
            <option value="">Select {label}</option>
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        )
      ) : (
        <p className="text-white font-medium text-sm" style={{marginTop:'10px'}}>
          {value || "—"}
        </p>
      )}
    </div>
  )
}

  

return (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4 modal-custom">
    <div className="bg-zinc-950 rounded-3xl w-full max-w-md p-6 relative border border-zinc-800 shadow-2xl">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
      >
        <X size={18} />
      </button>

      {/* DATE */}
      <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm mb-5">
        <Calendar size={16} />
        {edit ? (
          <input
            type="date"
            value={data.transactionDate || ""}
            onChange={(e) =>
              setData({ ...data, transactionDate: e.target.value })
            }
            className="bg-zinc-800 px-3 py-1 rounded-lg text-sm text-white outline-none"
          />
        ) : (
          <span>
            {data.transactionDate
              ? new Date(data.transactionDate).toLocaleDateString("default", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })
              : "—"}
          </span>
        )}
      </div>

      {/* AMOUNT */}
      <div className="text-center mb-8" style={{margin:'20px'}}>
        {edit ? (
          <input
            type="number"
            value={data.amount}
            onChange={(e) =>
              setData({ ...data, amount: e.target.value })
            }
            className="bg-transparent text-6xl font-bold text-white text-center outline-none w-full"
          />
        ) : (
          <h1 className="text-6xl font-bold text-white tracking-tight">
            ₹{data.amount}
          </h1>
        )}
      </div>

      {/* INFO SECTIONS */}
      <div className="space-y-4">

        <InfoCard
          icon={<Tag size={18} />}
          label="Category"
          value={data.category}
          edit={edit}
          options={categories}
          onChange={(val) => setData({ ...data, category: val })}
        />

        <InfoCard
          icon={<CreditCard size={18} />}
          label="Paid Using"
          value={data.source}
          edit={edit}
          options={sources}
          onChange={(val) => setData({ ...data, source: val })}
        />

        <InfoCard
          icon={<Users size={18} />}
          label="With"
          value={data.context}
          edit={edit}
          options={contexts}
          onChange={(val) => setData({ ...data, context: val })}
        />

        {data.remarks&&<InfoCard
          icon={<FileText size={18} />}
          label="Remarks"
          value={data.remarks}
          edit={edit}
          textarea
          onChange={(val) => setData({ ...data, remarks: val })}
        />}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={onDelete}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition"
        >
          <Trash2 size={16} />
          Delete
        </button>

        {edit ? (
          <button
            onClick={() => onSave(data)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-xl font-medium transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition"
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

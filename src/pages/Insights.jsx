import React, { useState } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import CreditTable from '../components/CreditTable'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Insights = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('expenses')

  return (
    <div className="max-w-xl mx-auto">

      {/* 🔙 Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6"
        style={{ margin: '30px' }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* 🔁 TOGGLE BUTTONS */}
      <div className="flex bg-zinc-900/80 border border-zinc-800 rounded-2xl p-1 mx-4 mb-6" style={{width:'95%',margin:'10px'}}>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition
            ${activeTab === 'expenses'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-400 hover:text-white'}
          `}
        >
          Expenses
        </button>

        <button
          onClick={() => setActiveTab('credits')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition
            ${activeTab === 'credits'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-400 hover:text-white'}
          `}
        >
          Credits
        </button>
      </div>

      {/* 📊 CONTENT */}
      {activeTab === 'expenses' && <ExpenseTable />}
      {activeTab === 'credits' && <CreditTable />}
    </div>
  )
}

export default Insights

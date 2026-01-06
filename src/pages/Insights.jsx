import React from 'react'
import ExpenseTable from '../components/ExpenseTable'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Insights = () => {
    const navigate = useNavigate()
  return (
    <div>
        <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white " style={{margin:'30px'}}
      >
        <ArrowLeft size={18} />
        Back
      </button>
        <ExpenseTable/>
      
    </div>
  )
}

export default Insights

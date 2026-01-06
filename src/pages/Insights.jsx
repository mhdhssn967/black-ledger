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
      <div style={{display:'flex',justifyContent:'center'}}><button
  onClick={() => navigate('/expensebreakdown')} style={{marginBottom:'10px'}}
  className="
    mt-6
    w-75
    bg-emerald-400
    border border-zinc-800
    rounded-2xl
    px-8
    py-4
    text-white
    font-semibold
    flex
    items-center
    justify-between
    hover:border-emerald-500
    hover:bg-zinc-900/80
    transition
  "
>
  <span>View expense breakdown</span>
  <span className="text-black-400 text-bg">→</span>
</button></div>
        <ExpenseTable/>
      
    </div>
  )
}

export default Insights

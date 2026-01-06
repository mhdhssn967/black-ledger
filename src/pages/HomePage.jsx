import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon } from 'lucide-react'
import CategoryChips from '../components/CategoryChips'
import { saveExpense } from '../service/saveExpense'
import './HomePage.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FinanceCard from '../components/FinanceCard'
import { UserContext } from '../context/UserContext'
import { getFinanceSummary } from '../service/getFinanceSummary'

const MySwal = withReactContent(Swal)

export default function HomePage() {
  
   const userId = useContext(UserContext)
  const navigate = useNavigate()

  const [step, setStep] = useState('amount')


  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    source: '',
    context: '',
    remarks: ''
  })

  /* ---------- HANDLERS ---------- */

  const handleAmountChange = e => {
    const value = e.target.value.replace(/\D/g, '')
    setExpense(prev => ({ ...prev, amount: value }))
  }

  const handleCategorySelect = category => {
    setExpense(prev => ({ ...prev, category }))
    setStep('source')
  }

  const handleSourceSelect = source => {
    setExpense(prev => ({ ...prev, source }))
    setStep('context')
  }

  const handleContextSelect = context => {
    setExpense(prev => ({ ...prev, context }))
    setStep('remarks')
  }

  const handleSave = async () => {
    if (!expense.amount || !expense.category) return

    await saveExpense(expense,userId.userId)

    MySwal.fire({
    title: 'Expense Added!',
    html: `
      <div class="text-left">
        <p>₹${expense.amount}</p>
        <p>Category: ${expense.category}</p>
      </div>
    `,
    showConfirmButton: false,
    timer: 2000,
    background: '#111827', // dark background
    color: '#fff',         // text color
    toast: true,
    position: 'center',
    icon: 'success',
    iconColor: '#10b981', // emerald green to match your button
  })

    // reset UI
    setExpense({
      amount: '',
      category: '',
      source: '',
      context: '',
      remarks: ''
    })
    setStep('amount')
  }
const [data,setData]=useState({})
  /* ---------- UI ---------- */

  useEffect(()=>{
    const getNameTitle=async()=>{
      
 if(userId.userId){const summary = await getFinanceSummary(userId.userId)
      setData(summary)}
    };getNameTitle()
  },[userId])

  return (
    <div style={{marginBottom:'20px'}}>
      <div className="relative bg-black text-white flex items-center justify-center px-6 overflow-hidden">
      <div className='nav'>
        <img src="/logo.png" width={"150px"} alt="" />
          {/* ⚙ SETTINGS */}
          <button
            onClick={() => navigate('/settings')}
            className="hover:text-white transition"
          >
            <SettingsIcon size={22} />
          </button>
      </ div>
      
        {/* 🔮 BACKGROUND BRANDING */}
        <div className='home-one'>
          <div className="home-ui">
            <span className="text-[25vw] font-extrabold tracking-tight text-white/80" style={{textWrap:'nowrap'}}>
              {/* <h3 className="text-[19vw]">Hi</h3> */}
                {data?.profile?.name}
                <p style={{fontStyle:'italic',fontWeight:'200',fontSize:'20px',marginTop:'-30px'}}>{data?.profile?.title}</p>
            </span>
            <br />
            {/* <span className="mt-[-2rem] text-xl tracking-widest text-white/80 uppercase">
               Manage all your expenses at ease
            </span> */}
          </div>
        
      
        {/* 🧠 FOREGROUND CONTENT */}
        <div className="relative z-10 w-full max-w-sm"  style={{marginTop:'220px'}}>
      
          {/* 💰 AMOUNT */}
          {step === 'amount' && (
            <div className="flex flex-col items-center text-center">
              <p className="text-zinc-400 text-sm mb-3">
                Enter amount
              </p>
      
              <input
                autoFocus
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={expense.amount}
                onChange={handleAmountChange}
                placeholder="₹0"
                className="bg-transparent text-6xl font-semibold outline-none tracking-tight text-center"
              />
      
              <button
                disabled={!expense.amount}
                onClick={() => setStep('category')}
                className="mt-10 w-75 rounded-2xl bg-emerald-500 disabled:bg-zinc-800 text-black font-semibold py-4 transition"
              >
                ADD
              </button>
            </div>
          )}
      
          {/* 🏷 CATEGORY */}
          {step === 'category' && (
            <>
              <p className="text-zinc-400 text-sm text-center text-[25px]" style={{margin:'10px'}}>
                ₹{expense.amount} spent on
              </p>
              <CategoryChips
                type="categories"
                onSelect={handleCategorySelect}
              />
            </>
          )}
      
          {/* 💳 SOURCE */}
          {step === 'source' && (
            <>
              <p className="text-zinc-400 text-sm mb-3 text-center text-[25px]" style={{margin:'10px'}}>
                Paid using
              </p>
              <CategoryChips
                type="sources"
                onSelect={handleSourceSelect}
              />
            </>
          )}
      
          {/* 👥 CONTEXT */}
          {step === 'context' && (
            <>
              <p className="text-zinc-400 text-sm mb-3 text-center text-[25px]" style={{margin:'10px'}}>
                Expense with
              </p>
              <CategoryChips
                type="contexts"
                onSelect={handleContextSelect}
              />
            </>
          )}
      
          {/* 📝 REMARKS */}
          {step === 'remarks' && (
            <>
              <textarea
                value={expense.remarks}
                onChange={e =>
                  setExpense(prev => ({
                    ...prev,
                    remarks: e.target.value
                  }))
                }
                placeholder="Any remarks? (optional)"
                className="w-full bg-zinc-900 rounded-xl px-4 py-3 outline-none min-h-[90px]"
              />
      
              <button
                onClick={handleSave}
                className="mt-4 w-full rounded-xl bg-emerald-500 text-black font-semibold py-4"
              >
                Done
              </button>
            </>
          )}
      
        </div>
        </div>
         
      </div>
     <div className='home-bottom'><div className="p-6 bg-black flex justify-center items-start">
        <FinanceCard />
      </div>
      <div style={{display:'flex',justifyContent:'center'}}><button
  onClick={() => navigate('/debts')}
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
  <span>Manage your debts</span>
  <span className="text-black-400 text-bg">→</span>
</button></div>
</div>

    </div>
  )
}

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBigLeft, Settings as SettingsIcon } from 'lucide-react'
import CategoryChips from '../components/CategoryChips'
import { saveExpense } from '../service/saveExpense'
import './HomePage.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FinanceCard from '../components/FinanceCard'
import { UserContext } from '../context/UserContext'
import { getFinanceSummary } from '../service/getFinanceSummary'
import TodayExpenseCard from '../components/TodayExpenseCard'
import TriangleLoader from '../components/TriangleLoader'
import SpendingScore from '../components/SpendingScore'
import SurpriseModal from '../components/SurpriseModal'
import { checkSurprise } from '../service/services'
import BirthdayModal from '../components/BirthdayModal'

const MySwal = withReactContent(Swal)

export default function HomePage() {
  
   const userId = useContext(UserContext)
  const navigate = useNavigate()

  const [step, setStep] = useState('amount')

  const [loading,setLoading]=useState(true)
  const [saving, setSaving] = useState(false);



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
  if (!expense.amount || !expense.category || saving) return;

  setSaving(true);

  // 🔄 Show loading Swal
  MySwal.fire({
    title: 'Adding expense...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: '#111827',
    color: '#fff',
    didOpen: () => {
      MySwal.showLoading();
    }
  });

  try {
    await saveExpense(expense, userId.userId);

    // ✅ Success alert
    MySwal.fire({
      title: 'Expense Added!',
      html: `
        <div class="text-left">
          <p><strong>₹${expense.amount}</strong></p>
          <p>Category: ${expense.category}</p>
        </div>
      `,
      showConfirmButton: false,
      timer: 2000,
      background: '#111827',
      color: '#fff',
      toast: true,
      position: 'center',
      icon: 'success',
      iconColor: '#10b981'
    });

    // 🔄 Reset UI
    setExpense({
      amount: '',
      category: '',
      source: '',
      context: '',
      remarks: ''
    });
    setStep('amount');

  } catch (error) {
    // ❌ Error handling
    MySwal.fire({
      title: 'Failed to add expense',
      text: 'Please try again',
      icon: 'error',
      background: '#111827',
      color: '#fff'
    });
  } finally {
    setSaving(false);
  }
};

const [data,setData]=useState({})

const [birthday,setBirthday]=useState(false)
  /* ---------- UI ---------- */

  useEffect(()=>{
    const getNameTitle=async()=>{
      
 if(userId.userId){const summary = await getFinanceSummary(userId.userId)
      setData(summary)
    setLoading(false)
    }
    };getNameTitle()
  },[userId])


const goBack = () => {
  if (step === 'category') {
    setExpense(prev => ({ ...prev, category: null }));
    setStep('amount');
  } 
  else if (step === 'source') {
    setExpense(prev => ({ ...prev, source: null }));
    setStep('category');
  } 
  else if (step === 'context') {
    setExpense(prev => ({ ...prev, context: null }));
    setStep('source');
  } 
  else if (step === 'remarks') {
    setExpense(prev => ({ ...prev, remarks: '' }));
    setStep('context');
  }
};
const [showSurprise, setShowSurprise] = useState(false)
console.log(showSurprise);


useEffect(() => {
  const init = async () => {
    const isSurprise = await checkSurprise(userId.userId)
    setShowSurprise(isSurprise)
  }

  init()
}, [userId])

  return (
  
    <div style={{marginBottom:'20px'}}>

{showSurprise&&<button onClick={()=>setBirthday(true)} style={{position:'fixed',top:'150px',zIndex:'500',right:'30px'}}>
  <img src="/surprise/gift.gif" style={{width:'60px',height:'55px',borderRadius:'50%',}} alt="" />
</button>}
{birthday&&<BirthdayModal setBirthday={setBirthday}/>}

      {loading&&<TriangleLoader/>}
      
      <div className="relative bg-black text-white flex items-center justify-center px-6 overflow-hidden">
      <div className='nav'>
        <img src="/logo.png" alt="" />
          {/* ⚙ SETTINGS */}
          <button
            onClick={() => navigate('/settings')}
            className="hover:text-white transition"
          >
            <SettingsIcon size={22} />
          </button>
      </ div>
      <SpendingScore/>
      
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
          {step !== 'amount' && (
  <button
    onClick={goBack}
    className="
      flex items-center gap-2
      text-black
      bg-emerald-400
      transition
      rounded-xl
      p-1
    "
  style={{marginRight:'20px',position:'fixed',left:'40px'}}
  >
   <ArrowBigLeft />
  </button>
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
  disabled={saving}
  className={`
    mt-4 w-full rounded-xl font-semibold py-4 transition
    ${saving 
      ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
      : 'bg-emerald-500 text-black'}
  `}
>
  {saving ? 'Adding...' : 'Done'}
</button>

            </>
          )}
      
        </div>
        </div>
         
      </div>
      
     <div className='home-bottom'><div style={{alignItems:'center'}} className="p-6 bg-black flex-col flex justify-center ">
        <TodayExpenseCard/>
        <FinanceCard />

      </div>
      
      <div className="flex justify-center gap-4 mt-6">
  {/* Analysis */}
  <button
    onClick={() => navigate('/expensebreakdown')}
    className="
      flex items-center gap-3
      rounded-2xl
      px-8 py-4
      bg-emerald-400
      text-black
      font-semibold
      border border-emerald-500
      hover:bg-emerald-500
      transition
    "
  >
    <span>Analysis</span>
    <span className="text-lg">→</span>
  </button>

  {/* Debts */}
  <button
    onClick={() => navigate('/debts')}
    className="
      flex items-center gap-3
      rounded-2xl
      px-8 py-4
      bg-zinc-900
      text-white
      font-semibold
      border border-zinc-800
      hover:border-emerald-500
      hover:text-emerald-400
      transition
    "
  >
    <span>Debts</span>
    <span className="text-lg">→</span>
  </button>
</div>

</div>

    </div>
  
  )
}

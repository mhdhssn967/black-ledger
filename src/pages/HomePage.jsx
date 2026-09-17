import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBigLeft, Settings as SettingsIcon, QrCode } from 'lucide-react'
import CategoryChips from '../components/CategoryChips'
import QRScanner from '../components/QRScanner'
import { addTransactionDateToExistingExpenses, saveExpense } from '../service/saveExpense'
import './HomePage.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FinanceCard from '../components/FinanceCard'
import { UserContext } from '../context/UserContext'
import { getFinanceSummary } from '../service/getFinanceSummary'
import TodayExpenseCard from '../components/TodayExpenseCard'
import TriangleLoader from '../components/TriangleLoader'
import SpendingScore from '../components/SpendingScore'
import { checkSurprise } from '../service/services'
import confetti from 'canvas-confetti'
import RecentExpenses from '../components/RecentExpenses'

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
    remarks: '',
    transactionDate: new Date().toISOString().split('T')[0]
  })

  const [isScanning, setIsScanning] = useState(false)
  const [scannedUpiUrl, setScannedUpiUrl] = useState('')
  const [payeeName, setPayeeName] = useState('')

  const handleScanSuccess = (decodedText) => {
    setIsScanning(false)
    if (decodedText.startsWith('upi://')) {
      setScannedUpiUrl(decodedText)
      try {
        const url = new URL(decodedText)
        const searchParams = url.searchParams
        
        const pn = searchParams.get('pn')
        const am = searchParams.get('am')
        
        if (pn) {
          setPayeeName(pn)
          setExpense(prev => ({ ...prev, context: pn, remarks: `Paid to ${pn}` }))
        }
        
        if (am) {
          setExpense(prev => ({ ...prev, amount: am }))
        }
        setStep('amount')
      } catch (e) {
        console.error('Invalid UPI URL format')
      }
    } else {
      setExpense(prev => ({ ...prev, remarks: decodedText }))
      setStep('amount')
    }
  }

   const popHearts = (big = false) => {
      confetti({
        particleCount: big ? 140 : 130,
        spread: big ? 160 : 70,
        origin: { y: 0.65 },
        shapes: ['heart'],
        colors: ['#ff4d6d', '#ff758f', '#ff8fab'],
        scalar: big ? 1.3 : 1
      })
    }

  /* ---------- HANDLERS ---------- */

  const handleAmountChange = e => {
    const value = e.target.value.replace(/\D/g, '')
    setExpense(prev => ({ ...prev, amount: value }))
  }

  const handleDateChange = (e) => {
  const value = e.target.value

  setExpense(prev => ({
    ...prev,
    transactionDate: value
  }))
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
    await MySwal.fire({
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

    if (scannedUpiUrl) {
      const result = await MySwal.fire({
        title: 'Open Payment App?',
        text: `Proceed to pay ${payeeName ? payeeName : 'the merchant'} ₹${expense.amount}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Pay Now',
        cancelButtonText: 'Later',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });

      if (result.isConfirmed) {
        let finalUrl = scannedUpiUrl;
        if (!finalUrl.includes('am=')) {
          finalUrl += `&am=${expense.amount}`;
        }
        window.location.href = finalUrl;
      }
    }

    // 🔄 Reset UI
    setExpense({
      amount: '',
      category: '',
      source: '',
      context: '',
      remarks: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setStep('amount');
    setScannedUpiUrl('');
    setPayeeName('');

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
  if (step === 'date') {
    setExpense(prev => ({ ...prev, date: null }));
    setStep('amount');
  } 
  if (step === 'category') {
    setExpense(prev => ({ ...prev, category: null }));
    setStep('date');
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


useEffect(() => {
  const init = async () => {
    const isSurprise = await checkSurprise(userId.userId)
    setShowSurprise(isSurprise)
  }

  init()
}, [userId])

useEffect(()=>{
showSurprise&&popHearts()
},[loading])




  return (
    <div className={showSurprise ? 'birthday-mode' : ''}> 
    {showSurprise && (
  <div className="birthday-effects">
    {Array.from({ length: 20 }).map((_, i) => (
      <span
        key={i}
        className="floating-icon"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${20 + Math.random() * 30}px`
        }}
      >
        {i % 3 === 0 ? '🎂' : '💖'}
      </span>
    ))}
  </div>
)}
 
  
    <div style={{marginBottom:'20px'}}>
       

{(showSurprise&&!birthday)&&<button onClick={()=>setBirthday(true)} style={{position:'fixed',top:'150px',zIndex:'500',right:'30px'}}>
  <img src="/surprise/gift.gif" style={{width:'60px',height:'55px',borderRadius:'50%',}} alt="" />
</button>}


      {loading&&<TriangleLoader/>}
      
      <div className="relative bg-black text-white flex items-center justify-center px-6 overflow-hidden">
      
      <SpendingScore/>
     
        {/* 🔮 BACKGROUND BRANDING */}
        <div className='home-one'>

          <div className="home-ui flex flex-col items-center justify-center py-6">
            <button 
              onClick={() => setIsScanning(true)}
              className="group relative flex flex-col items-center justify-center p-8 bg-zinc-900/80 rounded-3xl border border-zinc-800 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-emerald-900/30 hover:border-emerald-500/50"
            >
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <QrCode size={80} className="text-emerald-400 mb-4 animate-pulse group-hover:animate-none" />
              <span className="text-xl font-medium tracking-wide bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Scan to Pay
              </span>
            </button>
          </div>


      
        {/* 🧠 FOREGROUND CONTENT */}
        {step !== 'amount' && (
  <div
    style={{
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(5px)', // for Safari
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1
    }}
  />
)}

       <div style={{display:'flex',alignItems:'center',width:'100vw',justifyContent:'center'}} >
        
         <div style={{padding:'20px',maxWidth:'90%'}}
  className={`
    relative z-10 w-full max-w-sm rounded-2xl 
    ${step !== 'amount' ? "bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm" : ''}
  `}

>


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
  style={{marginBottom:'20px',position:'fixed'}}
  >
   <ArrowBigLeft />
  </button>
)}
          {/* 💰 AMOUNT */}
          {step === 'amount' && (
            <div className="flex flex-col items-center text-center" >
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
                onClick={() => setStep('date')}
                className="mt-10 w-75 rounded-2xl bg-emerald-500 disabled:bg-zinc-800 text-black font-semibold py-4 transition"
              >
                ADD
              </button>
            </div>
          )}

          

{
  step==='date' && (
    <div style={{display:'flex',flexDirection:'column'}}>
   <p className="text-zinc-400 text-sm text-center text-[25px]" style={{marginBottom:'10px'}}>
                Chose date
              </p>
    <input 
  type="date"
  max={new Date().toISOString().split('T')[0]}
  value={expense.transactionDate}
  onChange={handleDateChange}
  className="w-75 mt-6 bg-zinc-900 text-white rounded-xl px-4 py-3 outline-none" style={{marginBottom:'20px'}}
/>
<button
                onClick={() => setStep('category')}
                className="mt-10 w-75 rounded-2xl bg-emerald-500 disabled:bg-zinc-800 text-black font-semibold py-4 transition"
              >
                Next
              </button>

    </div>
  )
}

      
          {/* 🏷 CATEGORY */}
          {step === 'category' && (
            <>
              <p className="text-zinc-400 text-sm text-center text-[25px]" style={{marginBottom:'10px'}}>
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
              <p className="text-zinc-400 text-sm mb-3 text-center text-[25px]" style={{marginBottom:'10px'}}>
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
              <textarea style={{marginTop:'50px'}}
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
         
      </div>
      
     <div className='home-bottom'><div style={{alignItems:'center'}} className="p-6 bg-black flex-col flex justify-center ">
        <TodayExpenseCard/>
        <FinanceCard />

      </div>
      
      <div className="flex justify-center gap-4 mt-6" style={{width:'95%'}}>
  {/* Analysis */}
  <button style={{width:'50%'}}
    onClick={() => navigate('/insights')}
    className="
      flex items-center gap-1
      rounded-2xl
      px-4 py-4
      bg-emerald-400
      text-black
      font-semibold
      border border-emerald-500
      hover:bg-emerald-500
      transition
    "
  >
    <span>Transactions</span>
    <span className="text-lg">→</span>
  </button>

  {/* Debts */}
  <button style={{width:'50%',display:'flex',justifyContent:'center'}}
    onClick={() => navigate('/debts')}
    className="
      flex items-center gap-1
      rounded-2xl
      px-4 py-4
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
<RecentExpenses/>
    {isScanning && (
      <QRScanner 
        onScanSuccess={handleScanSuccess} 
        onClose={() => setIsScanning(false)} 
      />
    )}
    </div>
    </div>
  
  )
}

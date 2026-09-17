import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBigLeft, Settings as SettingsIcon, QrCode, TrendingUp, CreditCard, Plus, X } from 'lucide-react'
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
import AddMoneyButton from '../components/AddMoneyButton'

const MySwal = withReactContent(Swal)

export default function HomePage() {
   const userId = useContext(UserContext)
  const navigate = useNavigate()

  const [step, setStep] = useState('closed')
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
        
        let initialRemarks = ''
        
        if (pn) {
          setPayeeName(pn)
          initialRemarks = `Paid to ${pn}`
        }
        
        setExpense(prev => ({ 
          ...prev, 
          amount: am || '', 
          remarks: initialRemarks,
          source: 'UPI' // Default source for scanned payments
        }))
        
        setStep('amount')
      } catch (e) {
        console.error('Invalid UPI URL format')
      }
    } else {
      setScannedUpiUrl('scanned-text')
      setExpense(prev => ({ ...prev, remarks: decodedText, source: 'UPI' }))
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

  const handleAmountChange = e => {
    const value = e.target.value.replace(/\D/g, '')
    setExpense(prev => ({ ...prev, amount: value }))
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    setExpense(prev => ({ ...prev, transactionDate: value }))
  }

  const handleCategorySelect = category => {
    setExpense(prev => ({ ...prev, category }))
    if (scannedUpiUrl) {
      setStep('context') // Go to 'Spend with' step, skipping only 'source'
    } else {
      setStep('source')
    }
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

      if (scannedUpiUrl && scannedUpiUrl.startsWith('upi://')) {
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

      setExpense({
        amount: '',
        category: '',
        source: '',
        context: '',
        remarks: '',
        transactionDate: new Date().toISOString().split('T')[0]
      });
      setStep('closed');
      setScannedUpiUrl('');
      setPayeeName('');

    } catch (error) {
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
  const [showSurprise, setShowSurprise] = useState(false)

  useEffect(()=>{
    const getNameTitle=async()=>{
      if(userId.userId){
        const summary = await getFinanceSummary(userId.userId)
        setData(summary)
        setLoading(false)
      }
    };
    getNameTitle()
  },[userId])


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


  const goBack = () => {
    if (step === 'date') {
      setExpense(prev => ({ ...prev, transactionDate: new Date().toISOString().split('T')[0] }));
      setStep('amount');
    } 
    else if (step === 'category') {
      setExpense(prev => ({ ...prev, category: null }));
      setStep(scannedUpiUrl ? 'amount' : 'date');
    } 
    else if (step === 'source') {
      setExpense(prev => ({ ...prev, source: null }));
      setStep('category');
    } 
    else if (step === 'context') {
      setExpense(prev => ({ ...prev, context: null }));
      setStep(scannedUpiUrl ? 'category' : 'source');
    } 
    else if (step === 'remarks') {
      setExpense(prev => ({ ...prev, remarks: '' }));
      setStep('context');
    }
  };

  const closeForm = () => {
    setStep('closed');
    setScannedUpiUrl('');
    setPayeeName('');
    setIsScanning(false);
    setExpense({
      amount: '',
      category: '',
      source: '',
      context: '',
      remarks: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
  }

  const renderExpenseForm = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '200px' }}>
      
      {/* AMOUNT */}
      {step === 'amount' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>Enter Amount</p>
          <input
            autoFocus
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={expense.amount}
            onChange={handleAmountChange}
            placeholder="₹0"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '64px', fontWeight: 'bold', textAlign: 'center', width: '100%', marginBottom: scannedUpiUrl ? '24px' : '32px' }}
          />

          {/* Show inline Date picker only for Scanned payments */}
          {scannedUpiUrl && (
            <div style={{ width: '100%', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Date (Optional)</p>
              <input 
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={expense.transactionDate}
                onChange={handleDateChange}
                style={{ backgroundColor: '#27272a', color: '#fff', padding: '12px 16px', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '14px', textAlign: 'center' }}
              />
            </div>
          )}

          <button
            disabled={!expense.amount}
            onClick={() => setStep(scannedUpiUrl ? 'category' : 'date')}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: expense.amount ? '#10b981' : '#27272a', color: expense.amount ? '#000' : '#71717a', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: expense.amount ? 'pointer' : 'not-allowed' }}
          >
            Continue
          </button>
        </div>
      )}

      {/* DATE (Only for manual flow) */}
      {step === 'date' && !scannedUpiUrl && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>Select Date</p>
          <input 
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={expense.transactionDate}
            onChange={handleDateChange}
            style={{ width: '100%', backgroundColor: '#27272a', color: '#fff', padding: '16px', borderRadius: '16px', border: 'none', outline: 'none', fontSize: '16px', textAlign: 'center', marginBottom: '32px' }}
          />
          <button
            onClick={() => setStep('category')}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#10b981', color: '#000', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      )}

      {/* CATEGORY */}
      {step === 'category' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>₹{expense.amount} spent on</p>
          <div style={{ width: '100%' }}>
            <CategoryChips type="categories" onSelect={handleCategorySelect} />
          </div>
        </div>
      )}

      {/* SOURCE (Skipped for scan flow) */}
      {step === 'source' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>Paid using</p>
          <div style={{ width: '100%' }}>
            <CategoryChips type="sources" onSelect={handleSourceSelect} />
          </div>
        </div>
      )}

      {/* CONTEXT (Skipped if Payee Name is present in QR) */}
      {step === 'context' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>Expense with</p>
          <div style={{ width: '100%' }}>
            <CategoryChips type="contexts" onSelect={handleContextSelect} />
          </div>
        </div>
      )}

      {/* REMARKS */}
      {step === 'remarks' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>Any Remarks?</p>
          <textarea
            value={expense.remarks}
            onChange={e => setExpense(prev => ({ ...prev, remarks: e.target.value }))}
            placeholder="Optional notes..."
            style={{ width: '100%', backgroundColor: '#27272a', color: '#fff', padding: '16px', borderRadius: '16px', border: 'none', outline: 'none', minHeight: '100px', resize: 'none', marginBottom: '24px' }}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: saving ? '#3f3f46' : '#10b981', color: saving ? '#a1a1aa' : '#000', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Adding...' : 'Save Expense'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingBottom: '96px', fontFamily: 'sans-serif' }} className={showSurprise ? 'birthday-mode' : ''}> 
      
      {showSurprise && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="floating-icon"
              style={{
                position: 'absolute',
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
  
      {(showSurprise && !birthday) && (
        <button onClick={()=>setBirthday(true)} style={{ position: 'fixed', top: '150px', right: '30px', zIndex: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/surprise/gift.gif" style={{ width: '60px', height: '55px', borderRadius: '50%' }} alt="Surprise" />
        </button>
      )}

      {loading && <TriangleLoader/>}
      
      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '0 20px' }}>
      
        {/* HEADER */}
        <header style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '24px', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0', background: 'linear-gradient(to right, #fff, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {data?.profile?.name || "Welcome,"}
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
              {data?.profile?.title || "Manage your expenses"}
            </p>
          </div>
          
          <div style={{ position: 'relative', width: '120px', height: '50px' }}>
            <SpendingScore />
          </div>
        </header>
        
        {/* MAIN DASHBOARD CONTENT */}
        <main>
          
          {/* 1. TOP EXPANDABLE CONTAINER (SCANNER OR POST-SCAN FORM) */}
          <div style={{ width: '100%', marginBottom: '24px' }}>
             {isScanning ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] rounded-[32px]">
                  <QRScanner isInline={true} onScanSuccess={handleScanSuccess} onClose={() => setIsScanning(false)} />
                </div>
             ) : (scannedUpiUrl && step !== 'closed') ? (
                <div style={{ backgroundColor: '#18181b', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '32px', padding: '24px', position: 'relative', overflow: 'hidden' }} className="animate-in fade-in slide-in-from-top-4 duration-300 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.2)]">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    {step !== 'amount' ? (
                      <button onClick={goBack} style={{ padding: '8px', backgroundColor: '#27272a', borderRadius: '50%', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <ArrowBigLeft size={20} />
                      </button>
                    ) : (
                      <div style={{ width: '36px', height: '36px' }}></div>
                    )}
                    <h3 style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>Payment Details</h3>
                    <button onClick={closeForm} style={{ padding: '8px', backgroundColor: '#27272a', borderRadius: '50%', border: 'none', color: '#fff', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </div>
                  {renderExpenseForm()}
                </div>
             ) : (
                <button 
                  onClick={() => setIsScanning(true)} 
                  style={{ width: '100%', padding: '20px', backgroundColor: '#18181b', borderRadius: '32px', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2)', transition: 'all 0.2s', outline: 'none' }}
                >
                   <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={32} color="#34d399" />
                   </div>
                   <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.5px' }}>Scan to Pay</span>
                </button>
             )}
          </div>

          {/* 2. QUICK ACTIONS (BENTO GRID) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            
            <AddMoneyButton />

            <button onClick={() => setStep(step === 'closed' ? 'amount' : 'closed')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.3)', cursor: 'pointer', outline: 'none' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                 <Plus size={24} color="#60a5fa" />
              </div>
              <span style={{ fontWeight: '600', fontSize: '13px', color: '#fff' }}>Add Expense</span>
            </button>

            <button onClick={() => navigate('/insights')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.3)', cursor: 'pointer', outline: 'none' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                 <TrendingUp size={24} color="#c084fc" />
              </div>
              <span style={{ fontWeight: '600', fontSize: '13px', color: '#fff' }}>Analysis</span>
            </button>

            <button onClick={() => navigate('/debts')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid rgba(249, 115, 22, 0.3)', cursor: 'pointer', outline: 'none' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                 <CreditCard size={24} color="#fb923c" />
              </div>
              <span style={{ fontWeight: '600', fontSize: '13px', color: '#fff' }}>Debts</span>
            </button>
          </div>

          {/* 3. BALANCE CARD */}
          <div style={{ width: '100%', marginBottom: '24px' }}>
            <FinanceCard />
          </div>

          {/* 4. EXPENSE INPUT FORM (CONDITIONAL FOR MANUAL ENTRY ONLY) */}
          {(!scannedUpiUrl && step !== 'closed') && (
            <div style={{ backgroundColor: '#18181b', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '32px', padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                {step !== 'amount' ? (
                  <button onClick={goBack} style={{ padding: '8px', backgroundColor: '#27272a', borderRadius: '50%', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ArrowBigLeft size={20} />
                  </button>
                ) : (
                  <div style={{ width: '36px', height: '36px' }}></div>
                )}
                <h3 style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>New Expense</h3>
                <button onClick={closeForm} style={{ padding: '8px', backgroundColor: '#27272a', borderRadius: '50%', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              {renderExpenseForm()}
            </div>
          )}

          {/* 5. TODAY'S SPEND */}
          <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <TodayExpenseCard />
          </div>

          {/* 6. RECENT EXPENSES */}
          <div style={{ paddingBottom: '40px' }}>
            <RecentExpenses />
          </div>

        </main>
      </div>

    </div>
  )
}

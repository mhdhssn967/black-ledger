import { useContext, useEffect, useState } from 'react'
import { ArrowRight, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFinanceSummary, getMonthlyBalance } from '../service/getFinanceSummary'
import { UserContext } from '../context/UserContext'
import AddMoneyButton from './AddMoneyButton'

export default function FinanceCard() {
  const navigate = useNavigate()
  const userId = useContext(UserContext)

  const [monthlyBalance, setMonthlyBalance] = useState({ monthlyBalance: 0, monthlyExpenses: 0 })
  const [loading, setLoading] = useState(true)
  
  const [data, setData] = useState({
    salary: 0,
    monthlyExpenses: 0
  })

  useEffect(() => {
    const loadData = async () => {
      if (userId.userId) {
        const summary = await getFinanceSummary(userId.userId)
        setData(summary)

        const monthBalanceRef = await getMonthlyBalance(userId.userId)
        setMonthlyBalance(monthBalanceRef || { monthlyBalance: 0, monthlyExpenses: 0 })

        setLoading(false)
      }
    }
    loadData()
  }, [userId])

  const percentUsed = data.salary > 0
    ? Math.min((monthlyBalance.monthlyExpenses / data.salary) * 100, 100)
    : 0

 return (
  <>
    {loading ? (
      <div 
        style={{ width: '100%', padding: '24px', borderRadius: '24px', marginBottom: '24px', backgroundColor: '#18181b', border: '1px solid #27272a' }}
        className="animate-pulse"
      >
        <div style={{ height: '16px', width: '120px', backgroundColor: '#3f3f46', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '40px', width: '200px', backgroundColor: '#3f3f46', borderRadius: '8px', marginBottom: '32px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ height: '24px', width: '100px', backgroundColor: '#3f3f46', borderRadius: '4px' }} />
          <div style={{ height: '24px', width: '80px', backgroundColor: '#3f3f46', borderRadius: '4px' }} />
        </div>
      </div>
    ) : (
      <div style={{ 
        width: '100%', 
        padding: '16px 20px', 
        borderRadius: '20px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #09090b 0%, #064e3b 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
      
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(16,185,129,0.15)', filter: 'blur(40px)', borderRadius: '50%' }} />
      
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Wallet size={14} color="#a1a1aa" />
              <p style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: 0 }}>
                Available Balance
              </p>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', color: '#fff', margin: '0' }}>
              ₹{monthlyBalance?.monthlyBalance?.toLocaleString()}
            </h2>
          </div>
        </div>
      
        {/* Simplified Stats row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <p style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '2px', margin: 0 }}>Spent this month</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0' }}>
              ₹{monthlyBalance.monthlyExpenses?.toLocaleString()}
              <span style={{ fontSize: '11px', color: '#71717a', fontWeight: 'normal', marginLeft: '6px' }}>
                of ₹{data.salary.toLocaleString()}
              </span>
            </p>
          </div>
          
          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontWeight: '600', fontSize: '12px', background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
            onClick={() => navigate('/expensebreakdown')}
          >
            Analysis <ArrowRight size={14} />
          </button>
        </div>
        
        {/* Simple Progress Bar */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '10px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{ width: `${percentUsed}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '10px' }} />
        </div>
      </div>
    )}
  </>
 )
}

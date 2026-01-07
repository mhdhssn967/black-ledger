// src/pages/Settings.jsx
import { useState, useEffect, useContext } from 'react'
import { Plus, Trash2, User, IndianRupee, ArrowLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { UserContext } from '../context/UserContext'
import { logoutUser } from '../service/services'

export default function Settings() {
  const USER_ID = useContext(UserContext) // 🔥 replace later with auth uid
  const navigate = useNavigate()

  const [data, setData] = useState({
    profile: { name: '', title: '' },
    salary: { amount: '', day: '' },
    categories: [],
    sources: [],
    contexts: []
  })

  const [input, setInput] = useState('')

  /* 🔄 LOAD FROM FIRESTORE */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const ref = doc(db, 'users', USER_ID.userId, 'preferences', 'settings')
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const d = snap.data()

          setData({
            profile: d.profile || { name: 'User', title: 'User Title' },
            salary: d.salary || { amount: '', day: '' },
            categories: Array.isArray(d.categories)
              ? d.categories
              : ['Food', 'Fuel', 'Shopping', 'Travel'],
            sources: Array.isArray(d.sources)
              ? d.sources
              : ['UPI', 'Cash', 'Credit Card'],
            contexts: Array.isArray(d.contexts)
              ? d.contexts
              : ['Myself', 'Family', 'Friends']
          })
        } else {
          const defaults = {
            profile: { name: 'User', title: 'User Title' },
            salary: { amount: '', day: '' },
            categories: ['Food', 'Fuel', 'Shopping', 'Travel'],
            sources: ['UPI', 'Cash', 'Credit Card'],
            contexts: ['Myself', 'Family', 'Friends']
          }
          await setDoc(ref, defaults)
          setData(defaults)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }

    loadSettings()
  }, [])

  /* 💾 SAVE TO FIRESTORE */
  const saveSettings = async updatedData => {
    setData(updatedData)
    const ref = doc(db, 'users', USER_ID.userId, 'preferences', 'settings')
    await setDoc(ref, updatedData)
  }



  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login') // or home page
    } catch (err) {
      alert('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-premium">

      <div style={{display:'flex',justifyContent:'space-between'}}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white " 
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button onClick={handleLogout}><LogOut/></button>
      </div>

      {/* Background */}
      <div >
        
        <span className="text-[30px] font-extrabold text-white/60">
          SETTINGS
        </span>
        
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-10">

        {/* PROFILE */}
        <Section title="Profile" icon={User}>
          <div style={{margin:'8px auto 5px auto'}}><Input
            placeholder="Your name"
            value={data.profile.name}
            onChange={v =>
              saveSettings({
                ...data,
                profile: { ...data.profile, name: v }
              })
            }
          /></div>
          <div style={{margin:'8px auto 5px auto'}}><Input
            placeholder="Title"
            value={data.profile.title}
            onChange={v =>
              saveSettings({
                ...data,
                profile: { ...data.profile, title: v }
              })
            }
          /></div>
        </Section>

        {/* SALARY */}
        <Section title="Salary" icon={IndianRupee}>
          <div style={{margin:'8px auto 5px auto'}}><Input
            type="number"
            placeholder="Monthly salary"
            value={data.salary.amount}
            onChange={v =>
              saveSettings({
                ...data,
                salary: { ...data.salary, amount: v }
              })
            }
          /></div>
         <div style={{margin:'8px auto 5px auto'}}> <select
  value={data.salary.day}
  onChange={e =>
    saveSettings({
      ...data,
      salary: {
        ...data.salary,
        day: Number(e.target.value)
      }
    })
  }
  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 w-full"
>
  <option value="">Salary credit day</option>
  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
    <option key={day} value={day}>
      {day}
    </option>
  ))}
</select>
</div>

        </Section>

       <div className="relative z-10 max-w-xl mx-auto space-y-10"> <ChipSection
          title="Categories"
          items={data.categories}
          setItems={items =>
            saveSettings({ ...data, categories: items })
          }
          input={input}
          setInput={setInput}
        /></div><div>

        <ChipSection
          title="Sources"
          items={data.sources}
          setItems={items =>
            saveSettings({ ...data, sources: items })
          }
          input={input}
          setInput={setInput}
        />

        <ChipSection
          title="Spend Context"
          subtitle="With whom was this expense occured?"
          items={data.contexts}
          setItems={items =>
            saveSettings({ ...data, contexts: items })
          }
          input={input}
          setInput={setInput}
        />
        </div>
      </div>
    </div>
  )
}

/* ---------- REUSABLE COMPONENTS ---------- */

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Icon className="text-emerald-400" size={20} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-zinc-900 rounded-xl px-4 py-3 outline-none"
    />
  )
}

function ChipSection({ title, subtitle, items, setItems, input, setInput }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      {subtitle && (
        <p className="text-sm text-zinc-400 mb-3">
          {subtitle}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {items.map(item => (
          <div
            key={item}
            className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full"
          >
            <span>{item}</span>
            <Trash2
              size={14}
              className="cursor-pointer text-red-400"
              onClick={() =>
                setItems(items.filter(i => i !== item))
              }
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Add ${title}`}
          className="flex-1 bg-zinc-900 rounded-xl px-4 py-2 outline-none"
        />
        <button
          onClick={() => {
            if (!input) return
            setItems([...items, input])
            setInput('')
          }}
          className="bg-emerald-500 text-black px-4 rounded-xl"
        >
          <Plus />
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import DebtPage from './DebtPage'
import ReceivableDebtPage from './ReceivableDebtPage'

export default function MainDebtPage() {
  const [activeTab, setActiveTab] = useState('owedByMe')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TOP SWITCH */}
      <div className="flex justify-center gap-4 px-5 py-4 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('owedByMe')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition
            ${
              activeTab === 'owedByMe'
                ? 'bg-emerald-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
        >
          Owed By Me
        </button>

        <button
          onClick={() => setActiveTab('owedToMe')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition
            ${
              activeTab === 'owedToMe'
                ? 'bg-emerald-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
        >
          Owed To Me
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === 'owedByMe' && <DebtPage />}
        {activeTab === 'owedToMe' && <ReceivableDebtPage />}
      </div>
    </div>
  )
}

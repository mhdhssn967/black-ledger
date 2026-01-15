import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig' // adjust path

function SurpriseModal({ userId,setShowSurprise }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const stages = [
    {
      text: 'Hi Kanmani.',
      gif: '/surprise/hi.gif'
    },
    {
      text: 'I have done your updates my love.\nIf you need anything more, just tell me.',
      gif: '/surprise/love.gif'
    },
    {
      text: 'I love you babe 😘',
      gif: '/surprise/loveu.gif'
    },
    {
      text: 'Ok bye, see you.',
      gif: '/surprise/bye.gif'
    }
  ]

  const handleDone = async () => {
    setLoading(true)
    try {
      const ref = doc(
        db,
        'users',
        userId,
        'preferences',
        'settings'
      )

      await updateDoc(ref, {
        surprise: false
      })
      setShowSurprise(false)
    } catch (err) {
      console.error('Failed to update surprise', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#fcfcf9] rounded-3xl p-6 w-full max-w-sm border border-zinc-800 text-center"  style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>

        {/* GIF */}
        <img
          src={stages[step].gif}
          alt="surprise"
          className="w-48 h-48 mx-auto mb-6 object-contain"
        />

        {/* Text */}
        <p className="text-black text-lg font-medium whitespace-pre-line mb-8" style={{marginBottom:'20px'}}>
          {stages[step].text}
        </p>

        {/* Actions */}
        {step < stages.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-emerald-500 text-black py-3 rounded-xl font-semibold transition hover:bg-emerald-400"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleDone}
            disabled={loading}
            className={`
              w-full py-3 rounded-xl font-semibold transition
              ${loading
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-emerald-500 text-black hover:bg-emerald-400'}
            `}
          >
            {loading ? 'Closing...' : 'Done ❤️'}
          </button>
        )}
      </div>
    </div>
  )
}

export default SurpriseModal

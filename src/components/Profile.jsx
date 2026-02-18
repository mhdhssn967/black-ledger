import React, { useEffect, useState } from 'react'
import { getFinanceSummary } from '../service/getFinanceSummary'
import { User, TrendingUp } from 'lucide-react'
import TriangleLoader from '../components/TriangleLoader'
import SpendingScore from './SpendingScore'

const Profile = ({ userId }) => {

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfileData = async () => {
      if (userId?.userId) {
        const summary = await getFinanceSummary(userId.userId)
        setData(summary)
        setLoading(false)
      }
    }
    getProfileData()
  }, [userId])

  const name = data?.profile?.name || "User"
  const title = data?.profile?.title || "Managing Finances"

  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()

  if (loading) return <TriangleLoader />

  return (
    <div className="relative w-full px-5 pt-6 pb-4">
        

      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
      

      <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-3" >
      <div style={{alignItems:'end',display:'flex',flexDirection:'column'}}>
        <SpendingScore/>
      </div>

        {/* Avatar */}
        <div className='flex gap-2'>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-2xl shadow-lg">
                
              {initials || <User />}
            </div>
            
            {/* Info Section */}
            <div className="flex flex-col">
            
              <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                {name}
              </h2>
            
              <p className="text-sm text-zinc-400 italic tracking-tight">
                {title}
              </p>
            
              {/* Mini Financial Badge */}
              
            
            </div>
        </div>

      </div>
    </div>
  )
}

export default Profile

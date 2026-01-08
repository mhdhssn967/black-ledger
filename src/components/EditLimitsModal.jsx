import { useState } from "react"

export default function EditLimitsModal({
  isOpen,
  onClose,
  limits,
  setLimits,
  onSave,
  dailySpend,
  weeklySpend,
  monthlySpend,
  salary
}) {
  if (!isOpen) return null

 const [editLimits,setEditLimits]=useState(false)
 
  const getPercent = (spent, limit) =>
    limit ? Math.min((spent / limit) * 100, 100) : 0

  const getColor = percent => {
    if (percent < 70) return 'bg-emerald-500'
    if (percent < 90) return 'bg-yellow-400'
    return 'bg-red-500'
  }
  const ProgressBar = ({ spent, limit }) => {
     

    const percent = getPercent(spent, limit)
    return (
      <>
        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
          <span>₹{spent}</span>
          <span>₹{limit}</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor(percent)}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center ">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-80 modal-custom">

        <h3 className="text-sm font-semibold mb-4 text-zinc-200">
          Spending Limits
        </h3>

        {/* LIMIT INPUTS */}
       

        {/* ANALYTICS */}
        <div className="mt-5 space-y-4">

          <div style={{marginBottom:'10px'}}>
            <p className="text-xs text-zinc-400 mb-1" >Today</p>
            <ProgressBar spent={dailySpend} limit={limits.daily} />
          </div>

          <div style={{marginBottom:'10px'}}>
            <p className="text-xs text-zinc-400 mb-1">This Week</p>
            <ProgressBar spent={weeklySpend} limit={limits.weekly} />
          </div>

          <div style={{marginBottom:'10px'}}>
            <p className="text-xs text-zinc-400 mb-1">This Month</p>
            <ProgressBar spent={monthlySpend} limit={limits.monthly} />
          </div>

          {/* SALARY UTILIZATION */}
          <div className="pt-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-400 mb-1">
              Salary Usage
            </p>
            <ProgressBar spent={monthlySpend} limit={salary} />
          </div>

        </div>
             {!editLimits&&<div className="flex justify-end gap-5">   <button className="bg-zinc-300 text-black text-xs px-3 py-1.5 rounded-lg" style={{marginTop:'10px'}} onClick={onClose}>Close</button>

        <button onClick={()=>setEditLimits(!editLimits)} className="bg-emerald-500 text-black text-xs px-3 py-1.5 rounded-lg" style={{marginTop:'10px'}}>Edit Limits</button>
        </div>}

       {editLimits&&<div>
          {['daily', 'weekly', 'monthly'].map(type => (
           <div key={type} className="mb-3" >
             <label className="text-xs text-zinc-400 capitalize">
               {type} limit
             </label>
             <input
               type="number"
               value={limits[type]}
               onChange={e =>
                 setLimits({
                   ...limits,
                   [type]: Number(e.target.value)
                 })
               }
               className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
             />
           </div>
         ))}
       

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5" style={{marginTop:'10px'}}>
          <button
            onClick={()=>setEditLimits(!editLimits)}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-emerald-500 text-black text-xs px-3 py-1.5 rounded-lg"
          >
            Save
          </button>
        </div>
        </div>}

      </div>
    </div>
  )
}

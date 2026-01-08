export default function EditLimitsModal({
  isOpen,
  onClose,
  limits,
  setLimits,
  onSave
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-80">
        <h3 className="text-sm font-semibold mb-4 text-zinc-200">
          Spending Limits
        </h3>

        {['daily', 'weekly', 'monthly'].map(type => (
          <div key={type} className="mb-3">
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

        <div className="flex justify-end gap-2 mt-4" style={{marginTop:'10px'}}>
          <button
            onClick={onClose}
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
      </div>
    </div>
  )
}

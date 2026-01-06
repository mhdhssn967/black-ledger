import { useContext, useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { UserContext } from '../context/UserContext'

export default function CategoryChips({ onSelect, type = 'categories' }) {
  const [items, setItems] = useState([])
  console.log(items);
  

  const user_id=useContext(UserContext)

  useEffect(() => {
    // 🔁 replace userId with auth later
    const fetchData = async () => {
      if(user_id.userId){const ref = doc(db, 'users', user_id.userId, 'preferences','settings')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setItems(snap.data()[type] || [])
      }}
    }
    fetchData()
  }, [type,user_id])

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-emerald-500 hover:text-black transition"
        >
          {item}
        </button>
      ))}
    </div>
  )
}

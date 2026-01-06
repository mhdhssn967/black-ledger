import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../../firebaseConfig'

const USER_ID = 'demoUser' // later replace with auth uid

/* ➕ ADD DEBT */
export const saveDebt = async (debt,USER_ID) => {
  console.log(USER_ID);
  
  await addDoc(
    collection(db, 'users', USER_ID, 'debts'),
    {
      amount: Number(debt.amount),
      owedTo: debt.owedTo,
      dueDate: debt.dueDate,
      status: 'pending',
      createdAt: serverTimestamp()
    }
  )
}

/* 📥 FETCH ONLY PENDING DEBTS */
export const fetchPendingDebts = async (USER_ID) => {
  const q = query(
    collection(db, 'users', USER_ID, 'debts'),
    where('status', '==', 'pending')
  )

  const snap = await getDocs(q)

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

/* ✅ MARK AS CLEARED */
export const clearDebt = async (debtId,USER_ID) => {
  await updateDoc(
    doc(db, 'users', USER_ID, 'debts', debtId),
    {
      status: 'cleared'
    }
  )
}

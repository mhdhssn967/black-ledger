import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy
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


export const saveReceivable = async (receivable, USER_ID) => {
  await addDoc(
    collection(db, 'users', USER_ID, 'receivables'),
    {
      amount: Number(receivable.amount),
      owedBy: receivable.owedBy,
      dueDate: receivable.dueDate,
      status: 'pending',
      createdAt: serverTimestamp()
    }
  )
}


export const fetchPendingReceivables = async USER_ID => {
  const q = query(
    collection(db, 'users', USER_ID, 'receivables'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const clearReceivable = async (receivableId, USER_ID) => {
  const ref = doc(
    db,
    'users',
    USER_ID,
    'receivables',
    receivableId
  )

  await updateDoc(ref, {
    status: 'cleared'
  })
}
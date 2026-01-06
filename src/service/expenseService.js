import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../../firebaseConfig'


// Fetch expenses (latest first)
export const fetchExpenses = async (userId) => {

  const q = query(
    collection(db, 'users', userId, 'expenses'),
    orderBy('createdAt', 'desc')
  )

  const snap = await getDocs(q)

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Delete expense
export const deleteExpense = async (id,userId) => {
  await deleteDoc(doc(db, 'users', userId, 'expenses', id))
}

// Update expense
export const updateExpense = async (id, data,userId) => {
  await updateDoc(
    doc(db, 'users', userId, 'expenses', id),
    data
  )
}

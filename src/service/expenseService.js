import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,where,Timestamp
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


// currentmonth expense

// Fetch current month's expenses only
export const fetchCurrentMonthExpenses = async (userId) => {
  const now = new Date()

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0
  )

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  )

  const q = query(
    collection(db, 'users', userId, 'expenses'),
    where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
    where('createdAt', '<=', Timestamp.fromDate(endOfMonth)),
    orderBy('createdAt', 'desc')
  )

  const snap = await getDocs(q)

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// spendig summary of rdaily,weekly and onthly
export const calculateSpendSummary = (expenses) => {
  let today = 0
  let weekly = 0
  let monthly = 0

  const now = new Date()

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  // Monday as start of week
  const startOfWeek = new Date(startOfToday)
  const day = startOfWeek.getDay() || 7
  startOfWeek.setDate(startOfWeek.getDate() - day + 1)

  expenses.forEach(exp => {
    const amount = Number(exp.amount || 0)
    const date = exp.createdAt?.toDate?.()

    if (!date) return

    monthly += amount

    if (date >= startOfWeek) {
      weekly += amount
    }

    if (date >= startOfToday) {
      today += amount
    }
  })

  return {
    today,
    weekly,
    monthly
  }
}

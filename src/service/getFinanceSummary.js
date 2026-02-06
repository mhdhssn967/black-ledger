import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from '../../firebaseConfig'


export const getFinanceSummary = async (userId) => {
  if (!userId) throw new Error('User ID is required')

  /* 1️⃣ FETCH USER SETTINGS */
  const prefRef = doc(db, 'users', userId, 'preferences', 'settings')
  const prefSnap = await getDoc(prefRef)

  let salary = 0
  let profile = { name: 'User', title: 'User Title' }

  if (prefSnap.exists()) {
    const data = prefSnap.data()
    salary = Number(data.salary?.amount || 0)
    profile = {
      name: data.profile?.name || 'User',
      title: data.profile?.title || 'User Title'
    }
  }

  /* 2️⃣ FETCH EXPENSES */
  const expensesRef = collection(db, 'users', userId, 'expenses')
  const expenseSnap = await getDocs(expensesRef)

  let totalExpenses = 0
  expenseSnap.forEach(doc => {
    totalExpenses += Number(doc.data().amount || 0)
  })

  /* 3️⃣ FETCH MONEY GOT (CREDITS) */
  const creditsRef = collection(db, 'users', userId, 'credits')
  const creditSnap = await getDocs(creditsRef)

  let totalCredits = 0
  creditSnap.forEach(doc => {
    totalCredits += Number(doc.data().amount || 0)
  })

  /* 4️⃣ CALCULATE BALANCE */
  const balance = salary - totalExpenses + totalCredits

  /* 5️⃣ RETURN SUMMARY */
  return {
    profile,
    salary,
    totalExpenses,
    totalCredits,
    balance
  }
}



// src/service/financeService.js


export const getMonthlyBalance = async (userId) => {
  if (!userId) throw new Error('User ID is required')

  /* 1️⃣ FETCH SALARY */
  const prefRef = doc(db, 'users', userId, 'preferences', 'settings')
  const prefSnap = await getDoc(prefRef)

  let salary = 0

  if (prefSnap.exists()) {
    const data = prefSnap.data()
    salary = Number(data.salary?.amount || 0)
  }

  /* 2️⃣ CURRENT MONTH RANGE */
  const now = new Date()

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  )

  const startTimestamp = Timestamp.fromDate(startOfMonth)
  const endTimestamp = Timestamp.fromDate(endOfMonth)

  /* 3️⃣ FETCH CURRENT MONTH EXPENSES */
  const expensesRef = collection(db, 'users', userId, 'expenses')
  const expensesQuery = query(
    expensesRef,
    where('createdAt', '>=', startTimestamp),
    where('createdAt', '<=', endTimestamp)
  )

  const expenseSnap = await getDocs(expensesQuery)

  let monthlyExpenses = 0
  expenseSnap.forEach(doc => {
    monthlyExpenses += Number(doc.data().amount || 0)
  })

  /* 4️⃣ FETCH CURRENT MONTH CREDITS */
  const creditsRef = collection(db, 'users', userId, 'credits')
  const creditsQuery = query(
    creditsRef,
    where('createdAt', '>=', startTimestamp),
    where('createdAt', '<=', endTimestamp)
  )

  const creditSnap = await getDocs(creditsQuery)

  let monthlyCredits = 0
  creditSnap.forEach(doc => {
    monthlyCredits += Number(doc.data().amount || 0)
  })

  /* 5️⃣ CALCULATE MONTHLY BALANCE */
  const monthlyBalance = salary - monthlyExpenses + monthlyCredits

  /* 6️⃣ RETURN SUMMARY */
  return {
    salary,
    monthlyExpenses,
    monthlyCredits,
    monthlyBalance,
    month: now.getMonth() + 1,
    year: now.getFullYear()
  }
}

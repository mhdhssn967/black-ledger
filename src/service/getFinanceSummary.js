// src/service/financeService.js
import {
  doc,
  getDoc,
  collection,
  getDocs
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

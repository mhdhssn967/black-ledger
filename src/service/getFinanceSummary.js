// src/service/financeService.js
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export const getFinanceSummary = async (userId) => {
  if (!userId) throw new Error('User ID is required')

  // 1️⃣ Fetch user preferences/settings
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

  // 2️⃣ Fetch expenses
  const expensesRef = collection(db, 'users', userId, 'expenses')
  const expenseSnap = await getDocs(expensesRef)

  let totalExpenses = 0
  expenseSnap.forEach(doc => {
    totalExpenses += Number(doc.data().amount || 0)
  })

  // 3️⃣ Calculate balance
  const balance = salary - totalExpenses

  // 4️⃣ Return everything
  return {
    profile,
    salary,
    totalExpenses,
    balance
  }
}

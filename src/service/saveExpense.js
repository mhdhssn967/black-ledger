import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export const saveExpense = async (expense,user_id) => {
  const now = new Date()

  await addDoc(
    collection(db, 'users', user_id, 'expenses'),
    {
      amount: Number(expense.amount),
      category: expense.category,
      source: expense.source,
      context: expense.context,
      remarks: expense.remarks || '',
      createdAt: serverTimestamp(),
      year: now.getFullYear()
    }
  )

}

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebaseConfig'


import { 
  getDocs, 
  writeBatch 
} from 'firebase/firestore'


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
      transactionDate:expense.transactionDate,
      createdAt: serverTimestamp(),
      year: now.getFullYear()
    }
  )

}




export const addTransactionDateToExistingExpenses = async (user_id) => {
  try {
    const expensesRef = collection(db, 'users', user_id, 'expenses')
    const snapshot = await getDocs(expensesRef)

    const batch = writeBatch(db)

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()

      if (data.createdAt && !data.transactionDate) {
        const createdDate = data.createdAt.toDate()

        // Convert to YYYY-MM-DD
        const formattedDate = createdDate.toISOString().split('T')[0]

        batch.update(docSnap.ref, {
          transactionDate: formattedDate
        })
      }
    })

    await batch.commit()

    console.log('Migration completed successfully ✅')
  } catch (error) {
    console.error('Migration failed ❌', error)
  }
}

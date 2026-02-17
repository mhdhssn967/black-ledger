import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig" // adjust if needed

export const fetchFilteredExpenses = async (
  userId,
  field,      // "category" | "source" | "context"
  value       // "Food" | "Credit Card" | etc
) => {

  const q = query(
    collection(db, "users", userId, "expenses"),
    where(field, "==", value),
    orderBy("transactionDate", "desc")
  )

  const snap = await getDocs(q)

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

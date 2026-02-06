import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export const fetchCredits = async (userId) => {
  if (!userId) return []

  const ref = collection(db, 'users', userId, 'credits')
  const snap = await getDocs(ref)

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const deleteCredit = async (creditId, userId) => {
  const ref = doc(db, 'users', userId, 'credits', creditId)
  await deleteDoc(ref)
}

export const updateCredit = async (creditId, data, userId) => {
  const ref = doc(db, 'users', userId, 'credits', creditId)
  await updateDoc(ref, data)
}

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export const fetchLimits = async userId => {
  const ref = doc(db, 'users', userId, 'settings', 'spendingLimits')
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    const defaults = {
      daily: 500,
      weekly: 3500,
      monthly: 15000
    }
    await setDoc(ref, defaults)
    return defaults
  }

  return snap.data()
}

export const saveLimits = async (userId, limits) => {
  const ref = doc(db, 'users', userId, 'settings', 'spendingLimits')
  await setDoc(ref, limits, { merge: true })
}

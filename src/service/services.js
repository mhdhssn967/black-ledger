import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig' // adjust path if needed


export const logoutUser = async () => {
  try {
    await signOut(auth)        // 🔐 Firebase logout
    localStorage.removeItem('userId') // 🧹 App cleanup
  } catch (err) {
    console.error('Logout failed:', err)
  }
}




/**
 * Checks if surprise is active for a user
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const checkSurprise = async (userId) => {

  if (!userId) return false

  try {
    const ref = doc(
      db,
      'users',
      userId,
      'preferences',
      'settings'
    )
    const snap = await getDoc(ref)

    if (snap.exists()) {
      return snap.data()?.surprise === true
    }

    return false
  } catch (error) {
    console.error('Error checking surprise:', error)
    return false
  }
}

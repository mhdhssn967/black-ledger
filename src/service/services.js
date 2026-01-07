import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

export const logoutUser = async () => {
  try {
    await signOut(auth)        // 🔐 Firebase logout
    localStorage.removeItem('userId') // 🧹 App cleanup
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

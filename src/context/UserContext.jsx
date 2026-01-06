// src/context/UserContext.jsx
import { createContext, useState, useEffect } from 'react'
import { auth } from '../../firebaseConfig'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // fetch userId from localStorage if exists
    const storedId = localStorage.getItem('userId')
    if (storedId) setUserId(storedId)

    // optional: listen to auth changes if using Firebase Auth
    // auth.onAuthStateChanged(user => setUserId(user?.uid || null))
  }, [])

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}

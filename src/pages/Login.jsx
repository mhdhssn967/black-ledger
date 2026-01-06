import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { auth } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate=useNavigate()

  const handleLogin = async () => {
  if (!email || !password) return

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('Logged in user:', user)

    // Save user ID to state, context, or localStorage
    localStorage.setItem('userId', user.uid)

    // Redirect to homepage
    navigate('/')
  } catch (error) {
    console.error('Login failed:', error.message)
    alert(error.message) // optional: show error to user
  }
}


  const handleGoogleLogin = () => {
    // Google auth later
    console.log('Google login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      {/* Card */}
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-400">
            Login to manage your expenses
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Email</label>
          <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4 py-2 border border-zinc-700 focus-within:border-emerald-500">
            <Mail size={16} className="text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-transparent outline-none text-white w-full text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Password</label>
          <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4 py-2 border border-zinc-700 focus-within:border-emerald-500">
            <Lock size={16} className="text-zinc-400" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent outline-none text-white w-full text-sm"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium py-2.5 rounded-xl transition" style={{marginTop:'15px',marginBottom:'10px'}}
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-400">OR</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-2.5 rounded-xl transition"
        >
          {/* Google Icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.4H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.6z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.2 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-1.7 1.3-3.9 2.1-7.3 2.1-5.2 0-9.6-3.5-11.2-8.3l-6.5 5c3.2 6.3 9.9 10.6 17.7 10.6z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.4H42V20H24v8h11.3c-1.1 3.1-3.5 5.6-6.3 7.3l6.2 5.2C38.8 37.5 44 31.5 44 24c0-1.3-.1-2.7-.4-3.6z"
            />
          </svg>

          Continue with Google
        </button>

      </div>
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Settings from './pages/Settings'
import Insights from './pages/Insights'
import ExpenseBreakdown from './pages/ExpenseBreakDown'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ExpenseCharts from './pages/ExpenseCharts'
import MainDebtPage from './pages/MainDebtPage'

function App() {
  const userId = localStorage.getItem('userId')

  return (
    <Routes>

      {/* 🔐 LOGIN */}
      <Route
        path="/login"
        element={
          userId ? <Navigate to="/" replace /> : <Login />
        }
      />

      {/* 🏠 PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />

      <Route
        path="/debts"
        element={
          <ProtectedRoute>
            <MainDebtPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expensebreakdown"
        element={
          <ProtectedRoute>
            <ExpenseBreakdown />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expensebreakdowncharts"
        element={
          <ProtectedRoute>
            <ExpenseCharts />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App

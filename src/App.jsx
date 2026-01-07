import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Settings from './pages/Settings'
import Insights from './pages/Insights'
import DebtPage from './pages/DebtPage'
import ExpenseBreakdown from './pages/ExpenseBreakDown'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ExpenseBreakdownCharts from './pages/ExpenseBreakDownCHarts'

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
            <DebtPage />
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
            <ExpenseBreakdownCharts />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App

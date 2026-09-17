import { SettingsIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../pages/HomePage.css'

const NavBar = () => {
    const navigate=useNavigate()
  return (
    <div style={{ backgroundColor: '#000' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 24px', alignItems: 'center', maxWidth: '32rem', margin: '0 auto' }}>
          <img src="/logo.png" alt="Black Ledger Logo" style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
          <button
            onClick={() => navigate('/settings')}
            style={{ color: '#fff', cursor: 'pointer', background: 'none', border: 'none', padding: '8px' }}
          >
            <SettingsIcon size={24} />
          </button>
      </div>
    </div>
  )
}

export default NavBar

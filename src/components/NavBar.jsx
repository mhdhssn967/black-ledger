import { SettingsIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../pages/HomePage.css'

const NavBar = () => {
    const navigate=useNavigate()
  return (
    <div>
      <div className='nav'>
              <img src="/logo.png" alt="" />
                {/* ⚙ SETTINGS */}
                <button
                  onClick={() => navigate('/settings')}
                  className="hover:text-white transition text-white"
                >
                  <SettingsIcon size={22} />
                </button>
            </ div>
    </div>
  )
}

export default NavBar

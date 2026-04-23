import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sessionQuit } from '../api'

function Navbar({ role, setRole, onSessionData, setStaffInfo }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : ''

  const handleQuit = async () => {
    const data = await sessionQuit()
    if (onSessionData) onSessionData(data)
    setRole('none')
    if (setStaffInfo) setStaffInfo(null)
    navigate('/')
  }

  const isStaff = role === 'staff' || role === 'admin'

  return (
    <div className="navbar">
      <Link to="/" className="brand">CAMPUS CAFE</Link>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        {role === 'customer' && (
          <>
            <Link to="/menu" className={isActive('/menu')}>Menu</Link>
            <Link to="/cart" className={isActive('/cart')}>Cart</Link>
          </>
        )}
        {!isStaff && <Link to="/staff/login" className={isActive('/staff/login')}>Staff</Link>}
        {isStaff && (
          <>
            <Link to="/staff/dashboard" className={
              location.pathname === '/staff/dashboard' || location.pathname === '/staff/management' ? 'active' : ''
            }>Staff</Link>
            <Link to="/staff/settings" className={location.pathname === '/staff/settings' ? 'active' : ''}>Settings</Link>
            <button className="nav-quit-btn" onClick={handleQuit}>Quit</button>
          </>
        )}
      </nav>
    </div>
  )
}

export default Navbar

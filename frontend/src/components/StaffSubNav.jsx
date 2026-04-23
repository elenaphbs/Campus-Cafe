import { Link, useLocation } from 'react-router-dom'

function StaffSubNav({ isAdmin }) {
  const location = useLocation()

  return (
    <div className="staff-subnav">
      <Link
        to="/staff/dashboard"
        className={location.pathname === '/staff/dashboard' ? 'active' : ''}
      >
        Inventory Management
      </Link>
      {isAdmin && (
        <Link
          to="/staff/management"
          className={location.pathname === '/staff/management' ? 'active' : ''}
        >
          Staff Management
        </Link>
      )}
    </div>
  )
}

export default StaffSubNav

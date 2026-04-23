import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { staffLogin } from '../api'

function StaffLoginPage({ setRole, setStaffInfo }) {
  const navigate = useNavigate()
  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const result = await staffLogin(staffId, password)
    if (result.success) {
      setStaffInfo({ staff_id: result.staff_id, name: result.name, is_administrator: result.is_administrator })
      setRole(result.is_administrator ? 'admin' : 'staff')
      navigate('/staff/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="page">
      <div className="login-form">
        <h2>Staff Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Staff ID</label>
          <input
            type="text"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Enter your staff ID"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {error && <div className="message error">{error}</div>}
          <div className="btn-row">
            <button type="submit" className="btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StaffLoginPage

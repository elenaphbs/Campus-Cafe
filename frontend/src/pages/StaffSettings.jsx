import { useState } from 'react'
import { resetStaffPhone, resetStaffPassword } from '../api'

function StaffSettings({ staffInfo }) {
  const [phone, setPhone] = useState('')
  const [phoneMsg, setPhoneMsg] = useState(null)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null)

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setPhoneMsg(null)
    const num = parseInt(phone)
    if (!num || num <= 0) {
      setPhoneMsg({ success: false, message: 'Please enter a valid telephone number.' })
      return
    }
    const result = await resetStaffPhone(staffInfo.staff_id, num)
    setPhoneMsg(result)
    if (result.success) setPhone('')
  }

  const handlePwdSubmit = async (e) => {
    e.preventDefault()
    setPwdMsg(null)
    if (!newPwd) {
      setPwdMsg({ success: false, message: 'Please enter a new password.' })
      return
    }
    const result = await resetStaffPassword(staffInfo.staff_id, newPwd)
    setPwdMsg(result)
    if (result.success) { setOldPwd(''); setNewPwd('') }
  }

  if (!staffInfo) {
    return <div className="page"><h2>Please log in first.</h2></div>
  }

  return (
    <div className="page">
      <h2>Settings</h2>
      <p style={{ color: 'var(--gray)', marginBottom: 20 }}>
        Logged in as: {staffInfo.name} (ID: {staffInfo.staff_id})
      </p>

      {/* Reset Telephone */}
      <div className="settings-card">
        <h3>Reset Telephone Number</h3>
        <form onSubmit={handlePhoneSubmit}>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter new telephone number"
          />
          {phoneMsg && (
            <div className={`message ${phoneMsg.success ? 'success' : 'error'}`}>{phoneMsg.message}</div>
          )}
          <button type="submit" className="btn-primary">Update Phone</button>
        </form>
      </div>

      {/* Reset Password */}
      <div className="settings-card">
        <h3>Reset Password</h3>
        <ul className="pwd-rules">
          <li>At least 10 characters</li>
          <li>At least one uppercase letter</li>
          <li>At least one digit</li>
        </ul>
        <form onSubmit={handlePwdSubmit}>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Enter new password"
          />
          {pwdMsg && (
            <div className={`message ${pwdMsg.success ? 'success' : 'error'}`}>{pwdMsg.message}</div>
          )}
          <button type="submit" className="btn-primary">Update Password</button>
        </form>
      </div>
    </div>
  )
}

export default StaffSettings

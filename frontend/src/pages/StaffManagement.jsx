import { useState, useEffect } from 'react'
import { fetchStaffs, changeStaffPermission, addStaff, deleteStaff } from '../api'
import StaffSubNav from '../components/StaffSubNav'

function StaffManagement() {
  const [staffList, setStaffList] = useState([])
  const [msg, setMsg] = useState(null)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [addMsg, setAddMsg] = useState(null)

  const loadStaffs = async () => {
    const data = await fetchStaffs()
    setStaffList(data.staffs || [])
  }

  useEffect(() => { loadStaffs() }, [])

  const showMsg = (result) => {
    setMsg(result)
    setTimeout(() => setMsg(null), 3000)
  }

  const handlePermission = async (staffId) => {
    const result = await changeStaffPermission(staffId)
    showMsg(result)
    if (result.success) loadStaffs()
  }

  const handleDelete = async (staffId, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return
    const result = await deleteStaff(staffId)
    showMsg(result)
    if (result.success) loadStaffs()
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setAddMsg(null)
    const phoneNum = parseInt(newPhone)
    if (!newName.trim()) {
      setAddMsg({ success: false, message: 'Please enter a name.' })
      return
    }
    if (!phoneNum || phoneNum <= 0) {
      setAddMsg({ success: false, message: 'Please enter a valid telephone number.' })
      return
    }
    const result = await addStaff(newName.trim(), phoneNum)
    setAddMsg(result)
    setTimeout(() => setAddMsg(null), 3000)
    if (result.success) {
      setNewName('')
      setNewPhone('')
      loadStaffs()
    }
  }

  return (
    <div className="page">
      <StaffSubNav isAdmin={true} />

      {msg && (
        <div className={`message ${msg.success ? 'success' : 'error'}`}>{msg.message}</div>
      )}

      {/* Add Staff Form - same style as restock form */}
      <div className="restock-form">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Staff name"
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14, width: 160 }}
          />
        </div>
        <div className="field">
          <label>Telephone</label>
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Phone number"
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14, width: 160 }}
          />
        </div>
        <button className="btn-success" onClick={handleAdd}>
          Add Staff
        </button>
      </div>

      {addMsg && (
        <div className={`message ${addMsg.success ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>{addMsg.message}</div>
      )}

      {/* Staff List Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Staff ID</th>
            <th>Name</th>
            <th>Telephone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(staff => (
            <tr key={staff.staff_id}>
              <td>{staff.staff_id}</td>
              <td>{staff.name}</td>
              <td>{staff.telephone}</td>
              <td>
                <span className={`role-badge ${staff.is_administrator ? 'admin' : 'regular'}`}>
                  {staff.is_administrator ? 'Admin' : 'Staff'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn-small"
                    onClick={() => handlePermission(staff.staff_id)}
                  >
                    {staff.is_administrator ? 'Demote' : 'Promote'}
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(staff.staff_id, staff.name)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StaffManagement

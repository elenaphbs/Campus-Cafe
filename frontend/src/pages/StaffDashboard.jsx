import { useState, useEffect } from 'react'
import { fetchInventory, restockItem } from '../api'
import StaffSubNav from '../components/StaffSubNav'

function StaffDashboard({ role }) {
  const [inventory, setInventory] = useState([])
  const [restockName, setRestockName] = useState('')
  const [restockAmount, setRestockAmount] = useState(0)
  const [msg, setMsg] = useState(null)

  const loadInventory = () => {
    fetchInventory().then(data => setInventory(data.items || []))
  }

  useEffect(() => { loadInventory() }, [])

  const handleRestock = async () => {
    if (!restockName || restockAmount <= 0) return
    const result = await restockItem(restockName, restockAmount)
    setMsg(result)
    setTimeout(() => setMsg(null), 3000)
    if (result.success) {
      loadInventory()
      setRestockName('')
      setRestockAmount(0)
    }
  }

  return (
    <div className="page">
      <StaffSubNav isAdmin={role === 'admin'} />

      {msg && (
        <div className={`message ${msg.success ? 'success' : 'error'}`}>
          {msg.message}
        </div>
      )}

      <div className="restock-form">
        <div className="field">
          <label>Item Name</label>
          <select
            value={restockName}
            onChange={(e) => setRestockName(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
          >
            <option value="">Select item...</option>
            {inventory.map(item => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Amount</label>
          <input
            type="number"
            min="0"
            value={restockAmount}
            onChange={(e) => setRestockAmount(Math.max(0, parseInt(e.target.value) || 0))}
            onFocus={(e) => e.target.select()}
            style={{ width: 80 }}
          />
        </div>
        <button className="btn-success" onClick={handleRestock}>
          Restock
        </button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td style={{ color: item.quantity <= 5 ? '#d9534f' : 'inherit', fontWeight: item.quantity <= 5 ? 700 : 400 }}>
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StaffDashboard

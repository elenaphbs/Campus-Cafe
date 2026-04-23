import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import StaffLoginPage from './pages/StaffLoginPage'
import StaffDashboard from './pages/StaffDashboard'
import StaffSettings from './pages/StaffSettings'
import StaffManagement from './pages/StaffManagement'
import './App.css'

function App() {
  // "none" | "customer" | "staff" | "admin"
  const [role, setRole] = useState('none')
  const [staffInfo, setStaffInfo] = useState(null) // { staff_id, name, is_administrator }
  const [sessionData, setSessionData] = useState(null)

  return (
    <>
      <Navbar role={role} setRole={setRole} onSessionData={setSessionData} setStaffInfo={setStaffInfo} />
      <Routes>
        <Route path="/" element={<HomePage setRole={setRole} />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/staff/login" element={<StaffLoginPage setRole={setRole} setStaffInfo={setStaffInfo} />} />
        <Route path="/staff/dashboard" element={<StaffDashboard role={role} />} />
        <Route path="/staff/settings" element={<StaffSettings staffInfo={staffInfo} />} />
        <Route path="/staff/management" element={<StaffManagement />} />
      </Routes>

      {/* Session Summary Modal */}
      {sessionData && (
        <div className="session-overlay" onClick={() => setSessionData(null)}>
          <div className="session-modal" onClick={(e) => e.stopPropagation()}>
            <h2>CAMPUS CAFE</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: 20 }}>Session Summary</p>

            {sessionData.orders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>No orders in this session.</p>
            ) : (
              sessionData.orders.map(order => (
                <div key={order.order_id} className="order-card">
                  <div className="order-card-header">
                    <span>Order #{order.order_id + 1}</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  {order.receipt_items && order.receipt_items.map(item => (
                    <div key={item.name} className="order-card-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ))
            )}

            <div className="session-total">
              <div className="summary-row">
                <span>Total Orders</span>
                <span>{sessionData.order_count}</span>
              </div>
              <div className="summary-row highlight">
                <span>Total Revenue</span>
                <span>${sessionData.total_revenue.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button className="btn-primary" onClick={() => setSessionData(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App

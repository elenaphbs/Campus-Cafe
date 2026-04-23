import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkout, lookupCustomer } from '../api'

function CheckoutPage() {
  const navigate = useNavigate()
  const [telephone, setTelephone] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState(null)
  const [customerInfo, setCustomerInfo] = useState(null) // null = not looked up, { found, points, ... }

  useEffect(() => {
    if (receipt) {
      const timer = setTimeout(() => navigate('/'), 8000)
      return () => clearTimeout(timer)
    }
  }, [receipt, navigate])

  const handleEarn = async () => {
    setError(null)
    const num = parseInt(telephone)
    if (!num || num <= 0) {
      setError('Please enter a valid telephone number.')
      return
    }
    const result = await lookupCustomer(num)
    setCustomerInfo(result)
  }

  const handlePay = async (usePoints) => {
    setError(null)
    const num = parseInt(telephone)
    const result = await checkout(num, usePoints)
    if (result.success) {
      setReceipt(result.receipt)
    } else {
      setError(result.message)
    }
  }

  if (receipt) {
    return (
      <div className="page">
        <h2>Receipt</h2>
        <div className="receipt">
          <h3>CAMPUS CAFE</h3>
          <div className="address">4 N Second Street, San Jose, CA 95113</div>
          <hr className="divider" />
          <div className="receipt-row">
            <span>Date: {receipt.date}</span>
            <span>Time: {receipt.time}</span>
          </div>
          <div className="receipt-row">
            <span>Customer ID: {receipt.customer_id}</span>
            <span>Points: {receipt.points}</span>
          </div>
          <hr className="divider" />
          {receipt.items.map(item => (
            <div className="receipt-row" key={item.name}>
              <span>{item.name} x{item.quantity}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <hr className="divider" />
          <div className="receipt-row">
            <span>Subtotal</span>
            <span>${receipt.subtotal.toFixed(2)}</span>
          </div>
          {receipt.discount > 0 && (
            <div className="receipt-row">
              <span>Daily Special Discount</span>
              <span>-${receipt.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="receipt-row">
            <span>Tax</span>
            <span>${receipt.tax.toFixed(2)}</span>
          </div>
          <hr className="divider" />
          <div className="receipt-row bold">
            <span>Total</span>
            <span>${receipt.total.toFixed(2)}</span>
          </div>
          <div className="thank-you">Thank you for dining with us!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <h3 style={{ textAlign: 'center', color: 'var(--brown-dark)', marginBottom: 40 }}>Loyalty Points</h3>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            value={telephone}
            onChange={(e) => { setTelephone(e.target.value); setCustomerInfo(null) }}
            placeholder="Enter your phone number"
            style={{ flex: 1, marginBottom: 0 }}
          />
          <button type="button" className="btn-secondary" onClick={handleEarn} style={{ whiteSpace: 'nowrap' }}>
            Earn
          </button>
        </div>

        {error && <div className="message error" style={{ marginBottom: 20 }}>{error}</div>}

        {customerInfo && customerInfo.found && (
          <div className="points-info" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Customer ID: {customerInfo.customer_id}</span>
              <span>Points: {customerInfo.points.toFixed(0)}</span>
            </div>
          </div>
        )}

        {customerInfo && !customerInfo.found && (
          <div style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 24, whiteSpace: 'nowrap' }}>
            New customer — points will be created after checkout.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          {customerInfo && (
            <>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 13, padding: '10px 6px', whiteSpace: 'nowrap' }} onClick={() => handlePay(false)}>
                Pay with Cash
              </button>
              {customerInfo.found && customerInfo.points > 0 && (
                <button className="btn-primary" style={{ flex: 1, fontSize: 13, padding: '10px 6px', whiteSpace: 'nowrap' }} onClick={() => handlePay(true)}>
                  Pay with Points
                </button>
              )}
            </>
          )}
          <button type="button" className="btn-success" style={{ flex: 1, fontSize: 13, padding: '10px 6px', whiteSpace: 'nowrap' }} onClick={() => navigate('/cart')}>
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

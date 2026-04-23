import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCart, addToCart, removeFromCart, clearCart } from '../api'

function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0 })
  const [msg, setMsg] = useState(null)
  const [toasts, setToasts] = useState({})

  const loadCart = () => fetchCart().then(setCart)

  useEffect(() => { loadCart() }, [])

  const showToast = (itemName, text) => {
    setToasts(prev => ({ ...prev, [itemName]: text }))
    setTimeout(() => setToasts(prev => {
      const copy = { ...prev }
      delete copy[itemName]
      return copy
    }), 5000)
  }

  const handleIncrement = async (itemName) => {
    const result = await addToCart(itemName, 1)
    if (!result.success) {
      showToast(itemName, result.message)
    } else if (result.added < 1) {
      showToast(itemName, 'Out of stock.')
    }
    loadCart()
  }

  const handleDecrement = async (itemName) => {
    await removeFromCart(itemName, 1)
    loadCart()
  }

  const handleQtyChange = async (itemName, currentQty, newValue) => {
    const newQty = Math.max(0, parseInt(newValue) || 0)
    const diff = newQty - currentQty
    if (diff > 0) {
      const result = await addToCart(itemName, diff)
      if (!result.success) {
        showToast(itemName, result.message)
      } else if (result.added < diff) {
        showToast(itemName, `Only ${result.added} available, added ${result.added}.`)
      }
    } else if (diff < 0) {
      await removeFromCart(itemName, -diff)
    }
    loadCart()
  }

  const handleClear = async () => {
    const result = await clearCart()
    setMsg(result)
    setTimeout(() => setMsg(null), 3000)
    loadCart()
  }

  return (
    <div className="page">
      <h2>Your Cart</h2>

      {msg && (
        <div className={`message ${msg.success ? 'success' : 'error'}`}>
          {msg.message}
        </div>
      )}

      {cart.items.length === 0 ? (
        <p style={{ color: '#999', marginBottom: 20 }}>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.name}>
                  <td>
                    {item.name}
                    {item.is_special && <span className="special-badge" style={{ marginLeft: 8 }}>Special</span>}
                    {toasts[item.name] && <div className="toast-msg" style={{ marginTop: 6 }}>{toasts[item.name]}</div>}
                  </td>
                  <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="qty-control" style={{ justifyContent: 'flex-end' }}>
                      <button className="qty-btn" onClick={() => handleDecrement(item.name)}>-</button>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.name, item.quantity, e.target.value)}
                        onFocus={(e) => e.target.select()}
                      />
                      <button className="qty-btn" onClick={() => handleIncrement(item.name)}>+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <div className="row">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="row">
                <span>Daily Special Discount</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="row">
              <span>Tax (10%)</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}

      <div className="cart-actions">
        <button className="btn-primary" onClick={() => navigate('/menu')}>
          Continue Ordering
        </button>
        {cart.items.length > 0 && (
          <>
            <button className="btn-success" onClick={() => navigate('/checkout')}>
              Checkout
            </button>
            <button className="btn-danger" onClick={handleClear}>
              Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage

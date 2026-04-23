import { useState, useEffect } from 'react'

function MenuItemCard({ item, cartQty, onAdd, onRemove }) {
  const [quantity, setQuantity] = useState(cartQty || 0)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setQuantity(cartQty || 0)
  }, [cartQty])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 5000)
  }

  const handleAddResult = (result, requested) => {
    if (!result.success) {
      showToast(result.message)
    } else if (result.added < requested) {
      setQuantity(prev => prev + result.added)
      showToast(`Only ${result.added} available, added ${result.added}.`)
    } else {
      setQuantity(prev => prev + result.added)
    }
  }

  const handleIncrement = async () => {
    const result = await onAdd(item.name, 1)
    handleAddResult(result, 1)
  }

  const handleDecrement = async () => {
    if (quantity <= 0) return
    setQuantity(prev => prev - 1)
    await onRemove(item.name, 1)
  }

  const handleInputChange = async (e) => {
    const newVal = Math.max(0, parseInt(e.target.value) || 0)
    const diff = newVal - quantity
    if (diff > 0) {
      const result = await onAdd(item.name, diff)
      handleAddResult(result, diff)
    } else if (diff < 0) {
      setQuantity(newVal)
      await onRemove(item.name, -diff)
    }
  }

  const handleFocus = (e) => e.target.select()

  return (
    <div className="menu-card">
      <span className="item-name">
        {item.name}
        {item.is_special && <span className="special-badge" style={{ marginLeft: 6 }}>-{item.discount_rate}%</span>}
      </span>
      <span className="item-price">${item.price.toFixed(2)}</span>
      <div className="qty-control">
        <button className="qty-btn" onClick={handleDecrement}>-</button>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <button className="qty-btn" onClick={handleIncrement}>+</button>
      </div>
      {toast && <div className="toast-msg">{toast}</div>}
    </div>
  )
}

export default MenuItemCard

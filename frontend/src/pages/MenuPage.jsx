import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMenu, fetchCart, addToCart, removeFromCart } from '../api'
import MenuItemCard from '../components/MenuItemCard'

function MenuPage() {
  const navigate = useNavigate()
  const [menuData, setMenuData] = useState({ items: [], categories: [], daily_special: null })
  const [cartQtyMap, setCartQtyMap] = useState({})
  const [activeCategory, setActiveCategory] = useState('Salads')

  const loadData = async () => {
    const [menuRes, cartRes] = await Promise.all([fetchMenu(), fetchCart()])
    setMenuData(menuRes)
    const qtyMap = {}
    for (const item of cartRes.items) {
      qtyMap[item.name] = item.quantity
    }
    setCartQtyMap(qtyMap)
  }

  useEffect(() => { loadData() }, [])

  const handleAdd = async (itemName, quantity) => {
    return await addToCart(itemName, quantity)
  }

  const handleRemove = async (itemName, quantity) => {
    await removeFromCart(itemName, quantity)
  }

  const filtered = menuData.items.filter(i => i.category === activeCategory)

  const itemsWithDiscount = filtered.map(item => ({
    ...item,
    discount_rate: item.is_special && menuData.daily_special
      ? Math.round(menuData.daily_special.discount_rate * 100)
      : 0,
  }))

  return (
    <div className="page">
      <h2>Menu</h2>

      {menuData.daily_special && (
        <div style={{ marginBottom: 16, padding: '8px 20px', background: 'var(--cream-dark)', color: 'var(--brown-dark)', borderRadius: 6, fontSize: 14 }}>
          Today's Special: <strong>{menuData.daily_special.name}</strong> — {Math.round(menuData.daily_special.discount_rate * 100)}% OFF!
        </div>
      )}

      <div className="category-tabs">
        {menuData.categories.map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {itemsWithDiscount.map(item => (
          <MenuItemCard
            key={item.name}
            item={item}
            cartQty={cartQtyMap[item.name] || 0}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="cart-actions" style={{ marginTop: 20 }}>
        <button className="btn-primary" onClick={() => navigate('/cart')}>
          View Cart
        </button>
      </div>
    </div>
  )
}

export default MenuPage

const BASE = '/api';

export async function fetchMenu(category) {
  const url = category ? `${BASE}/menu?category=${category}` : `${BASE}/menu`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${BASE}/cart`);
  return res.json();
}

export async function addToCart(itemName, quantity) {
  const res = await fetch(`${BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_name: itemName, quantity }),
  });
  return res.json();
}

export async function removeFromCart(itemName, quantity) {
  const res = await fetch(`${BASE}/cart/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_name: itemName, quantity }),
  });
  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${BASE}/cart/clear`, { method: 'POST' });
  return res.json();
}

export async function lookupCustomer(telephone) {
  const res = await fetch(`${BASE}/customer/lookup?telephone=${telephone}`);
  return res.json();
}

export async function checkout(telephone, usePoints = false) {
  const res = await fetch(`${BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telephone, use_points: usePoints }),
  });
  return res.json();
}

export async function staffLogin(staffId, password) {
  const res = await fetch(`${BASE}/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staff_id: staffId, password }),
  });
  return res.json();
}

export async function fetchInventory() {
  const res = await fetch(`${BASE}/inventory`);
  return res.json();
}

export async function restockItem(itemName, amount) {
  const res = await fetch(`${BASE}/inventory/restock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_name: itemName, amount }),
  });
  return res.json();
}

export async function fetchSessionOrders() {
  const res = await fetch(`${BASE}/session/orders`);
  return res.json();
}

export async function sessionQuit() {
  const res = await fetch(`${BASE}/session/quit`, { method: 'POST' });
  return res.json();
}

// Staff management
export async function fetchStaffs() {
  const res = await fetch(`${BASE}/staff/list`);
  return res.json();
}

export async function changeStaffPermission(staffId) {
  const res = await fetch(`${BASE}/staff/permission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staff_id: staffId }),
  });
  return res.json();
}

export async function addStaff(name, telephone) {
  const res = await fetch(`${BASE}/staff/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, telephone }),
  });
  return res.json();
}

export async function deleteStaff(staffId) {
  const res = await fetch(`${BASE}/staff/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staff_id: staffId }),
  });
  return res.json();
}

// Staff settings
export async function resetStaffPhone(staffId, telephone) {
  const res = await fetch(`${BASE}/staff/settings/telephone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staff_id: staffId, telephone }),
  });
  return res.json();
}

export async function resetStaffPassword(staffId, newPassword) {
  const res = await fetch(`${BASE}/staff/settings/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staff_id: staffId, new_password: newPassword }),
  });
  return res.json();
}

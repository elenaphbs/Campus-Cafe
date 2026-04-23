# Campus Cafe

A cafe ordering system with both a CLI interface and a web application, built for the NEU CS5001 Final Project.

## Features

### Customer
- Browse menu with daily specials and discount
- Add/remove items to cart
- Checkout with loyalty points system (earn & redeem)
- View receipt after payment

### Staff
- Login with staff ID and password
- View and restock inventory
- Reset telephone number and password

### Administrator
- All staff features
- View all staff members
- Add / delete staff
- Promote / demote staff permissions

## Functional Requirements

### Menu Management
- The system loads menu items from `Menu.xlsx` with name, price, and category
- A random daily special is selected each session with a discounted rate
- Customers can browse by category (e.g., Salads, Drinks, Desserts)

### Order & Cart
- Customers can add items to the cart; the system checks inventory before adding
- Customers can remove items from the cart; inventory is restored accordingly
- Cart displays itemized list with subtotal, daily special discount, tax (10%), and total

### Checkout & Loyalty Points
- Customers enter a phone number to earn loyalty points (1 point per $5 spent)
- Returning customers can view their point balance and choose to pay with points
- New customers are automatically registered upon first checkout
- A receipt is generated with date, time, customer ID, points, and itemized totals

### Inventory Management
- Staff can view all inventory items and current stock levels
- Low-stock items (5 or fewer) are highlighted
- Staff can restock items by selecting an item and entering an amount

### Staff Authentication & Roles
- Staff log in with a 9-digit staff ID and password
- The system distinguishes between **regular staff** and **administrators**
- Regular staff: inventory management + personal settings
- Administrators: inventory management + staff management + personal settings

### Staff Management (Admin Only)
- View all staff with ID, name, telephone, and role
- Add new staff (auto-generates a unique 9-digit ID with default password)
- Delete existing staff
- Promote staff to administrator or demote administrator to regular staff

### Staff Settings
- Staff can reset their own telephone number
- Staff can reset their own password (must be 10+ characters, include an uppercase letter and a digit)

### Data Persistence
- All data (menu, inventory, customers, staff, orders) is stored in Excel files under `data/`
- Changes are saved to Excel immediately after each operation

## Application Flow

### Customer Flow

```
Home Page
  │
  ├──> Menu Page (browse by category, view daily special)
  │       │
  │       └──> Add items to cart (stock check)
  │
  ├──> Cart Page (view/edit items, see totals)
  │       │
  │       └──> Checkout Page
  │               │
  │               ├──> Enter phone number → Earn (look up points)
  │               │
  │               ├──> Returning customer: Pay with Cash / Pay with Points
  │               │
  │               └──> New customer: Pay with Cash
  │                       │
  │                       └──> Receipt → Auto-redirect to Home (8s)
```

### Staff Flow

```
Home Page
  │
  └──> Staff Login (ID + Password)
          │
          ├──> [Regular Staff]
          │       ├──> Inventory Management (view / restock)
          │       └──> Settings (reset phone / password)
          │
          └──> [Administrator]
                  ├──> Inventory Management (view / restock)
                  ├──> Staff Management (view / add / delete / promote / demote)
                  └──> Settings (reset phone / password)
```

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| CLI      | Python                            |
| Backend  | FastAPI, Uvicorn                  |
| Frontend | React 19, React Router, Vite      |
| Data     | Pandas, OpenPyXL (Excel storage)  |

## Project Structure

```
├── main.py                # CLI application
├── app.py                 # FastAPI backend
├── backend/               # Business logic
│   ├── menu.py
│   ├── order.py
│   ├── customer.py
│   ├── staff.py
│   └── inventory_ShuranRyu.py
├── data/                  # Excel data files
├── frontend/              # React web app
│   └── src/
│       ├── api.js         # API client
│       ├── components/    # Navbar, MenuItemCard, StaffSubNav
│       └── pages/         # Home, Menu, Cart, Checkout, Staff pages
└── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
pip install -r requirements.txt
python app.py
```

The API server runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The web app runs at `http://localhost:5173`.

### CLI

```bash
python main.py
```

## Authors

- Elena Wang
- Shuran Ryu

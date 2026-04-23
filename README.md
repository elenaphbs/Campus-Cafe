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

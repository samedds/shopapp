# HIPI POS – Supermarket Manager

A modern full-stack Point of Sale (POS) and inventory management system built with React, TypeScript, Vite, and Django REST Framework.

---

# Overview

HIPI POS is a web-based business management platform designed for supermarkets and retail stores. The system combines inventory management, stock tracking, sales processing, reporting, and real-time synchronization into a single scalable solution.

The platform enables business owners to monitor operations remotely while cashiers and staff manage sales and inventory efficiently at store level.

---

# Core Features

## Dashboard

- Real-time business overview
- Revenue and sales tracking
- Inventory summaries
- Recent transactions monitoring
- Quick-access business insights

---

## Inventory Management

- Add, edit, and delete products
- Product categorization
- SKU management
- Pricing and quantity tracking
- Product image support

---

## Stock Management

- Automatic stock deduction after sales
- Low-stock monitoring
- Stock movement tracking
- Inventory history logs

---

## Point of Sale (POS)

- Fast checkout workflow
- Dynamic shopping cart
- Real-time total calculations
- Discount and tax support
- Receipt generation

---

## Receipt Printing

- Printable transaction receipts
- Clean customer-friendly layout
- Browser and printer compatible

---

## Reports & Analytics

- Daily sales reports
- Weekly and monthly summaries
- Inventory performance reports
- Transaction history tracking

---

## Sync System

- Real-time synchronization
- Automatic sync when internet connection is available
- Designed for remote business monitoring

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Python
- Django
- Django REST Framework

## Database

- SQLite (Development)
- MYSLQi (Production Ready)

---

# Project Structure

shopapp/
├── backend/
│   ├── inventory/
│   ├── orders/
│   ├── stock/
│   ├── supermarket_api/
│   ├── db.sqlite3
│   └── manage.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Inventory/
│   │   │   ├── Layout/
│   │   │   ├── POS/
│   │   │   ├── Reports/
│   │   │   ├── StockManagement/
│   │   │   ├── SyncStatus/
│   │   │   └── ui/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore


# Installation & Setup
# Clone Repository
git clone https://github.com/sam-edds/shopapp.git
cd shopapp

# Backend Setup (Django)
Navigate to backend
- cd backend
Create virtual environment
- python -m venv venv
Activate virtual environment
Windows
- venv\Scripts\activate
Mac/Linux
- source venv/bin/activate
Install dependencies
- pip install -r requirements.txt
Run migrations
- python manage.py makemigrations
- python manage.py migrate
Start Django server
- python manage.py runserver

# Backend runs on:

http://127.0.0.1:8000
Frontend Setup (React + Vite)
Open new terminal
- cd frontend
Install dependencies
- npm install
Start frontend server
- npm run dev

# Frontend runs on:

http://localhost:5173
Authentication
User login system
Session authentication
Protected API routes
Role-based access support
API Endpoints (Sample)

# Products
GET     /api/products/
POST    /api/products/
PUT     /api/products/:id/
DELETE  /api/products/:id/
Orders
GET     /api/orders/
POST    /api/orders/
Reports
GET     /api/reports/

# Current Modules
Dashboard
Inventory
Orders
POS
Reports
Stock Management
Sync Status

# Future Improvements
Barcode scanner integration
Multi-branch support
Cloud synchronization
Employee management
User creation by Admin
AI-powered analytics
Mobile app integration
Thermal printer optimization

## Development Notes
SQLite is currently used for development.
Designed with scalable REST API architecture.
Frontend communicates with Django API using JSON.
Prepared for deployment on cloud infrastructure.

# Contribution

Contributions are welcome.

To contribute:

# Fork the repository
Create a feature branch
Commit your changes
Push to your branch
Open a Pull Request
 
# License
This project is licensed under the MIT License.

# Author
Samuel Kofi Edwards
HIPI Technologies

# Contact
Email: info@hipitechs.com
GitHub: https://github.com/samedds
# Cargo Procurement Backend

Backend API for a Cargo, Procurement, Shipment Tracking, Invoice and Expense Management System using Node.js, Express and MongoDB.

## Features

- JWT authentication
- Role-based access: admin, staff, customer
- Customer management
- Supplier management
- Procurement request management
- Shipment tracking with public tracking URL
- Shipment document upload
- Invoice generation
- PDF invoice download
- Expense tracking
- Dashboard summary

## Installation

```bash
cd cargo-procurement-backend
npm install
```

## Environment Setup

Update `config.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cargo_procurement_db
JWT_SECRET=change_this_secret_key
JWT_EXPIRES_IN=7d
```

## Run Project

```bash
npm run dev
```

or

```bash
npm start
```

## Main API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Customers

```txt
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Suppliers

```txt
GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/:id
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
```

### Procurements

```txt
GET    /api/procurements
POST   /api/procurements
GET    /api/procurements/:id
PUT    /api/procurements/:id
DELETE /api/procurements/:id
```

### Shipments

```txt
GET    /api/shipments
POST   /api/shipments
GET    /api/shipments/:id
GET    /api/shipments/track/:trackingNo
PUT    /api/shipments/:id
PUT    /api/shipments/:id/status
POST   /api/shipments/:id/documents
DELETE /api/shipments/:id
```

### Invoices

```txt
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
GET    /api/invoices/:id/pdf
PUT    /api/invoices/:id
PUT    /api/invoices/:id/payment
DELETE /api/invoices/:id
```

### Expenses

```txt
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

### Dashboard

```txt
GET /api/dashboard/summary
```

## Example Login/Register Body

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "phone": "17123456",
  "role": "admin"
}
```

## Authorization Header

For protected routes:

```txt
Authorization: Bearer YOUR_TOKEN_HERE
```

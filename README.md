# Personal Finance Management (PFM) Dashboard

## Overview

The **Personal Finance Management (PFM) Dashboard** is a full-stack MERN application designed to help users track, analyze, and manage their personal financial activities in one place.

Users can connect their bank accounts, monitor income and expenses, analyze spending patterns, and gain financial insights through an intuitive dashboard with data visualizations.

The goal of this project is to provide a **unified financial overview** that helps users make better budgeting and spending decisions.

---

## Design Prototype

Before development, we created a UI/UX prototype to define the layout and user experience of the application.

Figma Prototype:
https://www.figma.com/make/k3Sas2951aZQHO0rGLyr7D/Design-Layout-Structure?t=7DnGg7YJokMr6H5K-1

The prototype includes:

- Dashboard structure
- Transaction management layout
- Financial analytics charts
- Responsive UI layout

# Key Features

* User authentication and secure login
* Bank account integration
* Transaction tracking
* Spending category analysis
* Interactive financial dashboard
* Data visualization using charts
* Budget monitoring
* Manual transaction management

---

# Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### External APIs

* Plaid API (for bank account integration)

---

# System Architecture

```
Frontend (React + Tailwind)
        │
        │ REST API
        ▼
Backend (Node.js + Express)
        │
        │ Mongoose ODM
        ▼
Database (MongoDB)
        │
        ▼
External API
Plaid API
```

---

# Project Structure

```
pfm-dashboard
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   └── utils
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── utils
│
├── docs
│   ├── architecture.md
│   ├── database.md
│   ├── api-docs.md
│   └── progress-log.md
│
└── README.md
```

---

# Database Design

The system uses **MongoDB with Mongoose**.

### Collections

### Users

```
User
_id
name
email
password (hashed)
createdAt
```

### Accounts

```
Account
_id
userId
bankName
accountType
balance
plaidAccessToken
createdAt
```

### Transactions

```
Transaction
_id
userId
accountId
amount
category
merchant
date
type (income / expense)
```

---

# API Endpoints

## Authentication

### Register

```
POST /api/auth/register
```

Request:

```
{
  "name": "User",
  "email": "user@email.com",
  "password": "password"
}
```

---

### Login

```
POST /api/auth/login
```

Response:

```
{
  "token": "JWT_TOKEN"
}
```

---

## User

```
GET /api/user/profile
```

---

## Accounts

```
POST /api/accounts/connect
GET /api/accounts
```

---

## Transactions

```
GET /api/transactions
POST /api/transactions
PUT /api/transactions/:id
DELETE /api/transactions/:id
```

---

## Dashboard

```
GET /api/dashboard/summary
GET /api/dashboard/categories
```

---

# Installation

## Clone Repository

```
git clone https://github.com/your-repo/pfm-dashboard.git
```

```
cd pfm-dashboard
```

---

# Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

Start backend server:

```
npm run dev
```

---

# Frontend Setup

```
cd frontend
npm install
npm start
```

---

# Development Workflow

We follow a **Git branching workflow**.

### Branch Structure

```
main
develop

feature/auth
feature/dashboard
feature/transactions
feature/frontend-ui
```

### Development Process

1. Create a feature branch

```
git checkout develop
git checkout -b feature/feature-name
```

2. Commit changes

```
git add .
git commit -m "Implemented feature"
```

3. Push branch

```
git push origin feature/feature-name
```

4. Create a Pull Request.

All pull requests must be reviewed before merging.

---

# Weekly Development Plan

### Week 1

Project setup and authentication.

### Week 2

Bank account integration.

### Week 3

Dashboard and data visualization.

### Week 4

Testing, UI improvements, and documentation.

---

# Team Members

| Name         | Role                   |
| ------------ | ---------------------- |
| Member 1     | Backend & Project Lead |
| Member 2     | Backend Developer      |
| Member 3     | Frontend Developer     |
| Member 4     | Frontend & Integration |

---

# Documentation

Additional documentation can be found in the `docs` folder.

* architecture.md
* database.md
* api-docs.md
* progress-log.md

---

# Future Improvements

* Advanced budgeting features
* AI-based spending insights
* Mobile responsive improvements
* Notification system
* Financial goal tracking

---

# License

This project is developed for educational and internship purposes.

---

If you want, I can also give you **3 more things that will make your project look extremely professional on GitHub**:

1️⃣ **Professional GitHub repository structure**
2️⃣ **GitHub Issue templates for your team**
3️⃣ **Professional project architecture diagram**

These things make your project look like it was built by a **real startup engineering team**, not just students.

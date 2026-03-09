# RinKhata (ঋণখাতা) - Loan Tracking System 💸

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

> A modern, full-stack personal loan tracking system to manage lending and borrowing with precision. Track who owes you money (or who you owe) with ease.

**Live Demo**: 🔗 [rinkhata.netlify.app](https://rinkhata.netlify.app) *(Coming soon)*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Development Progress](#development-progress)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Advanced Features](#advanced-features)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Tracking who owes you money (or who you owe) is a hassle. Notes get lost, mental math fails, and awkward conversations happen. **RinKhata** is a dedicated loan tracking system that handles personal lending and borrowing with precision.

### Problem Statement
- 📝 Notes get lost
- 🧮 Mental math fails  
- 💬 Awkward conversations about money
- 📊 No clear visibility of financial position

### Solution
A comprehensive loan tracking system with partial settlements, smart balance tracking, and wallet integration.

---

## 🔥 Key Features

### Core Features
- ✅ **Partial Settlements**: Support for multiple partial payments with automatic balance calculation
- ✅ **Smart Balance**: Net financial position display (lender vs borrower) with color-coded stats
- ✅ **Active Tracking**: Real-time loan status (Active/Settled)
- ✅ **Visual Progress**: Dynamic progress bars showing repayment status
- ✅ **Wallet Integration**: Link payments to digital wallets (MFS, Bank, Cash)

### Advanced Features (Planned)
- 📊 **Data Visualization**: Charts for lending trends and recovery analysis
- 🔔 **Loan Reminders**: Automated notifications for overdue payments
- 🔍 **Smart Search & Filters**: Quick access to specific loans and transactions
- 📱 **Mobile Responsive**: Optimized for all devices
- 🌙 **Dark Mode**: Eye-friendly interface

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

### DevOps & Deployment
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv

---

## 🏗 System Architecture

### MERN Stack Architecture
```
┌─────────────────────┐
│  Frontend (React)   │
│   + TypeScript      │
└──────────┬──────────┘
           │ REST API
           │ (Axios + React Query)
           ▼
┌─────────────────────┐
│  Backend (Express)  │
│   + TypeScript      │
└──────────┬──────────┘
           │ Mongoose ODM
           ▼
┌─────────────────────┐
│  Database (MongoDB) │
└─────────────────────┘
```

### Core Modules
1. 🔐 **Auth** - User authentication and authorization
2. 👤 **User** - User profile management
3. 💰 **Wallet** - Multi-wallet system (Cash, Bank, MFS)
4. 📝 **Loan** - Loan creation and management
5. 💳 **Transaction** - Transaction history and tracking
6. 📊 **Statistics** - Financial insights and analytics

### Module Interactions
```
Wallet ←→ Loan ←→ Transaction
```

**Example Flow**:
1. User lends $1000 to friend
2. Loan record created
3. Wallet balance updated (-$1000)
4. Transaction stored for history

---

## 🗄 Database Schema

### User Collection
```typescript
{
  _id: ObjectId           // Primary key
  name: string            // Full name
  email: string           // Unique email
  password: string        // Hashed password
  avatar: string          // Profile picture URL
  createdAt: Date         // Account creation timestamp
}
```

### Wallet Collection
```typescript
{
  _id: ObjectId           // Primary key
  userId: ObjectId        // Reference to User
  name: string            // Wallet name (e.g., "Cash Wallet", "bKash")
  type: enum              // "cash" | "bank" | "mfs"
  balance: number         // Current balance
  currency: string        // Currency code (e.g., "BDT", "USD")
  createdAt: Date         // Wallet creation timestamp
}
```

**Example Wallets**:
- Cash Wallet (type: cash)
- bKash (type: mfs)
- Bank Account (type: bank)

### Loan Collection
```typescript
{
  _id: ObjectId              // Primary key
  userId: ObjectId           // Reference to User
  walletId: ObjectId         // Reference to Wallet
  personName: string         // Name of person (lent to/borrowed from)
  personContact: string      // Contact info (phone/email)
  loanType: enum             // "Lent" | "Borrowed"
  principalAmount: number    // Original loan amount
  paidAmount: number         // Amount paid so far
  balanceAmount: number      // Remaining balance
  purposeNote: string        // Optional purpose description
  loanDate: Date             // Loan creation date
  dueDate: Date              // Optional due date
  status: enum               // "Active" | "Settled"
  createdAt: Date            // Timestamp
}
```

### Transaction Collection
```typescript
{
  _id: ObjectId           // Primary key
  loanId: ObjectId        // Reference to Loan
  walletId: ObjectId      // Reference to Wallet
  userId: ObjectId        // Reference to User
  amount: number          // Transaction amount
  type: enum              // "Payment" | "Loan"
  date: Date              // Transaction date
  note: string            // Optional transaction note
  createdAt: Date         // Transaction timestamp
}
```

### Stats Collection (Optional)
```typescript
{
  _id: ObjectId
  userId: ObjectId        // Reference to User
  totalLent: number       // Total amount lent out
  totalBorrowed: number   // Total amount borrowed
  totalReceived: number   // Total amount received back
}
```

---

## 📁 Project Structure

```
RinKhata/
│
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── db.ts         # MongoDB connection
│   │   │   └── env.ts        # Environment variables
│   │   │
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Wallet.ts
│   │   │   ├── Loan.ts
│   │   │   └── Transaction.ts
│   │   │
│   │   ├── controllers/      # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── walletController.ts
│   │   │   ├── loanController.ts
│   │   │   └── transactionController.ts
│   │   │
│   │   ├── routes/           # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── walletRoutes.ts
│   │   │   ├── loanRoutes.ts
│   │   │   └── transactionRoutes.ts
│   │   │
│   │   ├── services/         # Business logic
│   │   │   ├── loanService.ts
│   │   │   └── walletService.ts
│   │   │
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   │
│   │   ├── utils/            # Utility functions
│   │   │   ├── helpers.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── app.ts           # Express app configuration
│   │   └── server.ts        # Server entry point
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── LoanCard.tsx
│   │   │   ├── WalletCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── pages/            # Route-level components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Loans.tsx
│   │   │   ├── Wallets.tsx
│   │   │   ├── Transactions.tsx
│   │   │   └── Login.tsx
│   │   │
│   │   ├── features/         # Feature modules
│   │   │   └── loans/
│   │   │       ├── loanAPI.ts
│   │   │       └── loanHooks.ts
│   │   │
│   │   ├── services/         # API services
│   │   │   └── api.ts
│   │   │
│   │   ├── layouts/          # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── utils/            # Utility functions
│   │   │   └── currency.ts
│   │   │
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # React entry point
│   │
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                       # Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── workflow.md
│
├── docker/                     # Docker configuration (future)
│
└── README.md                   # This file
```

---

## 📅 Development Progress

### Phase 1: Project Setup ✅ COMPLETED
- [x] Initialize Git repository
- [x] Setup backend (Node + Express + TypeScript)
- [x] Setup frontend (Vite + React + TypeScript)
- [x] Install dependencies
- [x] Configure development environment
- [x] Create documentation files (architecture.md, workflow.md)
- [x] Setup Docker configuration

**Status**: ✅ Completed  
**Completed on**: Day 1 - March 9, 2026

---

### Phase 2: Database Design ✅ COMPLETED
- [x] Design MongoDB schemas
- [x] Implement User model
- [x] Implement Wallet model
- [x] Implement Loan model (updated with full fields)
- [x] Implement Transaction model (updated with full fields)
- [x] Test database connections
- [x] Create seed data script
- [x] Populate database with demo data

**Status**: ✅ Completed  
**Completed on**: Day 2 - March 9, 2026

**Demo Credentials**:
- Email: `demo@rinkhata.com`
- Password: `password123`

**Seed Data**:
- 1 User
- 3 Wallets (Cash: 50,000 BDT, Bank: 150,000 BDT, bKash: 25,000 BDT)
- 4 Loans (3 Active, 1 Settled)
- 6 Transactions

---

### Phase 3: Backend APIs
- [ ] Auth endpoints (register, login, me)
- [ ] Wallet CRUD operations
- [ ] Loan CRUD operations
- [ ] Loan payment endpoint
- [ ] Transaction endpoints
- [ ] JWT middleware
- [ ] Test all APIs with Postman

**Status**: ⏳ Not Started  
**Target**: Day 3

---

### Phase 4: Frontend UI
- [ ] Dashboard page with stats
- [ ] Loans page with filters
- [ ] Wallets page
- [ ] Transactions page
- [ ] Login/Register page
- [ ] Reusable components (LoanCard, ProgressBar, etc.)
- [ ] Tailwind CSS styling

**Status**: ⏳ Not Started  
**Target**: Day 4

---

### Phase 5: API Integration
- [ ] Setup TanStack Query
- [ ] Create custom hooks (useLoans, useWallets, etc.)
- [ ] Connect all pages to backend
- [ ] Implement optimistic updates
- [ ] Handle loading and error states

**Status**: ⏳ Not Started  
**Target**: Day 5

---

### Phase 6: Testing & Bug Fixes
- [ ] Test all API endpoints
- [ ] Test frontend components
- [ ] Test complete user flows
- [ ] Fix bugs
- [ ] Performance optimization
- [ ] Cross-browser testing

**Status**: ⏳ Not Started  
**Target**: Day 6

---

### Phase 7: Deployment
- [ ] Build production bundles
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Configure environment variables
- [ ] Final production testing
- [ ] Update README with live links

**Status**: ⏳ Not Started  
**Target**: Day 7

---

### Phase 8: Advanced Features (Optional)
- [ ] Data visualization with Chart.js
- [ ] Loan reminders (cron jobs)
- [ ] Email notifications
- [ ] Dark mode
- [ ] Mobile optimization

**Status**: ⏳ Planned  
**Target**: Days 8-10

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rinkhata.git
cd rinkhata/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rinkhata
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Run development server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Wallet Endpoints

#### Get All Wallets
```http
GET /api/wallets
Authorization: Bearer <token>
```

#### Create Wallet
```http
POST /api/wallets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "bKash",
  "type": "mfs",
  "balance": 5000,
  "currency": "BDT"
}
```

#### Update Wallet
```http
PATCH /api/wallets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "balance": 6000
}
```

#### Delete Wallet
```http
DELETE /api/wallets/:id
Authorization: Bearer <token>
```

---

### Loan Endpoints

#### Get All Loans
```http
GET /api/loans
Authorization: Bearer <token>
```

#### Create Loan
```http
POST /api/loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "borrowerName": "John Doe",
  "borrowerContact": "john@example.com",
  "totalAmount": 1000,
  "walletId": "wallet_id_here"
}
```

#### Get Single Loan
```http
GET /api/loans/:id
Authorization: Bearer <token>
```

#### Update Loan
```http
PATCH /api/loans/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "borrowerName": "John Smith"
}
```

#### Process Payment
```http
PATCH /api/loans/:id/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200,
  "walletId": "wallet_id_here",
  "note": "Partial payment"
}
```

#### Delete Loan
```http
DELETE /api/loans/:id
Authorization: Bearer <token>
```

---

### Transaction Endpoints

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <token>
```

#### Get Single Transaction
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

---

## 🌐 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Frontend Deployment (Netlify)

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variables
5. Deploy

---

## 🎨 UI Wireframes

### Dashboard
```
┌─────────────────────────────────────────┐
│  📊 Dashboard                           │
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌────────────┐ │
│ │   Net   │ │  Total  │ │   Total    │ │
│ │ Balance │ │  Lent   │ │  Borrowed  │ │
│ └─────────┘ └─────────┘ └────────────┘ │
│                                         │
│ Recent Loans                            │
│ [Loan cards...]                         │
│                                         │
│ Recent Transactions                     │
│ [Transaction list...]                   │
└─────────────────────────────────────────┘
```

### Loans Page
```
┌─────────────────────────────────────────┐
│  📝 Loans                               │
├─────────────────────────────────────────┤
│ [Search] [Filter: Active ▼]             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Borrower: John Doe                  │ │
│ │ Amount: $1,000                      │ │
│ │ Remaining: $400                     │ │
│ │ [████████░░░░░░░] 60%               │ │
│ │ [Pay] [Edit] [Delete]               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📊 Advanced Features

### Data Visualization
- **Monthly Lending Chart**: Bar chart showing loans given per month
- **Loan Recovery Chart**: Line chart showing payment collection timeline
- **Status Distribution**: Pie chart showing Active vs Settled loans
- **Wallet Balance Timeline**: Area chart showing balance changes

### Loan Reminders
- Automated cron jobs to check overdue loans
- Email/SMS notifications for borrowers
- Customizable reminder schedules

### Mobile Optimization
- Responsive design with Tailwind breakpoints
- Touch-friendly interactions
- Bottom navigation for mobile
- Swipe gestures (optional)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Inspired by the need for better personal finance management
- Built with modern web technologies
- Special thanks to the open-source community

---

## 📈 Project Stats

- **Total Lines of Code**: TBD
- **Backend Endpoints**: 15+
- **Frontend Components**: 20+
- **Test Coverage**: TBD
- **Performance Score**: TBD

---

## 🗺 Roadmap

- [x] System architecture design
- [x] Database schema design
- [x] Project structure setup
- [ ] Backend API development
- [ ] Frontend UI development
- [ ] API integration
- [ ] Testing
- [ ] Deployment
- [ ] Advanced features (Charts, Notifications)
- [ ] Mobile app (Future)
- [ ] Multi-language support (Future)

---

**Built with ❤️ using the MERN Stack**

Last Updated: March 9, 2026
# RinKhata (ঋণখাতা)

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

> A modern MERN stack application for tracking personal loans and borrowings with smart balance management and wallet integration.

---

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Development Timeline](#development-timeline)
- [Setup Instructions](#setup-instructions)
- [Project Status](#project-status)
- [License](#license)

---

## 🎯 About

**RinKhata** (ঋণখাতা means "Loan Ledger" in Bengali) is a full-stack web application designed to simplify personal finance management by tracking lending and borrowing activities.

### The Problem
Managing informal loans between friends, family, or personal contacts is challenging:
- Manual record-keeping is error-prone
- Difficult to track partial payments
- No clear overview of financial obligations
- Awkward money conversations due to unclear records

### The Solution
A dedicated platform that:
- Centralizes all loan records in one place
- Supports partial payment tracking with automatic balance calculation
- Provides real-time financial overview (lent vs borrowed)
- Links transactions to digital wallets for better money management

---

## 🔥 Key Features

### Core Functionality ✅ (Implemented)
- **Dual-Mode Tracking**: Track both money lent and money borrowed
- **Partial Payments**: Support multiple partial settlements with automatic balance updates
- **Multi-Wallet System**: Manage multiple payment sources (Cash, Bank, Mobile Financial Services)
- **Transaction History**: Complete audit trail of all payments and loans
- **Smart Statistics**: Real-time insights with wallet type breakdowns
- **Secure Authentication**: JWT-based user authentication and authorization
- **Delete Protection**: Intelligent validations prevent data inconsistency
- **Contextual UI**: Dynamic labels and indicators based on transaction direction

### 🤖 AI-Powered Features (Coming Soon)
- **Smart Lending Assistant**: 
  * Analyzes your available balance before you lend money
  * Warns you if lending would leave you with insufficient funds
  * Recommends optimal lending amounts based on your financial health
- **Expense Intelligence**:
  * Tracks your monthly spending patterns
  * Provides insights into when you tend to lend or borrow most
  * Predicts cash flow based on historical data
- **Financial Health Score**:
  * AI-generated score based on your lending/borrowing ratio
  * Personalized tips to improve your financial position
  * Alerts when your borrowing exceeds healthy thresholds
- **Predictive Alerts**:
  * Smart reminders for upcoming loan due dates
  * Anomaly detection for unusual spending patterns
  * Budget recommendations to maintain positive cash flow

### Advanced Features (In Development)
- **AI-Powered Money Management**: Intelligent lending recommendations, spending analysis, and financial health monitoring
- **Smart Notifications**: Automated loan reminders, payment confirmations, and due date alerts
- **Enhanced Analytics**: Visual charts and graphs for spending trends and financial insights
- **Advanced Search & Filtering**: Complex queries across loans, transactions, and wallets
- **Mobile-Responsive Design**: Optimized for all device sizes
- **Export Functionality**: Generate reports in CSV/PDF formats
- **Corner Case Handling**: Comprehensive validations and error recovery mechanisms

---

## 🛠 Technology Stack

### Frontend
- React 18 with TypeScript
- TanStack Query (React Query) for server state management
- Tailwind CSS for styling
- Vite as build tool
- Axios for HTTP requests

### Backend
- Node.js with Express framework
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT for authentication
- Express Validator for input validation

### DevOps
- Version Control: Git & GitHub
- Planned Deployment: Netlify (Frontend) + Render (Backend)

---

## 🏗 Architecture

### System Design
```
┌─────────────────────────┐
│   React Frontend        │
│   (TypeScript + Vite)   │
└───────────┬─────────────┘
            │
            │ REST API
            │ (Axios + React Query)
            │
┌───────────▼─────────────┐
│   Express Backend       │
│   (Node.js + TypeScript)│
└───────────┬─────────────┘
            │
            │ Mongoose ODM
            │
┌───────────▼─────────────┐
│   MongoDB Database      │
└─────────────────────────┘
```

### Core Modules
- **Authentication Module**: User registration, login, and JWT management
- **User Module**: Profile management and settings
- **Wallet Module**: Multi-wallet system for tracking payment sources
- **Loan Module**: Create, update, and manage loan records
- **Transaction Module**: Record and track all payment activities
- **Statistics Module**: Calculate and display financial insights

### Database Collections
The system uses MongoDB with the following core collections:
- Users (authentication and profile information)
- Wallets (payment source management)
- Loans (lending and borrowing records)
- Transactions (payment history and audit trail)

---

## 📅 Development Timeline

### Phase 1: Foundation Setup ✅
**Focus**: Project initialization and environment configuration
- Repository setup with Git
- Backend scaffolding (Node.js + Express + TypeScript)
- Frontend initialization (React + Vite + TypeScript)
- Development environment configuration
- Documentation structure

**Status**: Completed (Day 1)

---

### Phase 2: Database Layer ✅
**Focus**: Data modeling and database implementation
- MongoDB schema design
- Mongoose model implementation
- Database connection setup
- Data seeding utilities

**Status**: Completed (Day 2)

---

### Phase 3: Backend Development ✅
**Focus**: REST API implementation and testing
- Authentication endpoints (Register, Login, Get Me)
- CRUD operations for all entities (Wallets, Loans, Transactions)
- Business logic implementation (Loan payments, Statistics)
- API testing with Postman (17 endpoints tested)
- JWT middleware integration (Authorization protection verified)

**Status**: Completed (Day 3 - March 10, 2026)

---

### Phase 4: Frontend UI Development ✅
**Focus**: User interface implementation and API integration
- Dashboard with comprehensive financial overview
  * Available Balance with Cash/Bank/MFS breakdown
  * Total Lent/Borrowed with wallet type breakdowns
  * Net Balance calculation (Lent - Borrowed)
  * Clickable Active/Settled loan cards
  * Recent transaction activity
- Complete Wallet management interface (CRUD with delete protection)
- Loan management with payment processing and contextual UI
- Transaction history with directional indicators and filtering
- Authentication pages (Login/Register) with JWT integration
- React Query setup with custom hooks (useAuth, useWallets, useLoans, useTransactions)
- API integration for all features with error handling
- Real-time balance updates across all views
- Comprehensive validations (dates, balances, deletions)
- Contextual UI elements (Receive vs Pay, directional notes)

**Status**: Completed (Day 4 - March 10, 2026)

---

### Phase 5: Frontend-Backend Integration ✅
**Focus**: Connect UI with APIs
- React Query setup ✅
- Custom hooks development ✅
- API integration for all features ✅
- State management ✅
- Error handling and loading states ✅

**Status**: Completed (Day 4 - March 10, 2026)
*Note: Phases 4 and 5 were combined for efficiency*

---

### Phase 6: Enhanced Features & Notifications
**Focus**: Advanced functionality and user experience improvements
- **Notification System**: Loan reminders, payment confirmations, due date alerts
- **Corner Case Handling**: Edge case validations, error recovery, data integrity checks
- **Enhanced UI/UX**: 
  * Improved mobile responsiveness
  * Loading skeletons and smooth transitions
  * Better empty states and error messages
  * Accessibility improvements (ARIA labels, keyboard navigation)

**Status**: Planned (Day 5-6)

---

### Phase 7: AI Integration & Smart Features 🤖
**Focus**: Intelligent money management assistance
- **AI-Powered Financial Advisor**:
  * Smart lending recommendations based on available balance
  * Warning system when available balance is low (prevent over-lending)
  * Monthly expense tracking and analysis
  * Spending pattern insights and predictions
  * Budget recommendations based on lending/borrowing history
- **Intelligent Notifications**:
  * Predictive loan due date reminders
  * Cash flow analysis and alerts
  * Spending anomaly detection
- **Smart Dashboard**:
  * AI-generated financial health score
  * Personalized money management tips
  * Trend analysis with visual insights

**Status**: Planned (Before Deployment)

---

### Phase 8: Testing & Quality Assurance
**Focus**: Comprehensive testing and refinement
- End-to-end testing (Playwright/Cypress)
- Unit and integration tests
- Performance optimization
- Cross-browser compatibility
- Security audit and penetration testing
- Bug fixes and edge case handling

**Status**: Planned (Day 7-8)

---

### Phase 9: Deployment & Production
**Focus**: Production deployment and monitoring
- Production build configuration
- Environment setup and secret management
- Backend deployment (Railway/Render/Heroku)
- Frontend deployment (Vercel/Netlify)
- Database optimization for production
- SSL/HTTPS configuration
- Production monitoring and logging
- Performance testing in production

**Status**: Planned (Day 9)

---

### Phase 10: Post-Launch Enhancements (Optional)
**Focus**: Additional features based on usage and feedback
- Data visualization (charts/graphs for spending trends)
- Advanced export functionality (CSV, PDF reports)
- Email/SMS integration for reminders
- Multi-currency support
- Dark mode and theme customization
- Collaborative features (shared wallets, joint loans)
- Mobile app development (React Native)
- Third-party integrations (banking APIs, payment gateways)

**Status**: Future Enhancement

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git
- Package manager (npm/yarn)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rinkhata.git
cd rinkhata
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file with required variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start development server:
```bash
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start development server:
```bash
npm run dev
```

### API Documentation
The backend provides RESTful APIs for:
- User authentication and authorization
- Wallet management
- Loan tracking and management
- Transaction history
- Statistical insights

For detailed API documentation, refer to the `docs/` folder or import the Postman collection from `docs/RinKhata-API-Collection.json`.

---

## � Project Status

### Current Progress
- ✅ Project architecture designed
- ✅ Backend infrastructure complete
- ✅ Database models implemented and seeded
- ✅ API endpoints (17+ tested and documented)
- ✅ Frontend UI development complete
- ✅ Frontend-Backend integration complete
- ⏳ Enhanced features (notifications, AI, corner cases)
- 🔜 Testing and quality assurance
- 🔜 Production deployment

### Metrics
- **Backend Endpoints**: 17+ REST APIs (fully tested)
- **Database Collections**: 4 core entities (Users, Wallets, Loans, Transactions)
- **Frontend Pages**: 5 core pages (Dashboard, Wallets, Loans, Transactions, Login)
- **Tech Stack**: MERN (MongoDB, Express, React, Node.js) + TypeScript
- **State Management**: TanStack Query (React Query v5)
- **Authentication**: JWT-based with secure token management

### What's Working
✅ User authentication (Login/Register with JWT)
✅ Multi-wallet system (Cash, Bank, MFS)
✅ Prevent duplicate cash wallets; balance is combined and cannot create multiple cash wallets
✅ Wallet type can be updated from frontend/backend
✅ Toast notification for cash wallet balance update
✅ Sidebar avatar dropdown for profile/logout
✅ Edit Profile page with avatar upload and real-time update
✅ Settings page added for account/theme management
✅ Dual-mode loan tracking (Lent and Borrowed)
✅ Partial payment processing with automatic balance updates
✅ Transaction history with filtering
✅ Real-time financial statistics and breakdowns
✅ Delete validations and data integrity checks
✅ Contextual UI (directional indicators, smart labels)

### Next Steps
🔜 Implement notification system for loan reminders
🔜 Add AI-powered financial recommendations
🔜 Enhance UI with animations and loading states
🔜 Comprehensive testing (unit, integration, E2E)
🔜 Production deployment with monitoring



---

**Last Updated**: March 11, 2026  
**Current Phase**: Day 5 - Enhanced Features & Notifications
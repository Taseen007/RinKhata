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

### Core Functionality
- **Dual-Mode Tracking**: Track both money lent and money borrowed
- **Partial Payments**: Support multiple partial settlements with automatic balance updates
- **Multi-Wallet System**: Manage multiple payment sources (Cash, Bank, Mobile Financial Services)
- **Transaction History**: Complete audit trail of all payments and loans
- **Smart Statistics**: Real-time insights into lending/borrowing patterns
- **Secure Authentication**: JWT-based user authentication and authorization

### Advanced Features (In Development)
- Visual analytics and charts for financial insights
- Loan reminder system with automated notifications
- Advanced search and filtering capabilities
- Mobile-responsive design
- Export data functionality

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

### Phase 4: Frontend UI Development
**Focus**: User interface implementation
- Dashboard with statistics
- Loan management interface
- Wallet management
- Transaction history view
- Authentication pages
- Component library creation

**Status**: Planned (Day 4)

---

### Phase 5: Frontend-Backend Integration
**Focus**: Connect UI with APIs
- React Query setup
- Custom hooks development
- API integration for all features
- State management
- Error handling and loading states

**Status**: Planned (Day 5)

---

### Phase 6: Testing & Refinement
**Focus**: Quality assurance and bug fixes
- End-to-end testing
- Bug identification and fixes
- Performance optimization
- Cross-browser compatibility
- Mobile responsiveness testing

**Status**: Planned (Day 6)

---

### Phase 7: Deployment
**Focus**: Production deployment
- Production build configuration
- Environment setup
- Backend deployment (Render)
- Frontend deployment (Netlify)
- Production testing

**Status**: Planned (Day 7)

---

### Phase 8: Advanced Features (Optional)
**Focus**: Enhancement and optimization
- Data visualization (charts/graphs)
- Notification system
- Email integration
- Dark mode support
- Additional features based on feedback

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
- ✅ Database models implemented
- ⏳ API endpoints (in testing)
- 🔜 Frontend UI development
- 🔜 Integration and deployment

### Metrics
- **Backend Endpoints**: 15+ REST APIs
- **Database Collections**: 4 core entities
- **Frontend Components**: 20+ (planned)
- **Tech Stack**: MERN (MongoDB, Express, React, Node.js)

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ using the MERN Stack

---

## 🙏 Acknowledgments

- Inspired by the need for better personal finance management tools
- Thanks to the open-source community for amazing libraries and frameworks
- Special mention to all contributors and testers

---

**Last Updated**: March 9, 2026
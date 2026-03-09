# RinKhata - System Architecture

## Overview
RinKhata is a full-stack MERN application for personal loan tracking with wallet integration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│              React + TypeScript + TanStack Query             │
│                       (Port: 5173)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ REST API (Axios)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                         Backend API                          │
│              Node.js + Express + TypeScript                  │
│                       (Port: 5000)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Mongoose ODM
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                        MongoDB                               │
│                  (Document Database)                         │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Authentication (Auth)
- User registration and login
- JWT token generation and validation
- Protected route middleware

### 2. User Management
- User profile management
- Avatar upload (future)
- Settings and preferences

### 3. Wallet System
- Multi-wallet support (Cash, Bank, MFS)
- Balance tracking
- Currency support

### 4. Loan Management
- Create and track loans
- Partial payment support
- Status management (Active/Settled)
- Progress calculation

### 5. Transaction Tracking
- All financial transactions
- Linked to loans and wallets
- Transaction history

### 6. Statistics & Analytics
- Dashboard stats
- Financial insights
- Visual charts (future)

## Module Interactions

```
User
 ├── Wallet (1:many)
 ├── Loan (1:many)
 └── Transaction (1:many)

Loan
 ├── Transaction (1:many)
 └── Wallet (linked via transactions)
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator

### DevOps
- **Version Control**: Git
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Database Hosting**: MongoDB Atlas

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Environment variable management

## Future Enhancements
- OAuth integration (Google, Facebook)
- Two-factor authentication
- File uploads (receipts, documents)
- Real-time notifications (WebSockets)
- Email notifications
- Mobile app (React Native)

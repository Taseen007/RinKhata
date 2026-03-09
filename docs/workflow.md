# RinKhata - Development Workflow

## Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git
- npm or yarn
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd RinKhata
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rinkhata
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
V ITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

## Development Commands

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Git Workflow

### Branch Strategy
```
main (production)
  └── develop (integration)
       ├── feature/loans
       ├── feature/wallet
       ├── feature/auth
       └── feature/frontend-ui
```

### Creating Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Committing Changes
```bash
git add .
git commit -m "feat: add loan creation feature"
```

### Commit Message Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### Merging to Develop
```bash
git checkout develop
git merge feature/your-feature-name
git push origin develop
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Database Management

### Local MongoDB
```bash
mongod --dbpath /path/to/data
```

### MongoDB Atlas
1. Create cluster
2. Get connection string
3. Add to `.env` as `MONGO_URI`

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

### Frontend (Netlify)
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
- Check MongoDB is running
- Verify connection string
- Check network access (Atlas)
- Verify IP whitelist (Atlas)

### CORS Errors
- Check backend CORS  configuration
- Verify API URL in frontend `.env`
- Check proxy settings in `vite.config.ts`

## Code Style

### TypeScript
- Use interfaces for object types
- Avoid `any` type
- Use strict mode

### React
- Functional components only
- Custom hooks for  logic reuse
- Props interface for each component

### Naming Conventions
- Components: PascalCase (`LoanCard.tsx`)
- Files: camelCase or kebab-case
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

## Performance Tips
- Use React Query for caching
- Implement pagination
- Lazy load routes
- Optimize images
- Minimize bundle size

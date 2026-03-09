# Docker Setup for RinKhata

## Docker Compose Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: rinkhata-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: rinkhata
    volumes:
      - mongodb_data:/data/db
    networks:
      - rinkhata-network

  # Backend API
  backend:
    build: ./backend
    container_name: rinkhata-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      MONGO_URI: mongodb://admin:password123@mongodb:27017/rinkhata?authSource=admin
      JWT_SECRET: your_jwt_secret_key_change_this
      NODE_ENV: production
    depends_on:
      - mongodb
    networks:
      - rinkhata-network

  # Frontend
  frontend:
    build: ./frontend
    container_name: rinkhata-frontend
    restart: always
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - rinkhata-network

volumes:
  mongodb_data:

networks:
  rinkhata-network:
    driver: bridge
```

## Dockerfile Examples

### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Docker Commands

### Build and Run
```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Individual Services
```bash
# Build specific service
docker-compose build backend

# Start specific service
docker-compose up backend

# View logs
docker-compose logs -f backend
```

### Useful Commands
```bash
# List running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh

# View logs
docker-compose logs

# Restart service
docker-compose restart backend
```

## MongoDB with Docker

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

### Backup Database
```bash
docker-compose exec mongodb mongodump --out /tmp/backup
docker cp rinkhata-mongodb:/tmp/backup ./backup
```

### Restore Database
```bash
docker cp ./backup rinkhata-mongodb:/tmp/backup
docker-compose exec mongodb mongorestore /tmp/backup
```

## Environment Variables

Create `.env` file in root:
```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=rinkhata

# Backend
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

### AWS ECS
1. Build images
2. Push to ECR
3. Create task definition
4. Deploy service

### Digital Ocean
1. Use App Platform
2. Connect GitHub repo
3. Set environment variables
4. Deploy

### Railway
1. Connect GitHub repo
2. Add MongoDB plugin
3. Set environment variables
4. Deploy

## Troubleshooting

### Container Won't Start
```bash
docker-compose logs backend
docker-compose ps
```

### Network Issues
```bash
docker network ls
docker network inspect rinkhata-network
```

### Clear Everything
```bash
docker-compose down -v --remove-orphans
docker system prune -a
```

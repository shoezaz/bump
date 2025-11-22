# Watch Passport - Quick Start Guide 🚀

Get the Watch Passport platform running locally in minutes!

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker & Docker Compose** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git**

## Option 1: Docker (Recommended) 🐳

The fastest way to get started. Everything runs in containers.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd bump

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be healthy (~30 seconds)
docker-compose ps

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

### Docker Services

- **PostgreSQL** (port 5432) - Main database
- **Redis** (port 6379) - Cache & sessions
- **Backend** (port 3001) - NestJS API
- **Frontend** (port 3000) - React app

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## Option 2: Manual Setup 🛠️

For development or if you prefer running services locally.

### Step 1: Database Setup

```bash
# Install and start PostgreSQL 15+
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15
sudo systemctl start postgresql

# Create database
createdb watch_passport

# Run migrations
psql -d watch_passport -f database/schema.sql

# (Optional) Load sample data
psql -d watch_passport -f database/seed.sql
```

### Step 2: Redis Setup

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run start:dev

# API will be available at http://localhost:3001
# Swagger docs at http://localhost:3001/api/docs
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# App will be available at http://localhost:3000
```

## Default Login Credentials 🔑

Sample data includes these test accounts:

```
Email: collector@example.com
Password: password123

Email: dealer@example.com
Password: password123

Email: expert@example.com
Password: password123
```

## Verify Installation ✅

### 1. Check Backend Health

```bash
curl http://localhost:3001/api
# Should return: {"status":"ok","message":"Watch Passport API is running"}
```

### 2. Check Database

```bash
psql -d watch_passport -c "SELECT COUNT(*) FROM users;"
# Should show: 3 (sample users)
```

### 3. Test Frontend

- Navigate to http://localhost:3000
- You should see the login page
- Login with sample credentials
- Dashboard should show sample watches

## Project Structure 📁

```
watch-passport/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/    # Zustand state management
│   │   ├── lib/       # API client, utils
│   │   └── hooks/     # Custom React hooks
│   └── package.json
│
├── backend/            # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── watches/
│   │   ├── transfers/
│   │   ├── reports/
│   │   └── common/    # Middleware, guards, etc.
│   └── package.json
│
├── database/           # SQL schemas
│   ├── schema.sql     # Database structure
│   ├── seed.sql       # Sample data
│   └── README.md
│
├── docs/               # Documentation
│   └── TECHNICAL_ARCHITECTURE.md
│
├── docker-compose.yml  # Docker orchestration
└── README.md
```

## Development Commands 🔧

### Frontend

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Lint code
npm run typecheck    # Type checking
```

### Backend

```bash
cd backend
npm run start:dev    # Start dev server (watch mode)
npm run build        # Production build
npm run start:prod   # Start production server
npm run lint         # Lint code
npm run test         # Run tests
```

## Common Issues & Solutions 🔍

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000  # or :3001, :5432, :6379

# Kill the process
kill -9 <PID>
```

### Database Connection Error

```bash
# Ensure PostgreSQL is running
pg_isready

# Check connection
psql -d watch_passport -c "SELECT 1"

# Verify credentials in .env file
```

### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if not running
redis-server
```

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Fresh start
docker-compose down -v
docker-compose up -d --build
```

## Next Steps 📚

1. **Read Documentation**
   - [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
   - [API Documentation](http://localhost:3001/api/docs) (when backend is running)

2. **Explore Features**
   - Add a watch to your collection
   - Try the QR transfer system
   - View watch history

3. **Development**
   - Check the [GitHub Issues](../../issues) for tasks
   - Review the MVP Roadmap in README.md

4. **Production Deployment**
   - Set up environment variables
   - Configure SSL/TLS
   - Set up monitoring (Sentry)
   - Configure backups

## Need Help? 🆘

- **Documentation**: Check `/docs` folder
- **API Reference**: http://localhost:3001/api/docs
- **Issues**: Create a GitHub issue
- **Email**: support@watchpassport.com (if configured)

---

**Happy Coding!** 🎉

Built with ❤️ for watch collectors worldwide

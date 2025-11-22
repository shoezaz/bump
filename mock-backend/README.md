# Watch Passport Mock Backend 🎭

Mock API backend for Watch Passport with demo data for testing and development.

## 🎯 Demo Credentials

```
Email: demo@watchpassport.com
Password: demo123
```

## 🚀 Quick Start

### Local Development

```bash
cd mock-backend
npm install
npm start
```

The API will be available at `http://localhost:3001`

### Deploy to Vercel

```bash
cd mock-backend
vercel
```

Or use the Vercel dashboard to import this directory.

## 📋 Available Endpoints

### Authentication
- `POST /api/auth/login` - Login with demo credentials
- `POST /api/auth/register` - Register new user

### Watches
- `GET /api/watches` - Get all watches
- `GET /api/watches/:id` - Get watch by ID
- `GET /api/watches/serial/:serialNumber` - Get watch by serial number
- `POST /api/watches` - Create new watch
- `PUT /api/watches/:id` - Update watch
- `GET /api/watches/:id/history` - Get watch history
- `POST /api/watches/:id/history` - Add history event

### Transfers
- `GET /api/transfers` - Get all transfers
- `GET /api/transfers/:id` - Get transfer by ID
- `GET /api/transfers/token/:token` - Get transfer by token
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/:id/status` - Update transfer status

### Reports
- `GET /api/reports` - Get all stolen reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/watch/:watchId` - Get reports by watch
- `POST /api/reports` - Create stolen report
- `PUT /api/reports/:id` - Update report

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

## 📦 Demo Data

The mock backend includes:
- **2 demo users** (demo@watchpassport.com and collector@example.com)
- **3 luxury watches** (Rolex Submariner, Patek Philippe Nautilus, Audemars Piguet Royal Oak)
- **Watch history events**
- **Pending transfers**

## 🔒 Authentication

All endpoints except `/api/auth/*` require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

Login to get a token that expires in 7 days.

## 🌍 Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT signing (default: demo-secret-key-change-in-production)

## 📝 Notes

- This is a **mock backend** for demo purposes only
- Data is stored in memory and resets on server restart
- Not suitable for production use
- CORS is enabled for all origins

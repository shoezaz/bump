# Watch Passport 🕰️

A secure luxury watch authentication and ownership tracking platform leveraging blockchain technology.

## 🎯 Project Overview

Watch Passport is a fintech application that provides authentication, ownership tracking, and anti-fraud protection for luxury watches. The platform enables collectors, dealers, and experts to verify watch authenticity, track ownership history, and report stolen items through a blockchain-backed immutable record system.

## 🏗️ Architecture

```
watch-passport/
├── frontend/          # React + TypeScript SPA
├── backend/           # NestJS API server
├── database/          # PostgreSQL schemas & migrations
└── docs/              # Technical documentation
```

## ✨ Core Features

### 1. Watch Authentication & Registration
- Serial number verification with OCR support
- Anti-counterfeit validation against known patterns
- Blockchain registration for immutable records
- Document upload (certificates, receipts, appraisals)

### 2. Ownership Tracking
- Complete ownership history timeline
- Service records and modifications
- Expert verifications
- Transfer tracking with audit trail

### 3. Secure Transfer System
- QR code-based ownership transfers (2-minute expiration)
- Real-time transfer status monitoring
- Multi-factor verification
- Buyer/seller identity confirmation

### 4. Stolen Watch Protection
- Instant blockchain-recorded stolen reports
- Network-wide dealer notifications
- Manufacturer alerts
- Interpol integration ready

### 5. KYC & Security
- Identity verification (Onfido/Jumio integration)
- User reputation system
- Fraud detection algorithms
- Rate limiting and anti-abuse measures

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **State Management**: Zustand + TanStack Query
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui
- **QR Codes**: qrcode.react
- **Camera**: react-webcam (for QR scanning)

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL 15+
- **Cache**: Redis
- **Queue**: BullMQ
- **Auth**: JWT + Refresh Tokens
- **API Docs**: Swagger/OpenAPI

### Infrastructure
- **Hosting**: AWS / Vercel
- **CDN**: CloudFlare
- **Storage**: AWS S3 / Cloudinary
- **Monitoring**: Sentry
- **Analytics**: PostHog

### Security
- **KYC**: Onfido SDK
- **SSL**: Let's Encrypt
- **Rate Limiting**: express-rate-limit
- **Encryption**: bcrypt, crypto

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

### Development

```bash
# Frontend only (port 3000)
pnpm dev:frontend

# Backend only (port 3001)
pnpm dev:backend

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts with KYC status
- `watches` - Watch registry with blockchain hashes
- `watch_history` - Complete event timeline
- `transfers` - Ownership transfer records
- `stolen_reports` - Theft reports with blockchain proof

See [database/schema.sql](database/schema.sql) for full schema.

## 🔐 Security Features

1. **QR Transfer Security**
   - Time-limited tokens (2 minutes)
   - One-time use with Redis tracking
   - JWT-signed payloads
   - IP validation

2. **Anti-Fraud**
   - Serial number duplicate detection
   - Stolen watch database checks
   - Pattern validation per brand
   - Suspicious activity flagging

3. **Data Protection**
   - End-to-end encryption for sensitive data
   - Secure document storage
   - PII compliance (GDPR ready)
   - Audit logging

## 🗺️ MVP Roadmap

### Month 1: Core Infrastructure ✅
- [x] Backend API setup
- [x] Database schema
- [x] Authentication system
- [ ] KYC integration
- [ ] Document storage

### Month 2: Watch Management
- [ ] Watch registration flow
- [ ] OCR implementation
- [ ] History tracking
- [ ] QR code system
- [ ] Search functionality

### Month 3: Transfers & Security
- [ ] Transfer workflow
- [ ] Stolen report system
- [ ] Email notifications
- [ ] Blockchain integration

### Month 4: Polish & Launch
- [ ] Dealer dashboard
- [ ] Public profiles
- [ ] Mobile optimization
- [ ] Security audit
- [ ] Beta testing

## 📝 API Documentation

API documentation is available at `/api/docs` when running the backend in development mode.

Key endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /watches` - List watches
- `POST /watches` - Register new watch
- `POST /transfers/initiate` - Start transfer
- `POST /reports/stolen` - Report stolen watch

## 🧪 Testing

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## 📄 License

Proprietary - All rights reserved

## 👥 Team

- **Product**: [Your Name]
- **Backend**: [Team Member]
- **Frontend**: [Team Member]
- **Security**: [Team Member]

## 📞 Support

For issues and questions:
- Email: support@watchpassport.com
- Docs: https://docs.watchpassport.com
- Status: https://status.watchpassport.com

---

Built with ❤️ for watch collectors worldwide

# Watch Passport - Technical Architecture

## System Overview

Watch Passport is a full-stack TypeScript application for luxury watch authentication and ownership tracking. The system uses blockchain-inspired immutable records to prevent fraud and maintain provenance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  React 19 + TypeScript + Tailwind CSS + Zustand             │
│  - Mobile-first responsive design                            │
│  - QR code generation/scanning                               │
│  - Real-time updates via WebSocket (planned)                 │
└──────────────────┬──────────────────────────────────────────┘
                   │ REST API / GraphQL (planned)
┌──────────────────▼──────────────────────────────────────────┐
│                     Backend Layer                            │
│  NestJS + TypeScript + TypeORM                               │
│  - RESTful API with Swagger docs                             │
│  - JWT authentication                                        │
│  - Business logic & validation                               │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL Queries
┌──────────────────▼──────────────────────────────────────────┐
│                   Data Layer                                 │
│  PostgreSQL 15+                                              │
│  - Relational data with ACID guarantees                      │
│  - JSONB for flexible metadata                               │
│  - Full-text search (planned)                                │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│               External Services                              │
│  - Redis (caching, sessions)                                 │
│  - AWS S3 (document storage)                                 │
│  - Blockchain (provenance immutability)                      │
│  - KYC Provider (Onfido/Jumio)                               │
│  - Email Service (SendGrid/AWS SES)                          │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **State Management**:
  - Zustand (client state)
  - TanStack Query (server state)
- **Routing**: React Router 7
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom components with Lucide icons
- **QR Codes**: qrcode.react
- **Notifications**: react-hot-toast

### Backend
- **Framework**: NestJS 10
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.7
- **ORM**: TypeORM 0.3
- **Authentication**: Passport + JWT
- **API Docs**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

### Database
- **RDBMS**: PostgreSQL 15+
- **Schema**: Relational with JSONB for flexibility
- **Migrations**: TypeORM migrations
- **Indexing**: Strategic indexes on serial numbers, owners, status

### Infrastructure (Planned)
- **Hosting**: AWS / Vercel
- **CDN**: CloudFlare
- **Caching**: Redis 7+
- **Queue**: BullMQ
- **Monitoring**: Sentry
- **Analytics**: PostHog

## Database Schema

### Core Tables

#### users
```sql
- id (UUID, PK)
- email (unique)
- password (hashed)
- kyc_status (pending/verified/rejected)
- user_type (collector/dealer/expert)
- reputation_score
- city, country_code
```

#### watches
```sql
- id (UUID, PK)
- serial_number (unique)
- brand, model, reference
- year, current_value, purchase_price
- status (certified/warning/stolen/modified)
- blockchain_hash
- current_owner_id (FK -> users)
```

#### watch_history
```sql
- id (UUID, PK)
- watch_id (FK -> watches)
- event_type (purchase/service/transfer/alert/stolen_report)
- event_date, description
- entity_name, entity_id (FK -> users)
- documents (JSONB)
- blockchain_hash
```

#### transfers
```sql
- id (UUID, PK)
- watch_id (FK -> watches)
- from_user_id, to_user_id (FK -> users)
- status (pending/accepted/rejected/expired)
- qr_token (unique, 2-minute expiration)
- blockchain_tx_hash
```

#### stolen_reports
```sql
- id (UUID, PK)
- watch_id (FK -> watches)
- reported_by_id (FK -> users)
- theft_date, police_reference, location
- status (active/recovered/closed)
- blockchain_tx_hash
- interpol_notified, manufacturers_notified
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token (planned)

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Watches
- `GET /api/watches` - List watches (with optional owner filter)
- `GET /api/watches/:id` - Get watch details
- `GET /api/watches/serial/:serialNumber` - Find by serial number
- `POST /api/watches` - Register new watch
- `PUT /api/watches/:id` - Update watch
- `GET /api/watches/:id/history` - Get watch history
- `POST /api/watches/:id/history` - Add history event

### Transfers
- `GET /api/transfers` - List transfers
- `GET /api/transfers/:id` - Get transfer by ID
- `GET /api/transfers/token/:token` - Get transfer by QR token
- `POST /api/transfers` - Initiate transfer
- `PUT /api/transfers/:id/status` - Update transfer status

### Reports
- `GET /api/reports` - List stolen reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/watch/:watchId` - Get reports for a watch
- `POST /api/reports` - Create stolen report
- `PUT /api/reports/:id` - Update report status

## Security Measures

### Authentication & Authorization
1. **JWT Tokens**: 7-day access tokens, 30-day refresh tokens
2. **Password Hashing**: bcrypt with salt rounds = 10
3. **Role-Based Access**: Collector, Dealer, Expert roles
4. **KYC Verification**: Mandatory for high-value operations

### Data Security
1. **Encryption at Rest**: Database-level encryption
2. **Encryption in Transit**: TLS 1.3
3. **Input Validation**: class-validator on all DTOs
4. **SQL Injection Prevention**: Parameterized queries via TypeORM
5. **XSS Protection**: React's built-in escaping + Content Security Policy

### Anti-Fraud
1. **Serial Number Validation**: Brand-specific format checks
2. **Duplicate Detection**: Unique constraints + active monitoring
3. **Stolen Watch Database**: Real-time checks before transfer
4. **QR Token Security**: 2-minute expiration, one-time use, JWT-signed

### Blockchain Integration
- **Purpose**: Immutable audit trail, provenance proof
- **Implementation**: Hybrid approach
  - MVP: Append-only PostgreSQL log
  - Production: Ethereum/Polygon smart contracts
- **Data Stored**: Event hashes, not full data (privacy)
- **Verification**: Public verification endpoint

## Scalability Considerations

### Performance
1. **Database Indexing**: Serial numbers, owner IDs, status fields
2. **Caching Strategy**: Redis for:
   - User sessions
   - Watch lookups (5-minute TTL)
   - Transfer tokens (2-minute TTL)
3. **Pagination**: Default 20 items, max 100
4. **Rate Limiting**: 100 requests/minute per IP

### Horizontal Scaling
1. **Stateless Backend**: JWT-based auth, no server-side sessions
2. **Database Replication**: Read replicas for analytics
3. **CDN**: Static assets via CloudFlare
4. **Queue System**: BullMQ for async tasks (notifications, blockchain writes)

## Monitoring & Observability

### Logging
- **Application Logs**: Winston (JSON format)
- **Access Logs**: Morgan middleware
- **Error Tracking**: Sentry integration

### Metrics
- **API Performance**: Response times, error rates
- **Database**: Query performance, connection pool
- **Business Metrics**: Transfers/day, new watches, fraud detections

### Alerts
- **Critical**: Database down, API 5xx > 1%
- **Warning**: Slow queries > 2s, failed transfers
- **Info**: Daily summary, new stolen reports

## Development Workflow

### Local Setup
```bash
# Install dependencies
npm run install:all

# Start PostgreSQL
docker-compose up -d postgres

# Run migrations
cd backend && npm run migration:run

# Start dev servers
npm run dev
```

### Testing Strategy
1. **Unit Tests**: Jest for business logic
2. **Integration Tests**: Supertest for API endpoints
3. **E2E Tests**: Playwright (planned)
4. **Coverage Target**: 80%+

### CI/CD Pipeline (Planned)
1. **Linting**: ESLint + Prettier
2. **Type Checking**: TypeScript strict mode
3. **Tests**: Unit + Integration
4. **Build**: Production builds
5. **Deploy**: Vercel (frontend) + AWS (backend)

## Future Enhancements

### Phase 2 (Months 5-8)
- [ ] Mobile apps (React Native)
- [ ] WebSocket real-time updates
- [ ] GraphQL API
- [ ] Advanced search (full-text, filters)
- [ ] Multi-language support

### Phase 3 (Months 9-12)
- [ ] AI-powered fraud detection
- [ ] OCR for automatic serial number extraction
- [ ] Integration with manufacturer APIs
- [ ] Insurance partnerships
- [ ] Marketplace features (escrow)

### Phase 4 (Year 2)
- [ ] NFT certificates (optional)
- [ ] AR watch visualization
- [ ] Community features (forums, reviews)
- [ ] White-label solution for dealers
- [ ] API for third-party integrations

---

**Document Version**: 1.0
**Last Updated**: 2025-11-22
**Author**: Watch Passport Team

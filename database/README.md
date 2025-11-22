# Database Setup

## PostgreSQL Database for Watch Passport

### Prerequisites

- PostgreSQL 15 or higher
- `psql` command-line tool

### Quick Setup

1. **Create Database**

```bash
createdb watch_passport
```

2. **Run Schema**

```bash
psql -d watch_passport -f schema.sql
```

3. **Load Sample Data** (Optional)

```bash
psql -d watch_passport -f seed.sql
```

### Environment Variables

Make sure your backend `.env` file has the correct database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=watch_passport
```

### Database Schema Overview

#### Tables

1. **users** - User accounts with KYC information
2. **watches** - Watch registry with ownership tracking
3. **watch_history** - Complete event timeline for each watch
4. **transfers** - Ownership transfer records
5. **stolen_reports** - Theft reports with blockchain proof

#### Key Relationships

- A user can own multiple watches (`users` → `watches`)
- Each watch has a complete history (`watches` → `watch_history`)
- Transfers link watches between users (`transfers` ↔ `watches`, `users`)
- Stolen reports are tied to specific watches (`stolen_reports` → `watches`)

### Migrations

For production, use TypeORM migrations:

```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
```

### Backup & Restore

**Backup:**
```bash
pg_dump watch_passport > backup.sql
```

**Restore:**
```bash
psql watch_passport < backup.sql
```

### Security Notes

1. Never commit real credentials to version control
2. Use strong passwords for production databases
3. Enable SSL/TLS for remote connections
4. Regularly backup your database
5. Implement row-level security for multi-tenant scenarios

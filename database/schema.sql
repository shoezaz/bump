-- Watch Passport Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_verified_at TIMESTAMP,
  user_type VARCHAR(20) DEFAULT 'collector' CHECK (user_type IN ('collector', 'dealer', 'expert')),
  reputation_score INTEGER DEFAULT 0,
  city VARCHAR(100),
  country_code CHAR(2),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watches Table
CREATE TABLE IF NOT EXISTS watches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(200) NOT NULL,
  reference VARCHAR(100),
  year INTEGER,
  current_value DECIMAL(10, 2),
  purchase_price DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'certified' CHECK (status IN ('certified', 'warning', 'stolen', 'modified')),
  blockchain_hash VARCHAR(256),
  image_url VARCHAR(500),
  current_owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watch History Table
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  watch_id UUID REFERENCES watches(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('purchase', 'service', 'transfer', 'modification', 'alert', 'stolen_report')),
  event_date DATE NOT NULL,
  description TEXT,
  entity_name VARCHAR(200),
  entity_id UUID REFERENCES users(id) ON DELETE SET NULL,
  documents JSONB,
  blockchain_hash VARCHAR(256),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transfers Table
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  watch_id UUID REFERENCES watches(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  qr_token VARCHAR(256) UNIQUE NOT NULL,
  qr_expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  blockchain_tx_hash VARCHAR(256),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stolen Reports Table
CREATE TABLE IF NOT EXISTS stolen_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  watch_id UUID REFERENCES watches(id) ON DELETE CASCADE,
  reported_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  theft_date DATE NOT NULL,
  police_reference VARCHAR(200),
  location VARCHAR(300),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'recovered', 'closed')),
  blockchain_tx_hash VARCHAR(256) NOT NULL,
  interpol_notified BOOLEAN DEFAULT FALSE,
  manufacturers_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_watches_serial ON watches(serial_number);
CREATE INDEX idx_watches_owner ON watches(current_owner_id);
CREATE INDEX idx_watches_status ON watches(status);
CREATE INDEX idx_history_watch ON watch_history(watch_id);
CREATE INDEX idx_transfers_watch ON transfers(watch_id);
CREATE INDEX idx_transfers_token ON transfers(qr_token);
CREATE INDEX idx_reports_watch ON stolen_reports(watch_id);
CREATE INDEX idx_users_email ON users(email);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watches_updated_at BEFORE UPDATE ON watches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

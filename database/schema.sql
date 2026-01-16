-- Schema for Mahber Iddir Management System

CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE members (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TREASURER', 'SECRETARY', 'COMMUNITY_SERVICE', 'MEMBER', 'GUEST')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    avatar_url TEXT,
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    password_hash VARCHAR(255), -- Storing hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CONTRIBUTION', 'EXPENSE', 'PENALTY', 'CLAIM_PAYOUT')),
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claims (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('FUNERAL', 'MEDICAL', 'WEDDING', 'OTHER')),
    description TEXT NOT NULL,
    amount_requested DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    date_filed DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery_items (
    id VARCHAR(50) PRIMARY KEY,
    url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_transactions_status ON transactions(status);

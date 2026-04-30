-- ─────────────────────────────────────────
-- Car ERP — Full Schema (v2)
-- Run once on a fresh DB, or use Sequelize sync({ alter: true }) for updates
-- ─────────────────────────────────────────

-- Roles Table (legacy lookup table — kept for backward compatibility)
CREATE TABLE IF NOT EXISTS roles (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Users Table (upgraded with phone, role ENUM, status, department)
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(100)  UNIQUE NOT NULL,
    password    VARCHAR(255)  NOT NULL,
    phone       VARCHAR(20)   NOT NULL DEFAULT '',
    role        VARCHAR(20)   NOT NULL DEFAULT 'USER'
                  CHECK (role IN ('SUPER_ADMIN','ADMIN','MANAGER','DELIVERY','USER')),
    status      VARCHAR(10)   NOT NULL DEFAULT 'ACTIVE'
                  CHECK (status IN ('ACTIVE','INACTIVE')),
    department  VARCHAR(100)  DEFAULT NULL,
    role_id     INTEGER       REFERENCES roles(id),   -- legacy FK
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    contact_person  VARCHAR(100),
    phone           VARCHAR(20),
    email           VARCHAR(100),
    address         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    unit        VARCHAR(20),
    stock       DECIMAL(12,2) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id              SERIAL PRIMARY KEY,
    material_id     INTEGER REFERENCES materials(id),
    quantity        DECIMAL(10,2) DEFAULT 0,
    min_stock_level DECIMAL(10,2) DEFAULT 10,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    phone      VARCHAR(20),
    email      VARCHAR(100),
    address    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id           SERIAL PRIMARY KEY,
    customer_id  INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    status       VARCHAR(50)  DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING','IN_PROGRESS','SHIPPED','DELIVERED','CANCELLED')),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    id                   SERIAL PRIMARY KEY,
    order_id             INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    delivery_person_id   INTEGER REFERENCES users(id),
    delivery_person_name VARCHAR(100),
    delivery_status      VARCHAR(50) DEFAULT 'READY'
                           CHECK (delivery_status IN ('READY','DISPATCHED','DELIVERED')),
    delivery_date        DATE,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Orders Table
CREATE TABLE IF NOT EXISTS production_orders (
    id           SERIAL PRIMARY KEY,
    order_id     INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    assigned_to  INTEGER REFERENCES users(id),   -- assigned manager
    status       VARCHAR(50) DEFAULT 'IN_PROGRESS'
                   CHECK (status IN ('IN_PROGRESS','COMPLETED','CANCELLED')),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Items (Materials used in production)
CREATE TABLE IF NOT EXISTS production_items (
    id            SERIAL PRIMARY KEY,
    production_id INTEGER NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
    material_id   INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    quantity      DECIMAL(12,2) NOT NULL CHECK (quantity > 0)
);

-- Manufacturing Stages Table
CREATE TABLE IF NOT EXISTS manufacturing (
    id                  SERIAL PRIMARY KEY,
    production_order_id INTEGER NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
    stage               VARCHAR(50) NOT NULL,   -- Assembly, Painting, Testing
    status              VARCHAR(50) DEFAULT 'IN_PROGRESS'
                          CHECK (status IN ('IN_PROGRESS','COMPLETED')),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id          SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    quantity    DECIMAL(12,2) NOT NULL CHECK (quantity > 0),
    price       DECIMAL(12,2) NOT NULL CHECK (price > 0),
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * price) STORED,
    status      VARCHAR(20) DEFAULT 'PENDING'
                  CHECK (status IN ('PENDING','RECEIVED','CANCELLED')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id         SERIAL PRIMARY KEY,
    key        VARCHAR(100) UNIQUE NOT NULL,
    value      TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- SEED: Default Roles (legacy table)
-- ─────────────────────────────────────────
INSERT INTO roles (name) VALUES
  ('SUPER_ADMIN'),
  ('ADMIN'),
  ('MANAGER'),
  ('DELIVERY'),
  ('USER')
ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────
-- SEED: Default System Settings
-- ─────────────────────────────────────────
INSERT INTO system_settings (key, value) VALUES
  ('app_name',         'Car ERP'),
  ('low_stock_threshold', '10'),
  ('currency',         'INR'),
  ('timezone',         'Asia/Kolkata')
ON CONFLICT (key) DO NOTHING;

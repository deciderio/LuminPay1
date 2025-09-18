-- init.sql
-- Base de datos inicial para LuminaPay

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    kyc_verified INTEGER DEFAULT 0, -- 0 = no, 1 = sí
    created_at TEXT DEFAULT (datetime('now'))
);

-- Tabla de agentes (opcional si manejas agentes separados)
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    balance REAL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tabla de wallets
CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    balance REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tabla de payment pointers
CREATE TABLE IF NOT EXISTS payment_pointers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    pointer TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_wallet_id INTEGER NOT NULL,
    to_pointer TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(from_wallet_id) REFERENCES wallets(id)
);

-- Tabla de conectores (opcional, para controlar liquidez)
CREATE TABLE IF NOT EXISTS connector_balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connector_name TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    balance REAL DEFAULT 0,
    last_updated TEXT DEFAULT (datetime('now'))
);

-- Tabla de transfers pendientes (si quieres trackear operaciones en curso)
CREATE TABLE IF NOT EXISTS pending_ilp_transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_wallet_id INTEGER NOT NULL,
    to_pointer TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(from_wallet_id) REFERENCES wallets(id)
);

-- Tabla de historial de transacciones ILP
CREATE TABLE IF NOT EXISTS ilp_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_wallet_id INTEGER NOT NULL,
    to_wallet_id INTEGER,
    to_pointer TEXT,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    executed_at TEXT,
    FOREIGN KEY(from_wallet_id) REFERENCES wallets(id)
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_pointers_user ON payment_pointers(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(from_wallet_id);

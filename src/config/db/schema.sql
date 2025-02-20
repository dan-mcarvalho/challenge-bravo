CREATE TABLE IF NOT EXISTS currencies(
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    exchange_rate NUMERIC  NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
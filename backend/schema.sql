
-- TrendAI Crypto database schema
-- PostgreSQL

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analysis_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paper_trades (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) NOT NULL,
    side VARCHAR(4) NOT NULL
        CHECK (side IN ('BUY', 'SELL')),
    quantity NUMERIC(24, 10) NOT NULL
        CHECK (quantity > 0),
    price_usdt NUMERIC(24, 10) NOT NULL
        CHECK (price_usdt >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_user_created
    ON analysis_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_paper_trades_user_created
    ON paper_trades(user_id, created_at DESC);

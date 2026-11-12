-- TAXI TIME Finance D1 schema V1.0
-- Run only against taxitime-finance-db, not other databases.
CREATE TABLE IF NOT EXISTS driver_accounts (
 driver_id TEXT PRIMARY KEY,
 deposit_cents INTEGER NOT NULL DEFAULT 0 CHECK(deposit_cents >= 0),
 debt_cents INTEGER NOT NULL DEFAULT 0 CHECK(debt_cents >= 0),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS driver_offers (
 id TEXT PRIMARY KEY,
 driver_id TEXT NOT NULL,
 origin TEXT NOT NULL,
 destination TEXT NOT NULL,
 driver_price_cents INTEGER NOT NULL CHECK(driver_price_cents > 0),
 commission_cents INTEGER NOT NULL CHECK(commission_cents >= 0),
 passenger_price_cents INTEGER NOT NULL CHECK(passenger_price_cents >= driver_price_cents),
 departure_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','matched','cancelled','expired')),
 matched_order_id TEXT UNIQUE,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_driver_offers_status_departure ON driver_offers(status,departure_at);
CREATE INDEX IF NOT EXISTS idx_driver_offers_driver ON driver_offers(driver_id);
CREATE TABLE IF NOT EXISTS commission_ledger (
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL UNIQUE,
 driver_id TEXT NOT NULL,
 commission_cents INTEGER NOT NULL CHECK(commission_cents >= 0),
 deposit_deducted_cents INTEGER NOT NULL CHECK(deposit_deducted_cents >= 0),
 debt_added_cents INTEGER NOT NULL CHECK(debt_added_cents >= 0),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(deposit_deducted_cents + debt_added_cents = commission_cents)
);
CREATE INDEX IF NOT EXISTS idx_commission_driver ON commission_ledger(driver_id,created_at);
CREATE TABLE IF NOT EXISTS deposit_ledger (
 id TEXT PRIMARY KEY,
 payment_reference TEXT NOT NULL UNIQUE,
 driver_id TEXT NOT NULL,
 admin_id TEXT NOT NULL,
 amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
 debt_repaid_cents INTEGER NOT NULL CHECK(debt_repaid_cents >= 0),
 deposit_added_cents INTEGER NOT NULL CHECK(deposit_added_cents >= 0),
 note TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(debt_repaid_cents + deposit_added_cents = amount_cents)
);
CREATE INDEX IF NOT EXISTS idx_deposit_driver ON deposit_ledger(driver_id,created_at);

-- Optional performance indexes; run one statement at a time in D1 Console.
-- Safe for existing tables; does not modify balances or orders.
CREATE INDEX IF NOT EXISTS idx_driver_offers_status_departure ON driver_offers(status,departure_at);
CREATE INDEX IF NOT EXISTS idx_driver_offers_driver ON driver_offers(driver_id);
CREATE INDEX IF NOT EXISTS idx_commission_driver ON commission_ledger(driver_id,created_at);
CREATE INDEX IF NOT EXISTS idx_deposit_driver ON deposit_ledger(driver_id,created_at);

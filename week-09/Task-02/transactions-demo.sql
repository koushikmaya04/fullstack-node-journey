-- Week 09 / Task 02: PostgreSQL transactions and basic indexing
--
-- Prerequisite:
--   Run week-09/Task-01/ecommerce-schema.sql in a disposable database first.
--
-- Run:
--   psql -d ecommerce_db -f transactions-demo.sql
--
-- This exercise changes only the dedicated ecommerce schema.
-- The intentional constraint error in Part 2 is expected. ON_ERROR_STOP is
-- disabled so psql continues to the ROLLBACK and displays the restored state.

\set ON_ERROR_STOP off

SET search_path TO ecommerce, public;

-- ============================================================
-- Part 1: Add stock and useful indexes to the Week 9 schema
-- ============================================================

ALTER TABLE ecommerce.products
    ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 100
    CHECK (stock_quantity >= 0);

-- The schema already has a UNIQUE index on products.sku and a composite
-- primary-key index on order_items(order_id, product_id).
-- These indexes support common lookup and reporting patterns.
CREATE INDEX IF NOT EXISTS idx_products_name
    ON ecommerce.products(product_name);

CREATE INDEX IF NOT EXISTS idx_orders_status_date
    ON ecommerce.orders(status, order_date DESC);

-- A composite index can support queries filtering by user and sorting by date.
-- Task 01 already creates idx_orders_user_date; this statement is intentionally
-- idempotent and documents the index used in the exercise.
CREATE INDEX IF NOT EXISTS idx_orders_user_date
    ON ecommerce.orders(user_id, order_date DESC);

ANALYZE ecommerce.products;
ANALYZE ecommerce.orders;

-- ============================================================
-- Part 2: Demonstrate a failed stock transfer and ROLLBACK
-- ============================================================

\echo '--- Stock before the transaction ---'
SELECT product_id, product_name, stock_quantity
FROM ecommerce.products
WHERE product_id IN (101, 102)
ORDER BY product_id;

-- Intended transfer: move 10 units from product 101 to product 102.
BEGIN;

UPDATE ecommerce.products
SET stock_quantity = stock_quantity - 10
WHERE product_id = 101;

UPDATE ecommerce.products
SET stock_quantity = stock_quantity + 10
WHERE product_id = 102;

-- Deliberate failure:
-- stock_quantity has a CHECK constraint requiring a value >= 0.
-- This statement attempts to violate that rule. PostgreSQL marks the
-- transaction as failed; the next ROLLBACK undoes BOTH valid updates above.
UPDATE ecommerce.products
SET stock_quantity = -1
WHERE product_id = 101;

-- Expected output immediately above: CHECK constraint violation.
-- Expected result here: ROLLBACK. No part of the transfer is persisted.
ROLLBACK;

\echo '--- Stock after ROLLBACK (must match the before values) ---'
SELECT product_id, product_name, stock_quantity
FROM ecommerce.products
WHERE product_id IN (101, 102)
ORDER BY product_id;

-- ============================================================
-- Part 3: Demonstrate a successful transaction (COMMIT)
-- ============================================================

\echo '--- Successful transfer: stock before ---'
SELECT product_id, product_name, stock_quantity
FROM ecommerce.products
WHERE product_id IN (101, 102)
ORDER BY product_id;

BEGIN;

-- Transfer five units from product 101 to product 102.
-- Both changes are committed together.
UPDATE ecommerce.products
SET stock_quantity = stock_quantity - 5
WHERE product_id = 101
  AND stock_quantity >= 5;

UPDATE ecommerce.products
SET stock_quantity = stock_quantity + 5
WHERE product_id = 102;

COMMIT;

\echo '--- Stock after COMMIT ---'
SELECT product_id, product_name, stock_quantity
FROM ecommerce.products
WHERE product_id IN (101, 102)
ORDER BY product_id;

-- ============================================================
-- Part 4: EXPLAIN before and after adding an index
-- ============================================================

-- Use a dedicated, reproducible table with enough rows for PostgreSQL's
-- planner to make an index-vs-sequential-scan decision visible.
CREATE TABLE IF NOT EXISTS ecommerce.stock_movements (
    movement_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id    BIGINT NOT NULL,
    quantity_delta INTEGER NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Rebuild only this exercise table so the row count is predictable on reruns.
TRUNCATE TABLE ecommerce.stock_movements RESTART IDENTITY;

INSERT INTO ecommerce.stock_movements (product_id, quantity_delta, created_at)
SELECT
    ((n - 1) % 1000) + 1,
    CASE WHEN n % 2 = 0 THEN 1 ELSE -1 END,
    TIMESTAMPTZ '2026-01-01 00:00:00+00' + (n * INTERVAL '1 second')
FROM generate_series(1, 200000) AS n;

ANALYZE ecommerce.stock_movements;

\echo '--- EXPLAIN BEFORE index: expect a sequential scan on many PostgreSQL setups ---'
EXPLAIN
SELECT movement_id, product_id, quantity_delta, created_at
FROM ecommerce.stock_movements
WHERE product_id = 777;

-- Add an index for the equality filter used above.
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id
    ON ecommerce.stock_movements(product_id);

ANALYZE ecommerce.stock_movements;

\echo '--- EXPLAIN AFTER index: expect an index-based plan when the planner estimates it is cheaper ---'
EXPLAIN
SELECT movement_id, product_id, quantity_delta, created_at
FROM ecommerce.stock_movements
WHERE product_id = 777;

-- Compare actual execution and buffer activity as well.
\echo '--- EXPLAIN ANALYZE after index ---'
EXPLAIN (ANALYZE, BUFFERS)
SELECT movement_id, product_id, quantity_delta, created_at
FROM ecommerce.stock_movements
WHERE product_id = 777;

-- Composite index example: useful for a user's recent order history.
-- Query shape matches the leading user_id column and order_date sort.
\echo '--- EXPLAIN for composite order-history index ---'
EXPLAIN
SELECT order_id, order_date, status
FROM ecommerce.orders
WHERE user_id = 1
ORDER BY order_date DESC
LIMIT 10;

-- Notes:
-- 1. EXPLAIN shows the planner's estimated plan; EXPLAIN ANALYZE executes it.
-- 2. Exact costs, timings and scan choices depend on PostgreSQL version,
--    table statistics, hardware and database settings.
-- 3. A sequential scan is not automatically bad. For small tables or queries
--    returning many rows, it can be cheaper than using an index.
-- 4. Keep indexes focused: they speed up suitable reads but add storage and
--    make INSERT/UPDATE/DELETE work more expensive.

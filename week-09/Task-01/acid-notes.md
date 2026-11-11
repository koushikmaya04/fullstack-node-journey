# ACID properties in an e-commerce order flow

## Schema overview

This exercise uses four tables:

- **users** stores each customer's profile and unique email address.
- **products** stores the product catalogue and current listed price.
- **orders** stores an order header and the customer who placed it.
- **order_items** stores products and quantities belonging to an order.

An order can contain many products, and a product can appear in many orders. The many-to-many relationship is represented by `order_items`. Its composite primary key `(order_id, product_id)` prevents the same product from appearing as two lines in one order.

## How the schema satisfies 3NF

### 1NF
Every column contains one atomic value. An order with three products has three rows in `order_items`; products are not stored as a comma-separated list in `orders`.

### 2NF
The design is in 1NF, and every non-key attribute depends on the whole key. In `order_items`, the composite key is `(order_id, product_id)`; `quantity` and the purchase-time `unit_price` describe that exact product line in that exact order. The other tables use single-column primary keys.

### 3NF
The design is in 2NF, and non-key attributes do not depend on other non-key attributes. Customer details live in `users`, catalogue details live in `products`, and order-specific details live in `orders` and `order_items`. Customer email and product name are not repeated on every order line.

`order_items.unit_price` is intentionally a snapshot of the agreed purchase price. It records a historical fact, not a duplicate of the current catalogue price.

## ACID during order placement

The order header and all order lines should be created in one database transaction.

```sql
BEGIN;

INSERT INTO ecommerce.orders (user_id, status)
VALUES (2, 'pending')
RETURNING order_id;

-- Use the returned order_id for all lines.
INSERT INTO ecommerce.order_items (order_id, product_id, quantity, unit_price)
VALUES
    (/* returned_order_id */, 103, 1, 1800.00),
    (/* returned_order_id */, 104, 1, 1500.00);

COMMIT;
```

In application code, keep the returned ID in a variable or use a CTE. Do not send the placeholder text literally.

### Atomicity — all or nothing
The order header and every item row belong to one transaction. If an item insert fails (for example, a product does not exist or a CHECK constraint rejects the quantity), the application rolls back. The header and earlier item inserts are undone too. The customer is not left with a partial order.

### Consistency — rules remain valid
Primary keys identify rows; foreign keys prevent references to missing users, orders or products; and `NOT NULL`, `UNIQUE` and `CHECK` constraints reject incomplete, duplicate or invalid values. The status check permits only the statuses defined in the schema. A successful transaction preserves these database rules.

Business rules such as stock availability and payment authorization also need application logic and, where appropriate, database constraints or locking.

### Isolation — concurrent orders do not interfere incorrectly
Two customers might try to buy the last unit of a product at almost the same time. A production order flow should lock the relevant inventory row (for example, with `SELECT ... FOR UPDATE`) before checking and decrementing stock. The second transaction waits for the first lock to be released and then sees the updated quantity.

This practice schema does not model inventory, so it cannot guarantee stock correctness by itself. A production design should represent inventory explicitly and update it in the same transaction. PostgreSQL's default READ COMMITTED isolation gives each statement a consistent snapshot; SERIALIZABLE can protect more complex invariants, but the application must retry serialization failures.

### Durability — committed orders persist
After PostgreSQL successfully acknowledges `COMMIT`, the order is committed. PostgreSQL's write-ahead log and durable storage settings help committed changes survive a crash or restart, subject to storage and replication configuration.

The application should confirm the order only after commit succeeds. If the connection drops during commit, an idempotency key lets the application check whether the order was created before retrying.

## A sensible production order-placement sequence

1. Begin a transaction.
2. Lock and validate inventory rows in a consistent order.
3. Confirm the customer and product records exist.
4. Insert the order header.
5. Insert order items using server-calculated prices and quantities.
6. Decrement inventory and record payment/order state as appropriate.
7. Commit; otherwise roll back.
8. Send confirmation after commit, often through an outbox/job pattern so an email failure does not undo a valid order.

## Run the exercise

Use a disposable database:

```bash
createdb ecommerce_db
psql -d ecommerce_db -f week-09/Task-01/ecommerce-schema.sql
```

The SQL script drops and recreates only its dedicated `ecommerce` schema. Do not run it in a database containing important application data.

## Key takeaway

Each fact has a clear home. Keys and constraints protect relationships and valid values, normalization reduces unnecessary duplication, and ACID transactions make order placement reliable when something fails or customers place orders concurrently.

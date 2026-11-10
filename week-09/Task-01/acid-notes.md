# ACID properties in an e-commerce order flow

## The schema in plain language

This exercise uses four tables:

- **users** stores each customer's profile and a unique email address.
- **products** stores the catalogue and the current listed price.
- **orders** stores one order header and the customer who placed it.
- **order_items** stores the products and quantities belonging to an order.

An order can contain many products, and a product can appear in many orders. That many-to-many relationship is represented by \`order_items\`. Its composite primary key \`(order_id, product_id)\` prevents the same product from being added as two separate lines in one order. The quantity and the price charged are stored on the line.

The SQL script also includes a small sample dataset and ten queries. Run it in a disposable practice database because it drops and recreates only the \`ecommerce\` schema.

## Why this design is in 3NF

Normalization helps keep each fact in one sensible place, reducing duplicated data and update mistakes.

### First Normal Form (1NF)

Every column contains one value rather than a list or repeating group. For example, an order containing three products has three rows in \`order_items\`, not a comma-separated product list inside \`orders\`.

### Second Normal Form (2NF)

The design is in 1NF, and every non-key attribute depends on the whole key. In \`order_items\`, the primary key is \`(order_id, product_id)\`; both \`quantity\` and the price charged describe that particular product line in that particular order.

The other tables use a single-column primary key, so their non-key columns depend on the whole key.

### Third Normal Form (3NF)

The design is in 2NF, and non-key columns do not depend on other non-key columns. Customer details live in \`users\`, product catalogue details live in \`products\`, and order-specific details live in \`orders\` and \`order_items\`. We do not copy a customer's email or product name into every order line.

One intentional detail: \`order_items.unit_price\` is a snapshot of the price agreed at purchase time. It is not a duplicate of the current catalogue price; it records a historical fact. If a product's catalogue price changes next month, an old order must still show the amount the customer agreed to pay.

## ACID during order placement

Imagine Diya places an order for one USB-C Hub and one Laptop Stand. The application should perform the order header and all order lines in one database transaction.

A simplified SQL flow could look like this (the application should also validate stock and calculate totals on the server):

\`\`\`sql
BEGIN;

INSERT INTO orders (user_id, status)
VALUES (2, 'pending')
RETURNING order_id;

-- Use the returned order_id for both lines.
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
    (/* order_id */, 103, 1, 1800.00),
    (/* order_id */, 104, 1, 1500.00);

COMMIT;
\`\`\`

In real application code, keep the returned order ID in a variable or use a CTE. Never send the placeholder text \`/* order_id */\` literally.

### Atomicity — all or nothing

The order header and its item rows belong to one transaction. If the second line fails (for example, because the product ID does not exist or the quantity violates a check constraint), the application must issue \`ROLLBACK\`. The database then removes the new order header and the first line too. The customer is not left with a half-created order.

### Consistency — valid data before and after

The schema's constraints protect important rules:

- Primary keys keep each row identifiable.
- Foreign keys prevent an order from referencing a missing user, or an item from referencing a missing order/product.
- \`NOT NULL\`, \`UNIQUE\`, and \`CHECK\` constraints reject incomplete or invalid values.
- The status check allows only the statuses listed in the schema.

A transaction that starts from valid data must preserve these rules when it commits. Business rules such as stock availability and payment authorization also need application logic and, where appropriate, database constraints or locking.

### Isolation — concurrent orders should not interfere

Two customers might try to buy the last unit of the same product at nearly the same time. A transaction should lock the relevant inventory row (for example, with \`SELECT ... FOR UPDATE\`) before checking and decrementing stock. The second transaction waits for the first lock to be released, then sees the updated quantity.

This practice example does not model inventory, so it cannot by itself guarantee stock correctness. In a production schema, inventory would be represented explicitly and updated inside the same transaction. PostgreSQL's default READ COMMITTED isolation gives each statement a consistent snapshot; stronger isolation such as SERIALIZABLE may be useful for more complex invariants, with retry handling for serialization failures.

### Durability — committed means saved

After PostgreSQL successfully acknowledges \`COMMIT\`, the order is committed. PostgreSQL's write-ahead log (WAL) and durable storage settings allow committed changes to survive a server crash or restart, subject to the database's storage and replication configuration.

The application should show an order confirmation only after the transaction has committed successfully. If the connection drops during commit, the application may need to query by an idempotency key to determine whether the order was committed before retrying.

## A sensible production order-placement sequence

1. Begin a transaction.
2. Lock and validate inventory rows in a consistent order.
3. Confirm the customer and product records exist.
4. Insert the order header.
5. Insert order items using server-calculated prices and quantities.
6. Decrement inventory and record the payment/order state as appropriate.
7. Commit; otherwise roll back.
8. Send confirmation after commit (usually through an outbox/job pattern so an email failure does not undo a valid order).

## Running the exercise

Create a practice database, then run:

\`\`\`bash
createdb ecommerce_db
psql -d ecommerce_db -f ecommerce-schema.sql
\`\`\`

The file sets \`search_path\` to the dedicated \`ecommerce\` schema and wraps its setup data in a transaction. It intentionally drops that schema first, so use a throwaway practice database.

To run a query individually, connect with \`psql -d ecommerce_db\` and paste one query section at a time, or open the script in pgAdmin's Query Tool. The result examples below assume the sample data in the SQL file.

## Expected outputs for the ten queries

The query outputs are shown as compact result summaries. Monetary values are in the database's \`NUMERIC(12,2)\` scale.

### Query 1 — customers and orders

| order_id | full_name | status |
|---:|---|---|
| 1001 | Aarav Mehta | delivered |
| 1002 | Diya Sharma | shipped |
| 1003 | Aarav Mehta | paid |
| 1004 | Kabir Rao | pending |

### Query 2 — all customers, including those without orders

| user_id | full_name | order_id |
|---:|---|---:|
| 1 | Aarav Mehta | 1001 |
| 1 | Aarav Mehta | 1003 |
| 2 | Diya Sharma | 1002 |
| 3 | Kabir Rao | 1004 |
| 4 | Mira Iyer | NULL |

### Query 3 — order line details

| order_id | product_name | quantity | unit_price | line_total |
|---:|---|---:|---:|---:|
| 1001 | Mechanical Keyboard | 1 | 2500.00 | 2500.00 |
| 1001 | Wireless Mouse | 2 | 1200.00 | 2400.00 |
| 1002 | USB-C Hub | 1 | 1800.00 | 1800.00 |
| 1002 | Laptop Stand | 1 | 1500.00 | 1500.00 |
| 1003 | Wireless Mouse | 1 | 1200.00 | 1200.00 |
| 1003 | Webcam | 1 | 3200.00 | 3200.00 |
| 1004 | Mechanical Keyboard | 2 | 2500.00 | 5000.00 |

### Query 4 — total value per order

| order_id | full_name | order_total |
|---:|---|---:|
| 1001 | Aarav Mehta | 4900.00 |
| 1002 | Diya Sharma | 3300.00 |
| 1003 | Aarav Mehta | 4400.00 |
| 1004 | Kabir Rao | 5000.00 |

### Query 5 — customers with spend of at least 4000

| user_id | full_name | total_spend |
|---:|---|---:|
| 3 | Kabir Rao | 5000.00 |
| 1 | Aarav Mehta | 9300.00 |

The exact order is descending by spend, so Aarav appears before Kabir: Aarav 9300.00, then Kabir 5000.00.

### Query 6 — products never ordered

No rows. Every sample product (101–105) appears in at least one order item.

### Query 7 — products above average catalogue price

Average product price is 2040.00.

| product_id | product_name | unit_price |
|---:|---|---:|
| 105 | Webcam | 3200.00 |
| 101 | Mechanical Keyboard | 2500.00 |

### Query 8 — each customer's latest order

| user_id | full_name | order_id |
|---:|---|---:|
| 1 | Aarav Mehta | 1003 |
| 2 | Diya Sharma | 1002 |
| 3 | Kabir Rao | 1004 |

Mira has no order, so she is not returned by this query.

### Query 9 — FULL OUTER JOIN audit

All products and order items match in this sample, so this returns the seven order-item rows joined to their product names. No unmatched side appears.

### Query 10 — units sold and revenue by product

| product_id | product_name | units_sold | revenue |
|---:|---|---:|---:|
| 101 | Mechanical Keyboard | 3 | 7500.00 |
| 102 | Wireless Mouse | 3 | 3600.00 |
| 103 | USB-C Hub | 1 | 1800.00 |
| 104 | Laptop Stand | 1 | 1500.00 |
| 105 | Webcam | 1 | 3200.00 |

## Key takeaway

The relational model separates customers, orders, products, and order lines so each fact has a clear home. Keys and constraints protect relationships and valid values. Normalization reduces unnecessary duplication, while ACID transactions make the multi-step order-placement operation reliable even when something fails or multiple customers act at once.

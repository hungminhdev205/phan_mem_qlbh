CREATE SCHEMA IF NOT EXISTS sales;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE public.transaction_type AS ENUM ('sale', 'purchase', 'returns', 'adjustment');
    ELSE
        ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'returns';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE public.transaction_status AS ENUM ('draft', 'completed', 'cancelled');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS sales.transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_customer_id BIGINT,
    fk_employee_id BIGINT,
    code VARCHAR(50) NOT NULL,
    transaction_type public.transaction_type NOT NULL,
    payment_method VARCHAR(50),
    total_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    status public.transaction_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_transactions PRIMARY KEY (id),
    CONSTRAINT uq_transactions_code UNIQUE (code),
    CONSTRAINT ck_transactions_amount CHECK (total_amount >= 0 AND paid_amount >= 0),
    CONSTRAINT fk_transactions_customer FOREIGN KEY (fk_customer_id)
        REFERENCES business.customers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_employee FOREIGN KEY (fk_employee_id)
        REFERENCES business.employees (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sales.transaction_details (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    fk_transaction_id BIGINT NOT NULL,
    fk_product_id BIGINT NOT NULL,
    fk_warehouse_id BIGINT,
    quantity NUMERIC(18, 3) NOT NULL,
    unit_price NUMERIC(18, 2) NOT NULL,
    discount_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(18, 2) NOT NULL,

    CONSTRAINT pk_transaction_details PRIMARY KEY (id),
    CONSTRAINT ck_transaction_details_quantity CHECK (quantity > 0),
    CONSTRAINT ck_transaction_details_amount CHECK (unit_price >= 0 AND discount_amount >= 0 AND total_amount >= 0),
    CONSTRAINT fk_transaction_details_transaction FOREIGN KEY (fk_transaction_id)
        REFERENCES sales.transactions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_transaction_details_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_transaction_details_warehouse FOREIGN KEY (fk_warehouse_id)
        REFERENCES inventory.warehouses (id) ON DELETE SET NULL ON UPDATE CASCADE
);

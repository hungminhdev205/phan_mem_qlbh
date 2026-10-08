CREATE SCHEMA IF NOT EXISTS inventory;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type') THEN
        CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS inventory.warehouses (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_warehouses PRIMARY KEY (id),
    CONSTRAINT uq_warehouses_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS inventory.stock_balances (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_warehouse_id BIGINT NOT NULL,
    fk_product_id BIGINT NOT NULL,
    quantity NUMERIC(18, 3) NOT NULL DEFAULT 0,
    min_quantity NUMERIC(18, 3) NOT NULL DEFAULT 0,
    location_code VARCHAR(100),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_stock_balances PRIMARY KEY (id),
    CONSTRAINT uq_stock_balances UNIQUE (fk_warehouse_id, fk_product_id),
    CONSTRAINT ck_stock_balances_quantity CHECK (quantity >= 0 AND min_quantity >= 0),
    CONSTRAINT fk_stock_balances_warehouse FOREIGN KEY (fk_warehouse_id)
        REFERENCES inventory.warehouses (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_stock_balances_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products (id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO inventory.warehouses (code, name, address)
VALUES ('MAIN', 'Kho chính', 'Chưa cập nhật')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    address = EXCLUDED.address,
    status = 'active'::public.record_type,
    updated_at = CURRENT_TIMESTAMP;

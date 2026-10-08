CREATE SCHEMA IF NOT EXISTS catalog;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type') THEN
        CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS catalog.gold_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    purity NUMERIC(8, 4),
    description TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_gold_types PRIMARY KEY (id),
    CONSTRAINT uq_gold_types_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS catalog.products (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_gold_type_id BIGINT,
    fk_supplier_id BIGINT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    unit_name VARCHAR(50) NOT NULL DEFAULT 'chiếc',
    weight NUMERIC(18, 3) NOT NULL DEFAULT 0,
    gold_weight NUMERIC(18, 3) NOT NULL DEFAULT 0,
    stone_weight NUMERIC(18, 3) NOT NULL DEFAULT 0,
    labor_cost NUMERIC(18, 2) NOT NULL DEFAULT 0,
    stone_cost NUMERIC(18, 2) NOT NULL DEFAULT 0,
    base_labor_cost NUMERIC(18, 2) NOT NULL DEFAULT 0,
    base_stone_cost NUMERIC(18, 2) NOT NULL DEFAULT 0,
    cost_price NUMERIC(18, 2) NOT NULL DEFAULT 0,
    purchase_price NUMERIC(18, 2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(18, 2) NOT NULL DEFAULT 0,
    is_fixed_price BOOLEAN NOT NULL DEFAULT FALSE,
    vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_code UNIQUE (code),
    CONSTRAINT ck_products_weight CHECK (weight >= 0 AND gold_weight >= 0 AND stone_weight >= 0),
    CONSTRAINT ck_products_prices CHECK (
        labor_cost >= 0
        AND stone_cost >= 0
        AND base_labor_cost >= 0
        AND base_stone_cost >= 0
        AND cost_price >= 0
        AND purchase_price >= 0
        AND sale_price >= 0
    ),
    CONSTRAINT ck_products_vat_rate CHECK (vat_rate >= 0 AND vat_rate <= 100),
    CONSTRAINT fk_products_gold_type FOREIGN KEY (fk_gold_type_id)
        REFERENCES catalog.gold_types (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_products_supplier FOREIGN KEY (fk_supplier_id)
        REFERENCES business.suppliers (id) ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO catalog.gold_types (code, name, purity, description)
VALUES
    ('9999', 'Vàng 9999', 99.9900, 'Vàng 24K hàm lượng 99.99%.'),
    ('24K', 'Vàng 24K', 99.9000, 'Vàng 24K.'),
    ('18K', 'Vàng 18K', 75.0000, 'Vàng 18K.'),
    ('14K', 'Vàng 14K', 58.5000, 'Vàng 14K.'),
    ('BAC', 'Bạc', 92.5000, 'Bạc trang sức.')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    purity = EXCLUDED.purity,
    description = EXCLUDED.description,
    status = 'active'::public.record_type,
    updated_at = CURRENT_TIMESTAMP;

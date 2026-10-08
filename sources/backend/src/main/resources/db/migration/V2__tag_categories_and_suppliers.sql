CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS business;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type') THEN
        CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS catalog.tag_categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tag_categories PRIMARY KEY (id),
    CONSTRAINT uq_tag_categories_code UNIQUE (code),
    CONSTRAINT uq_tag_categories_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS business.suppliers (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_tag_category_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    tax_code VARCHAR(30),
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_suppliers PRIMARY KEY (id),
    CONSTRAINT uq_suppliers_code UNIQUE (code),
    CONSTRAINT uq_suppliers_tax_code UNIQUE (tax_code),
    CONSTRAINT fk_suppliers_tag_category FOREIGN KEY (fk_tag_category_id)
        REFERENCES catalog.tag_categories (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO catalog.tag_categories (code, name, description)
VALUES
    ('TEM_VANG', 'Tem Vàng', 'Tem dùng cho sản phẩm vàng và trang sức vàng.'),
    ('TEM_BAC', 'Tem Bạc', 'Tem dùng cho sản phẩm bạc.'),
    ('TEM_AP_GIA', 'Tem Áp Giá', 'Tem dùng cho sản phẩm đã áp giá bán cố định.')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = 'active'::public.record_type,
    updated_at = CURRENT_TIMESTAMP;

DO $$
BEGIN
    IF to_regclass('catalog.products') IS NOT NULL THEN
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS fk_supplier_id BIGINT;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS unit_name VARCHAR(50) NOT NULL DEFAULT 'chiếc';
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS gold_weight NUMERIC(18, 3) NOT NULL DEFAULT 0;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS stone_weight NUMERIC(18, 3) NOT NULL DEFAULT 0;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS stone_cost NUMERIC(18, 2) NOT NULL DEFAULT 0;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS base_labor_cost NUMERIC(18, 2) NOT NULL DEFAULT 0;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS base_stone_cost NUMERIC(18, 2) NOT NULL DEFAULT 0;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(18, 2) NOT NULL DEFAULT 0;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS is_fixed_price BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 0;

        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'fk_products_supplier'
        ) THEN
            ALTER TABLE catalog.products
                ADD CONSTRAINT fk_products_supplier FOREIGN KEY (fk_supplier_id)
                REFERENCES business.suppliers (id) ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
    END IF;
END
$$;

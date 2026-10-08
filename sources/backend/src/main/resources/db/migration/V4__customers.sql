CREATE SCHEMA IF NOT EXISTS business;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type') THEN
        CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS business.customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    rank_name VARCHAR(50),
    debt_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_customers PRIMARY KEY (id),
    CONSTRAINT uq_customers_code UNIQUE (code),
    CONSTRAINT ck_customers_debt_amount CHECK (debt_amount >= 0)
);

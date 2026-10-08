CREATE SCHEMA IF NOT EXISTS finance;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type') THEN
        CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS finance.cash_book_entries (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    entry_type VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50),
    amount NUMERIC(18, 2) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_cash_book_entries PRIMARY KEY (id),
    CONSTRAINT uq_cash_book_entries_code UNIQUE (code),
    CONSTRAINT ck_cash_book_entries_type CHECK (entry_type IN ('income', 'expense')),
    CONSTRAINT ck_cash_book_entries_amount CHECK (amount > 0)
);

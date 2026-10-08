DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type') THEN
        CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scope_type') THEN
        CREATE TYPE public.scope_type AS ENUM ('SYSTEM', 'STORE');
    ELSE
        ALTER TYPE public.scope_type ADD VALUE IF NOT EXISTS 'STORE';
    END IF;

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

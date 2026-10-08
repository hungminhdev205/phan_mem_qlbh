ALTER TABLE auth.accounts ADD COLUMN IF NOT EXISTS status public.record_type NOT NULL DEFAULT 'active';
ALTER TABLE auth.accounts ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

ALTER TABLE auth.roles ADD COLUMN IF NOT EXISTS code VARCHAR(100);
ALTER TABLE auth.roles ADD COLUMN IF NOT EXISTS status public.record_type NOT NULL DEFAULT 'active';
UPDATE auth.roles SET code = UPPER(REGEXP_REPLACE(name, '[^A-Za-z0-9]+', '_', 'g')) WHERE code IS NULL OR TRIM(code) = '';
ALTER TABLE auth.roles ALTER COLUMN code SET NOT NULL;

ALTER TABLE business.employees ADD COLUMN IF NOT EXISTS employee_code VARCHAR(50);
ALTER TABLE business.employees ADD COLUMN IF NOT EXISTS position_name VARCHAR(100);
UPDATE business.employees SET employee_code = 'NV' || LPAD(id::text, 4, '0') WHERE employee_code IS NULL OR TRIM(employee_code) = '';
ALTER TABLE business.employees ALTER COLUMN employee_code SET NOT NULL;

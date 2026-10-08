-- Chạy file này khi cần tạo lại database từ đầu.
-- Lưu ý: lệnh DROP sẽ xóa dữ liệu hiện có trong các schema của ứng dụng.

DROP SCHEMA IF EXISTS sales CASCADE;
DROP SCHEMA IF EXISTS finance CASCADE;
DROP SCHEMA IF EXISTS inventory CASCADE;
DROP SCHEMA IF EXISTS catalog CASCADE;
DROP SCHEMA IF EXISTS business CASCADE;
DROP SCHEMA IF EXISTS auth CASCADE;
DROP TABLE IF EXISTS public.images CASCADE;
DROP TABLE IF EXISTS public.wiki CASCADE;
DROP FUNCTION IF EXISTS public.fs_response(BOOLEAN, TEXT, JSONB);
DROP TYPE IF EXISTS public.transaction_status CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.scope_type CASCADE;
DROP TYPE IF EXISTS public.record_type CASCADE;

CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA auth;
CREATE SCHEMA business;
CREATE SCHEMA catalog;
CREATE SCHEMA inventory;
CREATE SCHEMA sales;
CREATE SCHEMA finance;

-- Sau đó chạy tiếp theo thứ tự:
-- 1. type.sql
-- 2. table.sql
-- 3. function.sql
-- 4. seed.sql

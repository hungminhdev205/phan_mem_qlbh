-- Database chuẩn cho phần mềm quản lý nội bộ một cửa tiệm vàng.
-- Hệ thống chỉ có một hồ sơ cửa tiệm tại business.companies với id = 1.

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS sales;
CREATE SCHEMA IF NOT EXISTS finance;

CREATE TYPE public.record_type AS ENUM ('active', 'inactive', 'deleted');
CREATE TYPE public.scope_type AS ENUM ('SYSTEM', 'STORE');
CREATE TYPE public.transaction_type AS ENUM ('sale', 'purchase', 'returns', 'adjustment');
CREATE TYPE public.transaction_status AS ENUM ('draft', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS business.companies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(30),
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_only_one_internal_store CHECK (id = 1),
    CONSTRAINT uq_companies_name UNIQUE (name),
    CONSTRAINT uq_companies_tax_code UNIQUE (tax_code)
);

CREATE TABLE IF NOT EXISTS auth.accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status public.record_type NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_accounts_username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS auth.profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_account_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_profiles_account UNIQUE (fk_account_id),
    CONSTRAINT uq_profiles_email UNIQUE (email),
    CONSTRAINT fk_profiles_account FOREIGN KEY (fk_account_id)
        REFERENCES auth.accounts(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_company_id BIGINT NOT NULL DEFAULT 1,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_roles_code UNIQUE (code),
    CONSTRAINT fk_roles_company FOREIGN KEY (fk_company_id)
        REFERENCES business.companies(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_parent_id BIGINT,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope public.scope_type NOT NULL DEFAULT 'STORE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_permissions_code UNIQUE (code),
    CONSTRAINT fk_permissions_parent FOREIGN KEY (fk_parent_id)
        REFERENCES auth.permissions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.role_permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_role_id BIGINT NOT NULL,
    fk_permission_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_role_permissions UNIQUE (fk_role_id, fk_permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (fk_role_id)
        REFERENCES auth.roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (fk_permission_id)
        REFERENCES auth.permissions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS business.employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_account_id BIGINT NOT NULL,
    fk_company_id BIGINT NOT NULL DEFAULT 1,
    fk_role_id BIGINT,
    employee_code VARCHAR(50) NOT NULL,
    position_name VARCHAR(100),
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_employees_account UNIQUE (fk_account_id),
    CONSTRAINT uq_employees_code UNIQUE (employee_code),
    CONSTRAINT fk_employees_account FOREIGN KEY (fk_account_id)
        REFERENCES auth.accounts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_employees_company FOREIGN KEY (fk_company_id)
        REFERENCES business.companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_employees_role FOREIGN KEY (fk_role_id)
        REFERENCES auth.roles(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS business.customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    CONSTRAINT uq_customers_code UNIQUE (code),
    CONSTRAINT ck_customers_debt_amount CHECK (debt_amount >= 0)
);

CREATE TABLE IF NOT EXISTS catalog.tag_categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tag_categories_code UNIQUE (code),
    CONSTRAINT uq_tag_categories_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS business.suppliers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    CONSTRAINT uq_suppliers_code UNIQUE (code),
    CONSTRAINT uq_suppliers_tax_code UNIQUE (tax_code),
    CONSTRAINT fk_suppliers_tag_category FOREIGN KEY (fk_tag_category_id)
        REFERENCES catalog.tag_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS catalog.gold_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    purity NUMERIC(8, 4),
    description TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_gold_types_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS catalog.products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
        REFERENCES catalog.gold_types(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_products_supplier FOREIGN KEY (fk_supplier_id)
        REFERENCES business.suppliers(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory.warehouses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_warehouses_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS inventory.stock_balances (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_warehouse_id BIGINT NOT NULL,
    fk_product_id BIGINT NOT NULL,
    quantity NUMERIC(18, 3) NOT NULL DEFAULT 0,
    min_quantity NUMERIC(18, 3) NOT NULL DEFAULT 0,
    location_code VARCHAR(100),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_stock_balances UNIQUE (fk_warehouse_id, fk_product_id),
    CONSTRAINT ck_stock_balances_quantity CHECK (quantity >= 0 AND min_quantity >= 0),
    CONSTRAINT fk_stock_balances_warehouse FOREIGN KEY (fk_warehouse_id)
        REFERENCES inventory.warehouses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_stock_balances_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory.inventory_movements (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    movement_type VARCHAR(30) NOT NULL,
    fk_source_warehouse_id BIGINT,
    fk_target_warehouse_id BIGINT,
    fk_product_id BIGINT NOT NULL,
    quantity NUMERIC(18, 3) NOT NULL,
    unit_cost NUMERIC(18, 2),
    note VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_inventory_movements_code UNIQUE (code),
    CONSTRAINT ck_inventory_movements_type CHECK (movement_type IN ('import', 'transfer')),
    CONSTRAINT ck_inventory_movements_quantity CHECK (quantity > 0),
    CONSTRAINT fk_inventory_movements_source_warehouse FOREIGN KEY (fk_source_warehouse_id)
        REFERENCES inventory.warehouses(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_movements_target_warehouse FOREIGN KEY (fk_target_warehouse_id)
        REFERENCES inventory.warehouses(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_movements_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS catalog.price_lists (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    effective_from TIMESTAMP NOT NULL,
    effective_to TIMESTAMP,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_price_lists_code UNIQUE (code),
    CONSTRAINT ck_price_lists_period CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE IF NOT EXISTS catalog.price_list_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_price_list_id BIGINT NOT NULL,
    fk_product_id BIGINT NOT NULL,
    buy_price NUMERIC(18, 2) NOT NULL DEFAULT 0,
    sell_price NUMERIC(18, 2) NOT NULL DEFAULT 0,
    labor_cost NUMERIC(18, 2) NOT NULL DEFAULT 0,
    CONSTRAINT uq_price_list_items UNIQUE (fk_price_list_id, fk_product_id),
    CONSTRAINT ck_price_list_items_prices CHECK (buy_price >= 0 AND sell_price >= 0 AND labor_cost >= 0),
    CONSTRAINT fk_price_list_items_price_list FOREIGN KEY (fk_price_list_id)
        REFERENCES catalog.price_lists(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_price_list_items_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sales.transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    CONSTRAINT uq_transactions_code UNIQUE (code),
    CONSTRAINT ck_transactions_amount CHECK (total_amount >= 0 AND paid_amount >= 0),
    CONSTRAINT fk_transactions_customer FOREIGN KEY (fk_customer_id)
        REFERENCES business.customers(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_employee FOREIGN KEY (fk_employee_id)
        REFERENCES business.employees(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sales.transaction_details (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_transaction_id BIGINT NOT NULL,
    fk_product_id BIGINT NOT NULL,
    fk_warehouse_id BIGINT,
    quantity NUMERIC(18, 3) NOT NULL,
    unit_price NUMERIC(18, 2) NOT NULL,
    discount_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(18, 2) NOT NULL,
    CONSTRAINT ck_transaction_details_quantity CHECK (quantity > 0),
    CONSTRAINT ck_transaction_details_amount CHECK (unit_price >= 0 AND discount_amount >= 0 AND total_amount >= 0),
    CONSTRAINT fk_transaction_details_transaction FOREIGN KEY (fk_transaction_id)
        REFERENCES sales.transactions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_transaction_details_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_transaction_details_warehouse FOREIGN KEY (fk_warehouse_id)
        REFERENCES inventory.warehouses(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS finance.cash_book_entries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    CONSTRAINT uq_cash_book_entries_code UNIQUE (code),
    CONSTRAINT ck_cash_book_entries_type CHECK (entry_type IN ('income', 'expense')),
    CONSTRAINT ck_cash_book_entries_amount CHECK (amount > 0)
);

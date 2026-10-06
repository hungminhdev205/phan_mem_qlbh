CREATE TABLE IF NOT EXISTS public.wiki (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    table_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_wiki PRIMARY KEY (id),
    CONSTRAINT up_table_name UNIQUE (table_name)
);

CREATE TABLE IF NOT EXISTS auth.accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_create_by BIGINT,
    fk_update_by BIGINT,

    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_accounts PRIMARY KEY (id),
    CONSTRAINT up_username UNIQUE (username),
    CONSTRAINT fk_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS public.images (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_create_by BIGINT,
    fk_update_by BIGINT,

    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_images PRIMARY KEY (id),
    CONSTRAINT uq_image_name UNIQUE (name),
    CONSTRAINT fk_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_account_id BIGINT NOT NULL,
    fk_image_id BIGINT,

    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_profiles PRIMARY KEY (id),
    CONSTRAINT uq_email UNIQUE (email),
    CONSTRAINT fk_account_id FOREIGN KEY (fk_account_id) REFERENCES auth.accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_image_id FOREIGN KEY (fk_image_id) REFERENCES public.images (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS business.companies (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_create_by BIGINT,
    fk_update_by BIGINT,

    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    tax_code VARCHAR(20) NOT NULL,
    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_companies PRIMARY KEY (id),
    CONSTRAINT uq_company_name UNIQUE (name),
    CONSTRAINT uq_tax_code UNIQUE (tax_code),
    CONSTRAINT fk_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_create_by BIGINT,
    fk_update_by BIGINT,
    fk_parent_id BIGINT,

    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope public.scope_type NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_permissions PRIMARY KEY (id),
    CONSTRAINT uq_permission_code UNIQUE (code),
    CONSTRAINT fk_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_parent_id FOREIGN KEY (fk_parent_id) REFERENCES auth.permissions (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_company_id BIGINT,
    fk_create_by BIGINT,
    fk_update_by BIGINT,

    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uq_role_name UNIQUE (name),
    CONSTRAINT fk_company_id FOREIGN KEY (fk_company_id) REFERENCES business.companies (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.role_permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_role_id BIGINT NOT NULL,
    fk_permission_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_role_permissions PRIMARY KEY (id),
    CONSTRAINT uq_role_permission UNIQUE (fk_role_id, fk_permission_id),
    CONSTRAINT fk_role_id FOREIGN KEY (fk_role_id) REFERENCES auth.roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_permission_id FOREIGN KEY (fk_permission_id) REFERENCES auth.permissions (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS business.employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    fk_account_id BIGINT NOT NULL,
    fk_company_id BIGINT,
    fk_role_id BIGINT,

    status public.record_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_employees PRIMARY KEY (id),
    CONSTRAINT fk_account_id FOREIGN KEY (fk_account_id) REFERENCES auth.accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_company_id FOREIGN KEY (fk_company_id) REFERENCES business.companies (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_role_id FOREIGN KEY (fk_role_id) REFERENCES auth.roles (id) ON DELETE SET NULL ON UPDATE CASCADE
);

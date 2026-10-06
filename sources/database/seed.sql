DO $$
DECLARE
    v_account_id BIGINT;
    v_permission_id BIGINT;
    v_role_id BIGINT;
BEGIN
    INSERT INTO public.wiki (table_name, content) VALUES ('auth.accounts', 'Table lưu trữ thông tin tài khoản người dùng');
    INSERT INTO public.wiki (table_name, content) VALUES ('auth.profiles', 'Table lưu trữ thông tin hồ sơ người dùng');
    INSERT INTO public.wiki (table_name, content) VALUES ('auth.permissions', 'Table lưu trữ thông tin quyền hạn của người dùng');
    INSERT INTO public.wiki (table_name, content) VALUES ('auth.roles', 'Table lưu trữ thông tin vai trò của người dùng');
    INSERT INTO public.wiki (table_name, content) VALUES ('business.companies', 'Table lưu trữ thông tin công ty');
    INSERT INTO public.wiki (table_name, content) VALUES ('business.employees', 'Table lưu trữ thông tin nhân viên của công ty');

    INSERT INTO auth.accounts (username, password) VALUES ('admin', 'admin@123') RETURNING id INTO v_account_id;

    INSERT INTO auth.profiles (fk_account_id, full_name, email) VALUES (v_account_id, 'Nguyễn Văn Admin', 'admin@example.com');

    INSERT INTO auth.permissions (fk_create_by, code, name, description, scope) VALUES (v_account_id, 'SYSTEM_ADMIN', 'Quản trị hệ thống', 'Cho phép quản trị toàn bộ hệ thống', 'SYSTEM') RETURNING id INTO v_permission_id;

    INSERT INTO auth.roles (fk_company_id, fk_create_by, name, description) VALUES (null, v_account_id, 'COMPANY_ADMIN', 'Quản trị viên của công ty') RETURNING id INTO v_role_id;

    INSERT INTO auth.role_permissions (fk_role_id, fk_permission_id) VALUES (v_role_id, v_permission_id);

    INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id) VALUES (v_account_id, null, v_role_id);
END
$$;
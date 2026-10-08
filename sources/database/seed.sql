-- V10: Rich sample data for jewelry & gold store management system
DO $$
DECLARE
    v_admin_id BIGINT;
    v_quanly_id BIGINT;
    v_thungan_id BIGINT;
    v_banhang1_id BIGINT;
    v_banhang2_id BIGINT;
    v_thukho_id BIGINT;
    v_emp_banhang1_id BIGINT;
    v_emp_banhang2_id BIGINT;

    v_role_admin_id BIGINT;
    v_role_manager_id BIGINT;
    v_role_cashier_id BIGINT;
    v_role_sales_id BIGINT;
    v_role_stock_id BIGINT;

    v_perm_id BIGINT;

    v_wh_main_id BIGINT;
    v_wh_display_id BIGINT;
    v_wh_vip_id BIGINT;
    v_wh_craft_id BIGINT;

    v_tag_vang_id BIGINT;
    v_tag_bac_id BIGINT;
    v_tag_apgia_id BIGINT;
    v_tag_tay_id BIGINT;
    v_tag_kc_id BIGINT;
    v_tag_cuoi_id BIGINT;

    v_sup_sjc_id BIGINT;
    v_sup_doji_id BIGINT;
    v_sup_pnj_id BIGINT;
    v_sup_gia_id BIGINT;
    v_sup_italy_id BIGINT;
    v_sup_lucyen_id BIGINT;

    v_gold_9999_id BIGINT;
    v_gold_24k_id BIGINT;
    v_gold_18k_id BIGINT;
    v_gold_14k_id BIGINT;
    v_gold_bac_id BIGINT;
    v_gold_trang_id BIGINT;
    v_gold_10k_id BIGINT;

    v_cust_1_id BIGINT;
    v_cust_2_id BIGINT;
    v_cust_3_id BIGINT;
    v_cust_4_id BIGINT;
    v_cust_5_id BIGINT;
    v_cust_6_id BIGINT;
    v_cust_7_id BIGINT;
    v_cust_8_id BIGINT;
    v_cust_9_id BIGINT;
    v_cust_10_id BIGINT;

    v_p_ntt1_id BIGINT;
    v_p_ntt2_id BIGINT;
    v_p_ntt5_id BIGINT;
    v_p_sjc1l_id BIGINT;
    v_p_dcrong_id BIGINT;
    v_p_lthoamai_id BIGINT;
    v_p_kiengcuoi_id BIGINT;
    v_p_ndhkc_id BIGINT;
    v_p_nnkchalo_id BIGINT;
    v_p_dckctt_id BIGINT;
    v_p_btkcnu_id BIGINT;
    v_p_nchp_id BIGINT;
    v_p_lty750_id BIGINT;
    v_p_bt14k_id BIGINT;
    v_p_nnruby_id BIGINT;
    v_p_vtpan_id BIGINT;
    v_p_dcbachc_id BIGINT;
    v_p_mdcdilac_id BIGINT;

    v_tx_1_id BIGINT;
    v_tx_2_id BIGINT;
    v_tx_3_id BIGINT;
    v_tx_4_id BIGINT;
    v_tx_5_id BIGINT;
    v_tx_6_id BIGINT;
    v_tx_7_id BIGINT;
    v_tx_8_id BIGINT;
BEGIN
    ---------------------------------------------------------------------------
    -- 1. CÔNG TY / CỬA TIỆM
    ---------------------------------------------------------------------------
    INSERT INTO business.companies (id, name, address, phone, email, tax_code)
    OVERRIDING SYSTEM VALUE
    VALUES (
        1,
        'Tiệm Vàng Bạc Đá Quý Kim Long Thịnh',
        '128 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        '028 3822 9999',
        'contact@kimlongthinh.vn',
        '0314856921'
    )
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        tax_code = EXCLUDED.tax_code,
        status = 'active'::public.record_type,
        updated_at = CURRENT_TIMESTAMP;

    ---------------------------------------------------------------------------
    -- 2. TÀI KHOẢN, HỒ SƠ & VAI TRÒ
    ---------------------------------------------------------------------------
    -- Admin
    INSERT INTO auth.accounts (username, password, status)
    VALUES ('admin', '$2a$10$oXL4Qvjn3I/cBCFnJhtEt.UkBFWKgov7jiiuwJ0oTBGA6sCRo57kW', 'active'::public.record_type)
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, status = 'active'::public.record_type
    RETURNING id INTO v_admin_id;

    -- Quản lý
    INSERT INTO auth.accounts (username, password, status)
    VALUES ('quanly', '$2a$10$oXL4Qvjn3I/cBCFnJhtEt.UkBFWKgov7jiiuwJ0oTBGA6sCRo57kW', 'active'::public.record_type)
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, status = 'active'::public.record_type
    RETURNING id INTO v_quanly_id;

    -- Thu ngân
    INSERT INTO auth.accounts (username, password, status)
    VALUES ('thungan', '$2a$10$oXL4Qvjn3I/cBCFnJhtEt.UkBFWKgov7jiiuwJ0oTBGA6sCRo57kW', 'active'::public.record_type)
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, status = 'active'::public.record_type
    RETURNING id INTO v_thungan_id;

    -- Bán hàng 1
    INSERT INTO auth.accounts (username, password, status)
    VALUES ('banhang1', '$2a$10$oXL4Qvjn3I/cBCFnJhtEt.UkBFWKgov7jiiuwJ0oTBGA6sCRo57kW', 'active'::public.record_type)
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, status = 'active'::public.record_type
    RETURNING id INTO v_banhang1_id;

    -- Bán hàng 2
    INSERT INTO auth.accounts (username, password, status)
    VALUES ('banhang2', '$2a$10$oXL4Qvjn3I/cBCFnJhtEt.UkBFWKgov7jiiuwJ0oTBGA6sCRo57kW', 'active'::public.record_type)
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, status = 'active'::public.record_type
    RETURNING id INTO v_banhang2_id;

    -- Thủ kho
    INSERT INTO auth.accounts (username, password, status)
    VALUES ('thukho', '$2a$10$oXL4Qvjn3I/cBCFnJhtEt.UkBFWKgov7jiiuwJ0oTBGA6sCRo57kW', 'active'::public.record_type)
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, status = 'active'::public.record_type
    RETURNING id INTO v_thukho_id;

    -- Profiles
    IF EXISTS (SELECT 1 FROM auth.profiles WHERE fk_account_id = v_admin_id) THEN
        UPDATE auth.profiles SET full_name = 'Nguyễn Minh Hùng', email = 'admin@kimlongthinh.vn', phone = '0901234567' WHERE fk_account_id = v_admin_id;
    ELSE
        INSERT INTO auth.profiles (fk_account_id, full_name, email, phone) VALUES (v_admin_id, 'Nguyễn Minh Hùng', 'admin@kimlongthinh.vn', '0901234567');
    END IF;

    IF EXISTS (SELECT 1 FROM auth.profiles WHERE fk_account_id = v_quanly_id) THEN
        UPDATE auth.profiles SET full_name = 'Trần Thị Mai Lan', email = 'lan.tran@kimlongthinh.vn', phone = '0902345678' WHERE fk_account_id = v_quanly_id;
    ELSE
        INSERT INTO auth.profiles (fk_account_id, full_name, email, phone) VALUES (v_quanly_id, 'Trần Thị Mai Lan', 'lan.tran@kimlongthinh.vn', '0902345678');
    END IF;

    IF EXISTS (SELECT 1 FROM auth.profiles WHERE fk_account_id = v_thungan_id) THEN
        UPDATE auth.profiles SET full_name = 'Lê Thị Hồng Thắm', email = 'tham.le@kimlongthinh.vn', phone = '0903456789' WHERE fk_account_id = v_thungan_id;
    ELSE
        INSERT INTO auth.profiles (fk_account_id, full_name, email, phone) VALUES (v_thungan_id, 'Lê Thị Hồng Thắm', 'tham.le@kimlongthinh.vn', '0903456789');
    END IF;

    IF EXISTS (SELECT 1 FROM auth.profiles WHERE fk_account_id = v_banhang1_id) THEN
        UPDATE auth.profiles SET full_name = 'Phạm Quốc Bảo', email = 'bao.pham@kimlongthinh.vn', phone = '0904567890' WHERE fk_account_id = v_banhang1_id;
    ELSE
        INSERT INTO auth.profiles (fk_account_id, full_name, email, phone) VALUES (v_banhang1_id, 'Phạm Quốc Bảo', 'bao.pham@kimlongthinh.vn', '0904567890');
    END IF;

    IF EXISTS (SELECT 1 FROM auth.profiles WHERE fk_account_id = v_banhang2_id) THEN
        UPDATE auth.profiles SET full_name = 'Đỗ Thùy Trang', email = 'trang.do@kimlongthinh.vn', phone = '0905678901' WHERE fk_account_id = v_banhang2_id;
    ELSE
        INSERT INTO auth.profiles (fk_account_id, full_name, email, phone) VALUES (v_banhang2_id, 'Đỗ Thùy Trang', 'trang.do@kimlongthinh.vn', '0905678901');
    END IF;

    IF EXISTS (SELECT 1 FROM auth.profiles WHERE fk_account_id = v_thukho_id) THEN
        UPDATE auth.profiles SET full_name = 'Hoàng Văn Tuấn', email = 'tuan.hoang@kimlongthinh.vn', phone = '0906789012' WHERE fk_account_id = v_thukho_id;
    ELSE
        INSERT INTO auth.profiles (fk_account_id, full_name, email, phone) VALUES (v_thukho_id, 'Hoàng Văn Tuấn', 'tuan.hoang@kimlongthinh.vn', '0906789012');
    END IF;

    -- Roles
    IF EXISTS (SELECT 1 FROM auth.roles WHERE code = 'ADMIN') THEN
        UPDATE auth.roles SET name = 'Quản trị hệ thống', description = 'Toàn quyền cấu hình và quản trị hệ thống', fk_create_by = v_admin_id, fk_company_id = 1 WHERE code = 'ADMIN' RETURNING id INTO v_role_admin_id;
    ELSE
        INSERT INTO auth.roles (fk_company_id, fk_create_by, code, name, description)
        VALUES (1, v_admin_id, 'ADMIN', 'Quản trị hệ thống', 'Toàn quyền cấu hình và quản trị hệ thống')
        RETURNING id INTO v_role_admin_id;
    END IF;

    IF EXISTS (SELECT 1 FROM auth.roles WHERE code = 'STORE_MANAGER') THEN
        UPDATE auth.roles SET name = 'Cửa hàng trưởng', description = 'Quản lý vận hành hàng ngày của cửa tiệm', fk_create_by = v_admin_id, fk_company_id = 1 WHERE code = 'STORE_MANAGER' RETURNING id INTO v_role_manager_id;
    ELSE
        INSERT INTO auth.roles (fk_company_id, fk_create_by, code, name, description)
        VALUES (1, v_admin_id, 'STORE_MANAGER', 'Cửa hàng trưởng', 'Quản lý vận hành hàng ngày của cửa tiệm')
        RETURNING id INTO v_role_manager_id;
    END IF;

    IF EXISTS (SELECT 1 FROM auth.roles WHERE code = 'CASHIER') THEN
        UPDATE auth.roles SET name = 'Thu ngân', description = 'Quản lý thanh toán và thu chi sổ quỹ', fk_create_by = v_admin_id, fk_company_id = 1 WHERE code = 'CASHIER' RETURNING id INTO v_role_cashier_id;
    ELSE
        INSERT INTO auth.roles (fk_company_id, fk_create_by, code, name, description)
        VALUES (1, v_admin_id, 'CASHIER', 'Thu ngân', 'Quản lý thanh toán và thu chi sổ quỹ')
        RETURNING id INTO v_role_cashier_id;
    END IF;

    IF EXISTS (SELECT 1 FROM auth.roles WHERE code = 'SALES_STAFF') THEN
        UPDATE auth.roles SET name = 'Nhân viên bán hàng', description = 'Tư vấn bán hàng và lập phiếu bán hàng', fk_create_by = v_admin_id, fk_company_id = 1 WHERE code = 'SALES_STAFF' RETURNING id INTO v_role_sales_id;
    ELSE
        INSERT INTO auth.roles (fk_company_id, fk_create_by, code, name, description)
        VALUES (1, v_admin_id, 'SALES_STAFF', 'Nhân viên bán hàng', 'Tư vấn bán hàng và lập phiếu bán hàng')
        RETURNING id INTO v_role_sales_id;
    END IF;

    IF EXISTS (SELECT 1 FROM auth.roles WHERE code = 'INVENTORY_STAFF') THEN
        UPDATE auth.roles SET name = 'Thủ kho', description = 'Quản lý nhập xuất tồn và chuyển kho', fk_create_by = v_admin_id, fk_company_id = 1 WHERE code = 'INVENTORY_STAFF' RETURNING id INTO v_role_stock_id;
    ELSE
        INSERT INTO auth.roles (fk_company_id, fk_create_by, code, name, description)
        VALUES (1, v_admin_id, 'INVENTORY_STAFF', 'Thủ kho', 'Quản lý nhập xuất tồn và chuyển kho')
        RETURNING id INTO v_role_stock_id;
    END IF;

    -- Permissions
    FOR v_perm_id IN SELECT id FROM auth.permissions LOOP
        INSERT INTO auth.role_permissions (fk_role_id, fk_permission_id)
        VALUES (v_role_admin_id, v_perm_id)
        ON CONFLICT (fk_role_id, fk_permission_id) DO NOTHING;

        INSERT INTO auth.role_permissions (fk_role_id, fk_permission_id)
        VALUES (v_role_manager_id, v_perm_id)
        ON CONFLICT (fk_role_id, fk_permission_id) DO NOTHING;
    END LOOP;

    -- Employees
    IF EXISTS (SELECT 1 FROM business.employees WHERE fk_account_id = v_admin_id) THEN
        UPDATE business.employees SET fk_role_id = v_role_admin_id, employee_code = 'NV0001', position_name = 'Quản trị viên hệ thống' WHERE fk_account_id = v_admin_id;
    ELSE
        INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id, employee_code, position_name)
        VALUES (v_admin_id, 1, v_role_admin_id, 'NV0001', 'Quản trị viên hệ thống');
    END IF;

    IF EXISTS (SELECT 1 FROM business.employees WHERE fk_account_id = v_quanly_id) THEN
        UPDATE business.employees SET fk_role_id = v_role_manager_id, employee_code = 'NV0002', position_name = 'Cửa hàng trưởng' WHERE fk_account_id = v_quanly_id;
    ELSE
        INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id, employee_code, position_name)
        VALUES (v_quanly_id, 1, v_role_manager_id, 'NV0002', 'Cửa hàng trưởng');
    END IF;

    IF EXISTS (SELECT 1 FROM business.employees WHERE fk_account_id = v_thungan_id) THEN
        UPDATE business.employees SET fk_role_id = v_role_cashier_id, employee_code = 'NV0003', position_name = 'Trưởng quầy thu ngân' WHERE fk_account_id = v_thungan_id;
    ELSE
        INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id, employee_code, position_name)
        VALUES (v_thungan_id, 1, v_role_cashier_id, 'NV0003', 'Trưởng quầy thu ngân');
    END IF;

    IF EXISTS (SELECT 1 FROM business.employees WHERE fk_account_id = v_banhang1_id) THEN
        UPDATE business.employees SET fk_role_id = v_role_sales_id, employee_code = 'NV0004', position_name = 'Chuyên viên tư vấn Vàng ta' WHERE fk_account_id = v_banhang1_id;
    ELSE
        INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id, employee_code, position_name)
        VALUES (v_banhang1_id, 1, v_role_sales_id, 'NV0004', 'Chuyên viên tư vấn Vàng ta');
    END IF;

    IF EXISTS (SELECT 1 FROM business.employees WHERE fk_account_id = v_banhang2_id) THEN
        UPDATE business.employees SET fk_role_id = v_role_sales_id, employee_code = 'NV0005', position_name = 'Chuyên viên tư vấn Kim Cương' WHERE fk_account_id = v_banhang2_id;
    ELSE
        INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id, employee_code, position_name)
        VALUES (v_banhang2_id, 1, v_role_sales_id, 'NV0005', 'Chuyên viên tư vấn Kim Cương');
    END IF;

    IF EXISTS (SELECT 1 FROM business.employees WHERE fk_account_id = v_thukho_id) THEN
        UPDATE business.employees SET fk_role_id = v_role_stock_id, employee_code = 'NV0006', position_name = 'Quản lý kho vàng & trang sức' WHERE fk_account_id = v_thukho_id;
    ELSE
        INSERT INTO business.employees (fk_account_id, fk_company_id, fk_role_id, employee_code, position_name)
        VALUES (v_thukho_id, 1, v_role_stock_id, 'NV0006', 'Quản lý kho vàng & trang sức');
    END IF;

    SELECT id INTO v_emp_banhang1_id FROM business.employees WHERE fk_account_id = v_banhang1_id;
    SELECT id INTO v_emp_banhang2_id FROM business.employees WHERE fk_account_id = v_banhang2_id;

    ---------------------------------------------------------------------------
    -- 3. KHO BÃI (WAREHOUSES)
    ---------------------------------------------------------------------------
    INSERT INTO inventory.warehouses (code, name, address)
    VALUES ('MAIN', 'Kho chính trung tâm', 'Tầng hầm an ninh - 128 Hai Bà Trưng, Q1, TP.HCM')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
    RETURNING id INTO v_wh_main_id;

    INSERT INTO inventory.warehouses (code, name, address)
    VALUES ('KHO_TRUNGBAY', 'Tủ trưng bày Tầng 1 (Vàng & Bạc)', 'Khu vực quầy sảnh Tầng 1')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
    RETURNING id INTO v_wh_display_id;

    INSERT INTO inventory.warehouses (code, name, address)
    VALUES ('KHO_VIP', 'Quầy VIP Tầng 2 (Kim Cương & Đá Quý)', 'Phòng tư vấn VIP Tầng 2')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
    RETURNING id INTO v_wh_vip_id;

    INSERT INTO inventory.warehouses (code, name, address)
    VALUES ('KHO_GIACONG', 'Xưởng chế tác & xi mạ kim hoàn', 'Phòng kỹ thuật lầu 3')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
    RETURNING id INTO v_wh_craft_id;

    ---------------------------------------------------------------------------
    -- 4. NHÓM TEM (TAG CATEGORIES)
    ---------------------------------------------------------------------------
    INSERT INTO catalog.tag_categories (code, name, description)
    VALUES ('TEM_VANG', 'Tem Vàng 24K', 'Tem chuyên biệt cho nhẫn trơn, kiềng vàng, vàng miếng 9999.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_tag_vang_id;

    INSERT INTO catalog.tag_categories (code, name, description)
    VALUES ('TEM_BAC', 'Tem Bạc Ý 925', 'Tem dùng cho dòng trang sức bạc và charm cao cấp.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_tag_bac_id;

    INSERT INTO catalog.tag_categories (code, name, description)
    VALUES ('TEM_AP_GIA', 'Tem Áp Giá Cố Định', 'Sản phẩm đã niêm yết giá bán niêm yết không tính theo chỉ.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_tag_apgia_id;

    INSERT INTO catalog.tag_categories (code, name, description)
    VALUES ('TEM_VANG_TAY', 'Tem Vàng Tây 18K/14K', 'Tem cho nhẫn cưới, dây chuyền, lắc tay vàng 18K và 14K.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_tag_tay_id;

    INSERT INTO catalog.tag_categories (code, name, description)
    VALUES ('TEM_KIM_CUONG', 'Tem Kim Cương GIA', 'Tem trang sức gắn kim cương thiên nhiên có mã chứng thư.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_tag_kc_id;

    INSERT INTO catalog.tag_categories (code, name, description)
    VALUES ('TEM_CUOI', 'Tem Bộ Trang Sức Cưới', 'Bộ trang sức cưới trọn gói (kiềng, lắc, nhẫn, bông tai).')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_tag_cuoi_id;

    ---------------------------------------------------------------------------
    -- 5. NHÀ CUNG CẤP (SUPPLIERS)
    ---------------------------------------------------------------------------
    INSERT INTO business.suppliers (fk_tag_category_id, code, name, phone, email, address, tax_code)
    VALUES (v_tag_vang_id, 'SJC', 'Công ty Vàng Bạc Đá Quý Sài Gòn (SJC)', '028 3929 6016', 'kinhdoanh@sjc.com.vn', '418-420 Nguyễn Thị Minh Khai, Q3, TP.HCM', '0300523958')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address
    RETURNING id INTO v_sup_sjc_id;

    INSERT INTO business.suppliers (fk_tag_category_id, code, name, phone, email, address, tax_code)
    VALUES (v_tag_vang_id, 'DOJI', 'Tập đoàn Vàng Bạc Đá Quý DOJI', '1800 1168', 'cskh@doji.vn', 'Tòa nhà DOJI Tower, 5 Lê Duẩn, Ba Đình, Hà Nội', '0100361006')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address
    RETURNING id INTO v_sup_doji_id;

    INSERT INTO business.suppliers (fk_tag_category_id, code, name, phone, email, address, tax_code)
    VALUES (v_tag_tay_id, 'PNJ', 'Công ty CP Vàng Bạc Đá Quý Phú Nhuận (PNJ)', '1800 5454 57', 'pnj@pnj.com.vn', '170E Phan Đăng Lưu, P3, Q.Phú Nhuận, TP.HCM', '0300521758')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address
    RETURNING id INTO v_sup_pnj_id;

    INSERT INTO business.suppliers (fk_tag_category_id, code, name, phone, email, address, tax_code)
    VALUES (v_tag_kc_id, 'GIA_IMPORT', 'Viện Đá Quý & Kim Cương GIA Quốc Tế', '028 3823 8888', 'diamonds@gia-import.vn', 'Tầng 18 Vincom Center, 72 Lê Thánh Tôn, Q1, TP.HCM', '0312984571')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address
    RETURNING id INTO v_sup_gia_id;

    INSERT INTO business.suppliers (fk_tag_category_id, code, name, phone, email, address, tax_code)
    VALUES (v_tag_bac_id, 'ITALY_SILVER', 'Công ty Kim Hoàn Bạc Ý & Phụ Kiện Milano', '028 3844 7766', 'sales@italysilver.vn', '45 Lê Văn Sỹ, P13, Q.Phú Nhuận, TP.HCM', '0315487923')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address
    RETURNING id INTO v_sup_italy_id;

    INSERT INTO business.suppliers (fk_tag_category_id, code, name, phone, email, address, tax_code)
    VALUES (v_tag_kc_id, 'LUC_YEN_GEMS', 'Cơ Sở Khai Thác & Chế Tác Đá Quý Lục Yên', '0912 888 999', 'lucyengems@gmail.com', 'Thị trấn Yên Thế, Huyện Lục Yên, Tỉnh Yên Bái', '5200894561')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address
    RETURNING id INTO v_sup_lucyen_id;

    ---------------------------------------------------------------------------
    -- 6. LOẠI VÀNG (GOLD TYPES)
    ---------------------------------------------------------------------------
    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('9999', 'Vàng 9999 (24K Chuẩn)', 99.9900, 'Vàng Ta 99.99% dùng tích trữ, vàng miếng và nhẫn trơn.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_9999_id;

    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('24K', 'Vàng 24K Trang Sức', 99.9000, 'Vàng 24K dẻo dùng chế tác kiềng cưới, lắc tay hoa mai.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_24k_id;

    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('18K', 'Vàng Ý 18K (750)', 75.0000, 'Vàng Ý 750 độ sáng bóng cao, bền đẹp cho trang sức hiện đại.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_18k_id;

    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('14K', 'Vàng Tây 14K (585)', 58.5000, 'Vàng Tây 14K độ cứng lý tưởng để đính ngọc trai và đá quý.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_14k_id;

    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('BAC', 'Bạc Ý 925 Chuẩn', 92.5000, 'Bạc Ý 92.5% mạ rhodium cao cấp chống xỉn màu.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_bac_id;

    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('VANG_TRANG_18K', 'Vàng Trắng 18K (White Gold)', 75.0000, 'Hợp kim vàng trắng 18K chuyên dùng đính kim cương thiên nhiên.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_trang_id;

    INSERT INTO catalog.gold_types (code, name, purity, description)
    VALUES ('10K', 'Vàng Tây 10K (416)', 41.6000, 'Vàng 10K giá thành tiếp cận, độ bền cơ học cao.')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, purity = EXCLUDED.purity
    RETURNING id INTO v_gold_10k_id;

    ---------------------------------------------------------------------------
    -- 7. KHÁCH HÀNG (CUSTOMERS)
    ---------------------------------------------------------------------------
    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0001', 'Nguyễn Thị Bích Thủy', '0912345678', 'bichthuy@gmail.com', 'Căn hộ Grand Marina, Q1, TP.HCM', 'VIP Kim Cương', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_1_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0002', 'Trần Đức Long', '0988765432', 'long.tran@fpt.com.vn', 'Số 15 Trung Hòa, Cầu Giấy, Hà Nội', 'VIP Vàng', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_2_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0003', 'Võ Phương Thảo', '0903112233', 'phuongthao.vo@gmail.com', '72 Trương Định, Phường 9, Quận 3, TP.HCM', 'Thành viên Bạc', 500000)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_3_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0004', 'Đặng Minh Trí', '0938998877', 'tri.dang@vinfast.vn', 'Vinhomes Central Park, Bình Thạnh, TP.HCM', 'Thành viên Bạc', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_4_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0005', 'Phạm Hoàng Nam', '0975667788', 'nam.pham@techcombank.com.vn', 'Phú Mỹ Hưng, Quận 7, TP.HCM', 'Thành viên Đồng', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_5_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0006', 'Hoàng Yến Nhi', '0918554433', 'yennhi.hoang@gmail.com', '12 Láng Hạ, Đống Đa, Hà Nội', 'Thành viên Đồng', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_6_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0007', 'Trịnh Đình Quang', '0944223344', 'quang.trinh@gmail.com', 'Phố Huế, Hoàn Kiếm, Hà Nội', 'Khách mới', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_7_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0008', 'Vũ Hải Yến', '0908666888', 'haiyen.vu@luxury.vn', 'Biệt thự Thảo Điền, TP. Thủ Đức, TP.HCM', 'VIP Kim Cương', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_8_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0009', 'Bùi Tuấn Anh', '0966123789', 'tuananh.bui@viettel.com.vn', '124 Cộng Hòa, Phường 12, Tân Bình, TP.HCM', 'VIP Vàng', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_9_id;

    INSERT INTO business.customers (code, name, phone, email, address, rank_name, debt_amount)
    VALUES ('KH0010', 'Mai Hương Giang', '0982456789', 'huonggiang.mai@gmail.com', 'Bà Triệu, Hai Bà Trưng, Hà Nội', 'Khách mới', 0)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, rank_name = EXCLUDED.rank_name
    RETURNING id INTO v_cust_10_id;

    ---------------------------------------------------------------------------
    -- 8. SẢN PHẨM TRANG SỨC & VÀNG (PRODUCTS)
    ---------------------------------------------------------------------------
    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_9999_id, v_sup_sjc_id, 'NTT-9999-1C', 'Nhẫn Tròn Trơn SJC 1 Chỉ 9999', 'Nhẫn Vàng Ta', 'chỉ',
        1.000, 1.000, 0.000, 80000, 0, 50000, 0,
        8300000, 8150000, 8550000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_ntt1_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_9999_id, v_sup_sjc_id, 'NTT-9999-2C', 'Nhẫn Tròn Trơn SJC 2 Chỉ 9999', 'Nhẫn Vàng Ta', 'chỉ',
        2.000, 2.000, 0.000, 150000, 0, 90000, 0,
        16600000, 16300000, 17100000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_ntt2_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_9999_id, v_sup_sjc_id, 'NTT-9999-5C', 'Nhẫn Tròn Trơn SJC 5 Chỉ 9999', 'Nhẫn Vàng Ta', 'chỉ',
        5.000, 5.000, 0.000, 300000, 0, 180000, 0,
        41500000, 40750000, 42750000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_ntt5_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_9999_id, v_sup_sjc_id, 'SJC-1L', 'Vàng Miếng SJC 1 Lượng 9999', 'Vàng Miếng', 'lượng',
        10.000, 10.000, 0.000, 0, 0, 0, 0,
        86000000, 84500000, 88500000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_sjc1l_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_24k_id, v_sup_doji_id, 'DC-24K-RONG-5C', 'Dây Chuyền Nam Chạm Rồng Vàng 24K 5 Chỉ', 'Dây Chuyền', 'sợi',
        5.200, 5.000, 0.200, 1200000, 0, 750000, 0,
        42500000, 41000000, 44800000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_dcrong_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_24k_id, v_sup_pnj_id, 'LT-24K-HOAMAI-3C', 'Lắc Tay Nữ Vàng 24K Hoa Mai May Mắn 3 Chỉ', 'Lắc Tay', 'chiếc',
        3.150, 3.000, 0.150, 950000, 0, 600000, 0,
        25600000, 24600000, 27200000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_lthoamai_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_24k_id, v_sup_pnj_id, 'KIENG-CUOI-24K', 'Kiềng Cưới Truyền Thống Vàng 24K 3 Chỉ', 'Bộ Trang Sức Cưới', 'chiếc',
        3.000, 3.000, 0.000, 800000, 0, 500000, 0,
        25500000, 24500000, 26900000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_kiengcuoi_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_trang_id, v_sup_gia_id, 'NDH-KC-18K', 'Nhẫn Đính Hôn Kim Cương GIA 5.4 Ly Vàng Trắng 18K', 'Trang Sức Kim Cương', 'chiếc',
        1.100, 0.900, 0.200, 2500000, 32000000, 1500000, 26000000,
        34000000, 30000000, 42500000, TRUE, 10.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_ndhkc_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_trang_id, v_sup_gia_id, 'NN-KC-HALO-18K', 'Nhẫn Nữ Kim Cương Halo Vàng Trắng 18K Quý Phái', 'Trang Sức Kim Cương', 'chiếc',
        1.250, 1.050, 0.200, 2200000, 18000000, 1400000, 14500000,
        21500000, 19000000, 26800000, TRUE, 10.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_nnkchalo_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_trang_id, v_sup_gia_id, 'DC-KC-TT-18K', 'Dây Chuyền Mặt Kim Cương Trái Tim Vàng Trắng 18K', 'Trang Sức Kim Cương', 'sợi',
        0.950, 0.850, 0.100, 1800000, 14500000, 1100000, 11500000,
        17200000, 15000000, 21900000, TRUE, 10.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_dckctt_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_trang_id, v_sup_gia_id, 'BT-KC-NU-45', 'Bông Tai Kim Cương Nụ 4.5 Ly Vàng Trắng 18K', 'Trang Sức Kim Cương', 'đôi',
        0.800, 0.650, 0.150, 1500000, 16000000, 950000, 13000000,
        18500000, 16000000, 23500000, TRUE, 10.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_btkcnu_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_18k_id, v_sup_pnj_id, 'NC-HP-18K-CAP', 'Cặp Nhẫn Cưới Hạnh Phúc Vàng Ý 18K', 'Nhẫn Cưới', 'cặp',
        1.800, 1.700, 0.100, 1500000, 1800000, 950000, 1200000,
        12500000, 11000000, 15800000, TRUE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_nchp_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_18k_id, v_sup_doji_id, 'LT-Y750-BIPHAY', 'Lắc Tay Vàng Ý 750 Bi Phay Kim Tiền May Mắn', 'Lắc Tay', 'chiếc',
        2.200, 2.200, 0.000, 1100000, 0, 700000, 0,
        13800000, 12500000, 16200000, FALSE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_lty750_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_14k_id, v_sup_pnj_id, 'BT-14K-NGTO', 'Bông Tai Nữ Vàng Tây 14K Đính Ngọc Trai Biển Phú Quốc', 'Bông Tai', 'đôi',
        0.900, 0.600, 0.300, 850000, 2800000, 500000, 2000000,
        5800000, 4800000, 7600000, TRUE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_bt14k_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_18k_id, v_sup_lucyen_id, 'NN-18K-RUBY', 'Nhẫn Nam Vàng 18K Mặt Đá Ruby Đỏ Huyết Bồ Câu Tự Nhiên', 'Nhẫn Nam', 'chiếc',
        2.800, 2.100, 0.700, 2400000, 12500000, 1600000, 9500000,
        22800000, 19500000, 28500000, TRUE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_nnruby_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_bac_id, v_sup_italy_id, 'VT-BAC-PAN-925', 'Vòng Tay Bạc Ý 925 Cao Cấp Kèm 3 Charm Bạc', 'Trang Sức Bạc', 'chiếc',
        1.500, 0.000, 0.000, 250000, 0, 150000, 0,
        950000, 750000, 1450000, TRUE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_vtpan_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_bac_id, v_sup_italy_id, 'DC-BAC-HC-925', 'Dây Chuyền Nữ Bạc Ý 925 Mặt Hoa Cúc Đính Đá CZ', 'Trang Sức Bạc', 'sợi',
        0.850, 0.000, 0.000, 180000, 0, 100000, 0,
        580000, 420000, 890000, TRUE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_dcbachc_id;

    INSERT INTO catalog.products (
        fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
        weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
        cost_price, purchase_price, sale_price, is_fixed_price, vat_rate
    ) VALUES (
        v_gold_24k_id, v_sup_lucyen_id, 'MDC-24K-DILAC', 'Mặt Dây Chuyền Phật Di Lặc Vàng 24K Bọc Ngọc Cẩm Thạch', 'Mặt Dây Chuyền', 'mặt',
        1.800, 1.200, 0.600, 1100000, 4500000, 700000, 3200000,
        12800000, 11000000, 15500000, TRUE, 0.00
    ) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price RETURNING id INTO v_p_mdcdilac_id;

    ---------------------------------------------------------------------------
    -- 9. TỒN KHO (STOCK BALANCES)
    ---------------------------------------------------------------------------
    INSERT INTO inventory.stock_balances (fk_warehouse_id, fk_product_id, quantity, min_quantity, location_code)
    VALUES
        (v_wh_main_id, v_p_ntt1_id, 85.000, 10.000, 'KET-A1-01'),
        (v_wh_main_id, v_p_ntt2_id, 45.000, 5.000, 'KET-A1-02'),
        (v_wh_main_id, v_p_ntt5_id, 20.000, 2.000, 'KET-A1-03'),
        (v_wh_main_id, v_p_sjc1l_id, 35.000, 5.000, 'KET-DAC-BIET-01'),
        (v_wh_main_id, v_p_dcrong_id, 12.000, 2.000, 'KET-A2-01'),
        (v_wh_main_id, v_p_lthoamai_id, 15.000, 2.000, 'KET-A2-02'),
        (v_wh_main_id, v_p_kiengcuoi_id, 8.000, 1.000, 'KET-A2-03'),
        (v_wh_main_id, v_p_ndhkc_id, 6.000, 1.000, 'KET-VIP-01'),
        (v_wh_main_id, v_p_nnkchalo_id, 8.000, 1.000, 'KET-VIP-02'),
        (v_wh_main_id, v_p_dckctt_id, 10.000, 2.000, 'KET-VIP-03'),
        (v_wh_main_id, v_p_btkcnu_id, 7.000, 1.000, 'KET-VIP-04'),
        (v_wh_main_id, v_p_nchp_id, 14.000, 3.000, 'KET-B1-01'),
        (v_wh_main_id, v_p_lty750_id, 18.000, 3.000, 'KET-B1-02'),
        (v_wh_main_id, v_p_bt14k_id, 16.000, 2.000, 'KET-B2-01'),
        (v_wh_main_id, v_p_nnruby_id, 5.000, 1.000, 'KET-VIP-05'),
        (v_wh_main_id, v_p_vtpan_id, 28.000, 5.000, 'KET-C1-01'),
        (v_wh_main_id, v_p_dcbachc_id, 32.000, 5.000, 'KET-C1-02'),
        (v_wh_main_id, v_p_mdcdilac_id, 9.000, 2.000, 'KET-A3-01')
    ON CONFLICT (fk_warehouse_id, fk_product_id) DO UPDATE
    SET quantity = EXCLUDED.quantity, min_quantity = EXCLUDED.min_quantity, location_code = EXCLUDED.location_code, updated_at = CURRENT_TIMESTAMP;

    INSERT INTO inventory.stock_balances (fk_warehouse_id, fk_product_id, quantity, min_quantity, location_code)
    VALUES
        (v_wh_display_id, v_p_ntt1_id, 15.000, 3.000, 'TU-01-KHAY-A'),
        (v_wh_display_id, v_p_ntt2_id, 10.000, 2.000, 'TU-01-KHAY-B'),
        (v_wh_display_id, v_p_dcrong_id, 4.000, 1.000, 'TU-02-GIA-TREO'),
        (v_wh_display_id, v_p_lthoamai_id, 5.000, 1.000, 'TU-02-KHAY-NHUNG'),
        (v_wh_display_id, v_p_kiengcuoi_id, 3.000, 1.000, 'TU-CUOI-TRUNG-TAM'),
        (v_wh_display_id, v_p_nchp_id, 6.000, 1.000, 'TU-CUOI-KHAY-C1'),
        (v_wh_display_id, v_p_lty750_id, 8.000, 2.000, 'TU-03-KHAY-Y750'),
        (v_wh_display_id, v_p_bt14k_id, 7.000, 2.000, 'TU-03-KHAY-14K'),
        (v_wh_display_id, v_p_vtpan_id, 15.000, 3.000, 'TU-BAC-PANDORA'),
        (v_wh_display_id, v_p_dcbachc_id, 18.000, 3.000, 'TU-BAC-DAY-CHUYEN')
    ON CONFLICT (fk_warehouse_id, fk_product_id) DO UPDATE
    SET quantity = EXCLUDED.quantity, min_quantity = EXCLUDED.min_quantity, location_code = EXCLUDED.location_code, updated_at = CURRENT_TIMESTAMP;

    INSERT INTO inventory.stock_balances (fk_warehouse_id, fk_product_id, quantity, min_quantity, location_code)
    VALUES
        (v_wh_vip_id, v_p_ndhkc_id, 4.000, 1.000, 'TU-VIP-DIAMOND-01'),
        (v_wh_vip_id, v_p_nnkchalo_id, 5.000, 1.000, 'TU-VIP-DIAMOND-02'),
        (v_wh_vip_id, v_p_dckctt_id, 6.000, 1.000, 'TU-VIP-DIAMOND-03'),
        (v_wh_vip_id, v_p_btkcnu_id, 4.000, 1.000, 'TU-VIP-DIAMOND-04'),
        (v_wh_vip_id, v_p_nnruby_id, 3.000, 1.000, 'TU-VIP-GEMSTONE-01'),
        (v_wh_vip_id, v_p_mdcdilac_id, 4.000, 1.000, 'TU-VIP-GEMSTONE-02')
    ON CONFLICT (fk_warehouse_id, fk_product_id) DO UPDATE
    SET quantity = EXCLUDED.quantity, min_quantity = EXCLUDED.min_quantity, location_code = EXCLUDED.location_code, updated_at = CURRENT_TIMESTAMP;

    ---------------------------------------------------------------------------
    -- 10. BIẾN ĐỘNG KHO (INVENTORY MOVEMENTS)
    ---------------------------------------------------------------------------
    INSERT INTO inventory.inventory_movements (code, movement_type, fk_source_warehouse_id, fk_target_warehouse_id, fk_product_id, quantity, unit_cost, note, created_at)
    VALUES
        ('NK-20261001-0001', 'import', NULL, v_wh_main_id, v_p_sjc1l_id, 40.000, 86000000, 'Nhập lô vàng miếng SJC 1 lượng đợt đầu tháng 10', CURRENT_TIMESTAMP - INTERVAL '7 day'),
        ('NK-20261001-0002', 'import', NULL, v_wh_main_id, v_p_ntt1_id, 100.000, 8300000, 'Nhập nhẫn tròn trơn 1 chỉ SJC 9999', CURRENT_TIMESTAMP - INTERVAL '7 day'),
        ('NK-20261002-0001', 'import', NULL, v_wh_main_id, v_p_ndhkc_id, 10.000, 34000000, 'Nhập nhẫn đính hôn kim cương tự nhiên kèm chứng thư GIA', CURRENT_TIMESTAMP - INTERVAL '6 day'),
        ('NK-20261002-0002', 'import', NULL, v_wh_main_id, v_p_vtpan_id, 50.000, 950000, 'Nhập trang sức bạc Ý 925 Milano', CURRENT_TIMESTAMP - INTERVAL '6 day'),
        ('CK-20261003-0001', 'transfer', v_wh_main_id, v_wh_display_id, v_p_ntt1_id, 15.000, 8300000, 'Xuất kho chính trưng bày sảnh Tầng 1', CURRENT_TIMESTAMP - INTERVAL '5 day'),
        ('CK-20261003-0002', 'transfer', v_wh_main_id, v_wh_vip_id, v_p_ndhkc_id, 4.000, 34000000, 'Chuyển nhẫn kim cương lên phòng VIP Tầng 2', CURRENT_TIMESTAMP - INTERVAL '5 day'),
        ('CK-20261004-0001', 'transfer', v_wh_main_id, v_wh_display_id, v_p_vtpan_id, 15.000, 950000, 'Trưng bày quầy bạc Tầng 1', CURRENT_TIMESTAMP - INTERVAL '4 day'),
        ('NK-20261005-0001', 'import', NULL, v_wh_main_id, v_p_nnruby_id, 8.000, 22800000, 'Nhập đá Ruby Lục Yên tự nhiên kiểm định', CURRENT_TIMESTAMP - INTERVAL '3 day')
    ON CONFLICT (code) DO NOTHING;

    ---------------------------------------------------------------------------
    -- 11. HÓA ĐƠN & GIAO DỊCH BÁN HÀNG (SALES TRANSACTIONS & DETAILS)
    ---------------------------------------------------------------------------
    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261001-001', 'sale'::public.transaction_type, 'transfer', 17000000, 17000000, 'completed'::public.transaction_status, v_cust_1_id, v_emp_banhang1_id, CURRENT_TIMESTAMP - INTERVAL '6 day', CURRENT_TIMESTAMP - INTERVAL '6 day')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_1_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_1_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES (v_tx_1_id, v_p_ntt1_id, v_wh_display_id, 2.000, 8550000, 100000, 17000000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261002-002', 'sale'::public.transaction_type, 'transfer', 88500000, 88500000, 'completed'::public.transaction_status, v_cust_2_id, v_emp_banhang1_id, CURRENT_TIMESTAMP - INTERVAL '5 day', CURRENT_TIMESTAMP - INTERVAL '5 day')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_2_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_2_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES (v_tx_2_id, v_p_sjc1l_id, v_wh_main_id, 1.000, 88500000, 0, 88500000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261003-003', 'sale'::public.transaction_type, 'card', 42000000, 42000000, 'completed'::public.transaction_status, v_cust_4_id, v_emp_banhang2_id, CURRENT_TIMESTAMP - INTERVAL '4 day', CURRENT_TIMESTAMP - INTERVAL '4 day')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_3_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_3_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES (v_tx_3_id, v_p_ndhkc_id, v_wh_vip_id, 1.000, 42500000, 500000, 42000000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261004-004', 'sale'::public.transaction_type, 'transfer', 42400000, 42400000, 'completed'::public.transaction_status, v_cust_5_id, v_emp_banhang1_id, CURRENT_TIMESTAMP - INTERVAL '3 day', CURRENT_TIMESTAMP - INTERVAL '3 day')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_4_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_4_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES
        (v_tx_4_id, v_p_nchp_id, v_wh_display_id, 1.000, 15800000, 300000, 15500000),
        (v_tx_4_id, v_p_kiengcuoi_id, v_wh_display_id, 1.000, 26900000, 0, 26900000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261005-005', 'sale'::public.transaction_type, 'cash', 23500000, 23000000, 'completed'::public.transaction_status, v_cust_3_id, v_emp_banhang2_id, CURRENT_TIMESTAMP - INTERVAL '2 day', CURRENT_TIMESTAMP - INTERVAL '2 day')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_5_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_5_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES
        (v_tx_5_id, v_p_lty750_id, v_wh_display_id, 1.000, 16200000, 300000, 15900000),
        (v_tx_5_id, v_p_bt14k_id, v_wh_display_id, 1.000, 7600000, 0, 7600000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261006-006', 'sale'::public.transaction_type, 'cash', 2300000, 2300000, 'completed'::public.transaction_status, v_cust_6_id, v_emp_banhang2_id, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_6_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_6_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES
        (v_tx_6_id, v_p_vtpan_id, v_wh_display_id, 1.000, 1450000, 40000, 1410000),
        (v_tx_6_id, v_p_dcbachc_id, v_wh_display_id, 1.000, 890000, 0, 890000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261007-007', 'sale'::public.transaction_type, 'transfer', 28000000, 28000000, 'completed'::public.transaction_status, v_cust_9_id, v_emp_banhang1_id, CURRENT_TIMESTAMP - INTERVAL '12 hour', CURRENT_TIMESTAMP - INTERVAL '12 hour')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_7_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_7_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES (v_tx_7_id, v_p_nnruby_id, v_wh_vip_id, 1.000, 28500000, 500000, 28000000);

    INSERT INTO sales.transactions (code, transaction_type, payment_method, total_amount, paid_amount, status, fk_customer_id, fk_employee_id, created_at, updated_at)
    VALUES ('HD-20261008-008', 'sale'::public.transaction_type, 'card', 26000000, 26000000, 'completed'::public.transaction_status, v_cust_8_id, v_emp_banhang2_id, CURRENT_TIMESTAMP - INTERVAL '2 hour', CURRENT_TIMESTAMP - INTERVAL '2 hour')
    ON CONFLICT (code) DO UPDATE SET total_amount = EXCLUDED.total_amount RETURNING id INTO v_tx_8_id;

    DELETE FROM sales.transaction_details WHERE fk_transaction_id = v_tx_8_id;
    INSERT INTO sales.transaction_details (fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount)
    VALUES (v_tx_8_id, v_p_nnkchalo_id, v_wh_vip_id, 1.000, 26800000, 800000, 26000000);

    ---------------------------------------------------------------------------
    -- 12. SỔ QUỸ (CASH BOOK ENTRIES)
    ---------------------------------------------------------------------------
    INSERT INTO finance.cash_book_entries (code, entry_type, payment_method, amount, title, description, status, occurred_at)
    VALUES
        ('SQ-20261001-001', 'income', 'transfer', 17000000, 'Thu tiền bán hàng hóa đơn HD-20261001-001', 'Khách hàng Nguyễn Thị Bích Thủy thanh toán chuyển khoản', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '6 day'),
        ('SQ-20261002-002', 'income', 'transfer', 88500000, 'Thu tiền bán hàng hóa đơn HD-20261002-002', 'Khách hàng Trần Đức Long mua vàng miếng SJC 1 lượng', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '5 day'),
        ('SQ-20261002-003', 'expense', 'transfer', 150000000, 'Chi thanh toán tiền hàng nhập vàng SJC đợt 1', 'Thanh toán ủy nhiệm chi qua Vietcombank cho Cty SJC', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '5 day'),
        ('SQ-20261003-004', 'income', 'card', 42000000, 'Thu tiền quẹt thẻ hóa đơn HD-20261003-003', 'Khách hàng Đặng Minh Trí mua nhẫn kim cương GIA 18K', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '4 day'),
        ('SQ-20261004-005', 'income', 'transfer', 42400000, 'Thu tiền bán hàng hóa đơn HD-20261004-004', 'Khách hàng Phạm Hoàng Nam mua cặp nhẫn cưới & kiềng cưới', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '3 day'),
        ('SQ-20261004-006', 'expense', 'transfer', 35000000, 'Chi thanh toán tiền thuê mặt bằng showroom Tháng 10', 'Thanh toán tiền thuê mặt bằng 128 Hai Bà Trưng, Q1', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '3 day'),
        ('SQ-20261005-007', 'income', 'cash', 23000000, 'Thu tiền mặt bán hàng hóa đơn HD-20261005-005', 'Khách hàng Võ Phương Thảo thanh toán tiền mặt tại quầy', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '2 day'),
        ('SQ-20261005-008', 'income', 'cash', 1200000, 'Thu tiền phí dịch vụ đánh bóng & xi mạ trang sức', 'Khách vãng lai làm mới dây chuyền và nhẫn cưới', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '2 day'),
        ('SQ-20261006-009', 'income', 'cash', 2300000, 'Thu tiền mặt bán hàng hóa đơn HD-20261006-006', 'Khách hàng Hoàng Yến Nhi mua trang sức bạc Ý', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '1 day'),
        ('SQ-20261006-010', 'expense', 'cash', 4850000, 'Chi tiền điện nước & internet showroom tháng 9', 'Thanh toán tiền điện lực EVN và cước mạng VNPT', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '1 day'),
        ('SQ-20261007-011', 'income', 'transfer', 28000000, 'Thu tiền bán hàng hóa đơn HD-20261007-007', 'Khách hàng Bùi Tuấn Anh mua nhẫn nam Ruby Lục Yên', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '12 hour'),
        ('SQ-20261008-012', 'income', 'card', 26000000, 'Thu tiền quẹt thẻ hóa đơn HD-20261008-008', 'Khách hàng Vũ Hải Yến mua nhẫn kim cương Halo 18K', 'active'::public.record_type, CURRENT_TIMESTAMP - INTERVAL '2 hour')
    ON CONFLICT (code) DO UPDATE SET amount = EXCLUDED.amount, title = EXCLUDED.title, description = EXCLUDED.description;

END
$$;

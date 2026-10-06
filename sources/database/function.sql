CREATE OR REPLACE FUNCTION public.fs_response (
    p_status BOOLEAN,
    p_message TEXT,
    p_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN jsonb_build_object(
        'success', p_status,
        'msg', p_message,
        'data', COALESCE(p_data, 'null'::jsonb)
    );
END;
$$;


CREATE OR REPLACE FUNCTION auth.get_account_info (
    p_account_id BIGINT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_data JSONB;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM auth.accounts
        WHERE id = p_account_id
    ) THEN
        RETURN public.fs_response(FALSE, 'error.account.not_found'::TEXT, NULL::JSONB);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM auth.profiles
        WHERE fk_account_id = p_account_id
    ) THEN
        RETURN public.fs_response(FALSE, 'error.profile.not_found'::TEXT, NULL::JSONB);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM business.employees
        WHERE fk_account_id = p_account_id
    ) THEN
        RETURN public.fs_response(FALSE, 'error.employee.not_found'::TEXT, NULL::JSONB);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM business.employees
        WHERE fk_account_id = p_account_id
          AND status = 'active'::public.record_type
    ) THEN
        RETURN public.fs_response(FALSE, 'error.auth.employee_inactive'::TEXT, NULL::JSONB);
    END IF;

    SELECT jsonb_build_object(
        'account', jsonb_build_object(
            'uuid', a.uuid,
            'username', a.username
        ),
        'profile', jsonb_build_object(
            'uuid', p.uuid,
            'fullName', p.full_name,
            'email', p.email,
            'phone', p.phone,
            'image', CASE
                WHEN i.id IS NULL THEN NULL
                ELSE jsonb_build_object(
                    'uuid', i.uuid,
                    'name', i.name,
                    'url', i.url
                )
            END
        ),
        'employee', CASE
            WHEN e.id IS NULL THEN NULL
            ELSE jsonb_build_object(
                'uuid', e.uuid,
                'status', e.status,
                'company', CASE
                    WHEN c.id IS NULL THEN NULL
                    ELSE jsonb_build_object(
                        'uuid', c.uuid,
                        'name', c.name,
                        'address', c.address,
                        'phone', c.phone,
                        'email', c.email,
                        'taxCode', c.tax_code,
                        'status', c.status
                    )
                END
            )
        END,
        'role', CASE
            WHEN r.id IS NULL THEN NULL
            ELSE jsonb_build_object(
                'uuid', r.uuid,
                'name', r.name,
                'description', r.description
            )
        END,
        'permissions', COALESCE(
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'uuid', pe.uuid,
                    'code', pe.code,
                    'name', pe.name,
                    'description', pe.description,
                    'scope', pe.scope
                )
            ) FILTER (WHERE pe.id IS NOT NULL),
            '[]'::jsonb
        )
    )
    INTO v_data
    FROM auth.accounts a
    LEFT JOIN auth.profiles p ON p.fk_account_id = a.id
    LEFT JOIN public.images i ON i.id = p.fk_image_id
    LEFT JOIN business.employees e ON e.fk_account_id = a.id
    LEFT JOIN business.companies c ON c.id = e.fk_company_id
    LEFT JOIN auth.roles r ON r.id = e.fk_role_id
    LEFT JOIN auth.role_permissions rp ON rp.fk_role_id = r.id
    LEFT JOIN auth.permissions pe ON pe.id = rp.fk_permission_id
    WHERE a.id = p_account_id
    GROUP BY a.id, p.id, i.id, e.id, c.id, r.id;

    RETURN public.fs_response(TRUE, 'success.account.info'::TEXT, v_data);
END;
$$;

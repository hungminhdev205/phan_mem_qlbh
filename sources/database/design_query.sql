-- Danh sách sản phẩm có tìm kiếm và phân trang cho một cửa tiệm nội bộ.
SELECT
    p.uuid,
    p.code,
    p.name,
    p.category_name,
    gt.name AS gold_type_name,
    p.unit_name,
    p.weight AS total_weight,
    p.gold_weight,
    p.stone_weight,
    p.labor_cost,
    p.stone_cost,
    p.base_labor_cost,
    p.base_stone_cost,
    p.cost_price,
    p.purchase_price,
    p.sale_price,
    p.is_fixed_price,
    p.vat_rate,
    s.name AS supplier_name,
    tc.name AS tag_category_name,
    p.status
FROM catalog.products p
LEFT JOIN catalog.gold_types gt ON gt.id = p.fk_gold_type_id
LEFT JOIN business.suppliers s ON s.id = p.fk_supplier_id
LEFT JOIN catalog.tag_categories tc ON tc.id = s.fk_tag_category_id
WHERE
    p.status <> 'deleted'
    AND (
        :keyword IS NULL
        OR :keyword = ''
        OR p.code ILIKE CONCAT('%', :keyword, '%')
        OR p.name ILIKE CONCAT('%', :keyword, '%')
        OR p.category_name ILIKE CONCAT('%', :keyword, '%')
        OR gt.name ILIKE CONCAT('%', :keyword, '%')
        OR s.name ILIKE CONCAT('%', :keyword, '%')
        OR tc.name ILIKE CONCAT('%', :keyword, '%')
    )
ORDER BY p.name ASC
LIMIT :size
OFFSET (:page * :size);

-- Số lượng sản phẩm sau khi lọc.
SELECT COUNT(1)
FROM catalog.products p
LEFT JOIN catalog.gold_types gt ON gt.id = p.fk_gold_type_id
LEFT JOIN business.suppliers s ON s.id = p.fk_supplier_id
LEFT JOIN catalog.tag_categories tc ON tc.id = s.fk_tag_category_id
WHERE
    p.status <> 'deleted'
    AND (
        :keyword IS NULL
        OR :keyword = ''
        OR p.code ILIKE CONCAT('%', :keyword, '%')
        OR p.name ILIKE CONCAT('%', :keyword, '%')
        OR p.category_name ILIKE CONCAT('%', :keyword, '%')
        OR gt.name ILIKE CONCAT('%', :keyword, '%')
        OR s.name ILIKE CONCAT('%', :keyword, '%')
        OR tc.name ILIKE CONCAT('%', :keyword, '%')
    );

-- Báo cáo tồn kho theo sản phẩm và kho.
SELECT
    w.code AS warehouse_code,
    w.name AS warehouse_name,
    p.code AS product_code,
    p.name AS product_name,
    p.unit_name,
    p.gold_weight,
    p.stone_weight,
    sb.quantity,
    sb.min_quantity,
    sb.location_code,
    CASE
        WHEN sb.quantity <= 0 THEN 'out_of_stock'
        WHEN sb.quantity <= sb.min_quantity THEN 'low_stock'
        ELSE 'normal'
    END AS stock_status
FROM inventory.stock_balances sb
JOIN inventory.warehouses w ON w.id = sb.fk_warehouse_id
JOIN catalog.products p ON p.id = sb.fk_product_id
WHERE w.status <> 'deleted'
  AND p.status <> 'deleted'
ORDER BY w.code ASC, p.name ASC;

-- Báo cáo giao dịch bán hàng theo kỳ.
SELECT
    t.code,
    t.created_at,
    c.name AS customer_name,
    e.employee_code,
    t.payment_method,
    t.total_amount,
    t.paid_amount,
    t.status
FROM sales.transactions t
LEFT JOIN business.customers c ON c.id = t.fk_customer_id
LEFT JOIN business.employees e ON e.id = t.fk_employee_id
WHERE
    t.created_at >= :from_date
    AND t.created_at < :to_date
ORDER BY t.created_at DESC;

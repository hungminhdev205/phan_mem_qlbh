export interface TitleBarSubMenuItem {
  id: string
  label: string
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
  divider?: boolean
}

export interface TitleBarMenuItem {
  id: string
  label: string
  children?: TitleBarSubMenuItem[]
  onClick?: () => void
  disabled?: boolean
}

export const IMPLEMENTED_FEATURE_IDS = new Set<string>([
  'company_info',
  'gold_rates',
  'gold_types',
  'tag_categories',
  'jewelry_items',
  'customers',
  'suppliers',
  'pos_counter',
  'wholesale_counter',
  'buyback_gold',
  'exchange_gold',
  'order_custom',
  'stock_import',
  'stock_transfer',
  'barcode_print',
  'stock_audit',
  'receipt_voucher',
  'payment_voucher',
  'cash_book',
  'cashflow_report',
  'rpt_daily_sales',
  'rpt_sales_detail',
  'rpt_gold_buyback',
  'rpt_sales_by_staff',
  'rpt_profit_margin',
  'rpt_gold_weights',
  'rpt_shift_closing',
  'rpt_cash_book',
  'rpt_cashflow',
  'employees_list',
  'permissions',
  'exit'
])

export const isFeatureImplemented = (id: string): boolean => {
  if (id.startsWith('divider_') || id.startsWith('rpt_div_')) return true
  return IMPLEMENTED_FEATURE_IDS.has(id)
}

export const DEFAULT_TITLEBAR_MENUS: TitleBarMenuItem[] = [
  {
    id: 'system',
    label: 'Hệ thống',
    children: [
      { id: 'company_info', label: 'Thông tin tiệm vàng' },
      { id: 'connection_settings', label: 'Cấu hình kết nối máy chủ' },
      { id: 'backup_restore', label: 'Sao lưu & Phục hồi dữ liệu' },
      { id: 'divider_1', label: '', divider: true },
      { id: 'change_password', label: 'Đổi mật khẩu' },
      { id: 'exit', label: 'Đăng xuất tài khoản' }
    ]
  },
  {
    id: 'catalog',
    label: 'Danh mục',
    children: [
      { id: 'gold_rates', label: 'Bảng giá vàng thời gian thực' },
      { id: 'gold_types', label: 'Danh mục loại vàng & tuổi vàng' },
      { id: 'tag_categories', label: 'Danh mục tem' },
      { id: 'jewelry_items', label: 'Danh mục trang sức' },
      { id: 'stones_wages', label: 'Danh mục đá quý & tiền công' },
      { id: 'divider_2', label: '', divider: true },
      { id: 'customers', label: 'Quản lý khách hàng', shortcut: 'F3' },
      { id: 'suppliers', label: 'Nhà cung cấp / chành vàng' }
    ]
  },
  {
    id: 'sales',
    label: 'Bán hàng',
    children: [
      { id: 'pos_counter', label: 'Bàn bán lẻ vàng & trang sức (POS)', shortcut: 'F2' },
      { id: 'wholesale_counter', label: 'Bán buôn vàng & tính giá sỉ' },
      { id: 'buyback_gold', label: 'Thu mua vàng cũ / Vàng nguyên liệu' },
      { id: 'exchange_gold', label: 'Đổi hàng vàng cũ lấy vàng mới' },
      { id: 'order_custom', label: 'Nhận đơn đặt hàng chế tác trang sức' }
    ]
  },
  {
    id: 'craft',
    label: 'Sửa chữa gia công',
    children: [
      { id: 'repair_receipt', label: 'Lập phiếu nhận sửa chữa trang sức' },
      { id: 'craft_order', label: 'Lập phiếu gia công mẫu mới' },
      { id: 'assign_craftsman', label: 'Giao việc cho thợ kim hoàn' },
      { id: 'craft_inspect', label: 'Nghiệm thu, tính tuổi vàng & hao hụt' }
    ]
  },
  {
    id: 'stock',
    label: 'Kho hàng',
    children: [
      { id: 'stock_import', label: 'Lập phiếu nhập kho vàng mới' },
      { id: 'stock_transfer', label: 'Lập phiếu xuất chuyển kho / quầy' },
      { id: 'barcode_print', label: 'In tem mã vạch trang sức' },
      { id: 'stock_audit', label: 'Kiểm kê kho hàng & quầy trưng bày' }
    ]
  },
  {
    id: 'cashflow',
    label: 'Thu chi',
    children: [
      { id: 'receipt_voucher', label: 'Lập phiếu thu tiền mặt / CK' },
      { id: 'payment_voucher', label: 'Lập phiếu chi tiền' },
      { id: 'cash_book', label: 'Sổ quỹ tiền mặt' },
      { id: 'cashflow_report', label: 'Báo cáo lưu chuyển tiền tệ' }
    ]
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    children: [
      { id: 'rpt_daily_sales', label: 'Báo cáo doanh số bán hàng theo ngày', shortcut: 'F4' },
      { id: 'rpt_sales_detail', label: 'Báo cáo chi tiết hóa đơn bán hàng' },
      { id: 'rpt_gold_buyback', label: 'Báo cáo thu mua vàng cũ & trao đổi' },
      { id: 'rpt_sales_by_staff', label: 'Báo cáo doanh số theo nhân viên' },
      { id: 'rpt_profit_margin', label: 'Báo cáo lợi nhuận gộp theo món hàng' },
      { id: 'rpt_div_1', label: '', divider: true },
      { id: 'rpt_stock_summary', label: 'Báo cáo tổng hợp Nhập - Xuất - Tồn kho', shortcut: 'F5' },
      { id: 'rpt_gold_weights', label: 'Báo cáo chi tiết trọng lượng vàng & tiền công' },
      { id: 'rpt_gold_type_stock', label: 'Báo cáo tồn kho theo tuổi vàng (9999, 24K, 18K...)' },
      { id: 'rpt_stock_audit', label: 'Báo cáo kiểm kê kho & chênh lệch thực tế' },
      { id: 'rpt_low_stock_warning', label: 'Báo cáo cảnh báo tồn kho tối thiểu' },
      { id: 'rpt_div_2', label: '', divider: true },
      { id: 'rpt_cash_book', label: 'Sổ quỹ tiền mặt & tài khoản ngân hàng' },
      { id: 'rpt_cashflow', label: 'Báo cáo lưu chuyển tiền tệ thu chi' },
      { id: 'rpt_customer_debt', label: 'Báo cáo công nợ khách hàng' },
      { id: 'rpt_supplier_debt', label: 'Báo cáo công nợ nhà cung cấp / chành vàng' },
      { id: 'rpt_pawn_book', label: 'Báo cáo sổ theo dõi hợp đồng cầm đồ & tiền lãi' },
      { id: 'rpt_div_3', label: '', divider: true },
      { id: 'rpt_craft_wage', label: 'Báo cáo tiền công thợ gia công kim hoàn' },
      { id: 'rpt_loss_gold', label: 'Báo cáo hao hụt vàng trong chế tác' },
      { id: 'rpt_div_4', label: '', divider: true },
      { id: 'rpt_shift_closing', label: 'Báo cáo tổng kết chốt ca làm việc' },
      { id: 'rpt_pnl_summary', label: 'Báo cáo kết quả hoạt động kinh doanh (P&L)' }
    ]
  },
  {
    id: 'hr',
    label: 'Nhân sự',
    children: [
      { id: 'employees_list', label: 'Danh sách nhân viên' },
      { id: 'shifts_attendance', label: 'Phân ca làm việc' },
      { id: 'craft_wage_report', label: 'Bảng tính tiền công thợ kim hoàn' }
    ]
  },
  {
    id: 'admin',
    label: 'Quản trị',
    children: [
      { id: 'permissions', label: 'Phân quyền chức năng' },
      { id: 'audit_log', label: 'Nhật ký hoạt động (Audit log)' },
      { id: 'system_parameters', label: 'Thiết lập tham số bán lẻ' }
    ]
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    children: [
      { id: 'user_guide', label: 'Hướng dẫn sử dụng hệ thống' },
      { id: 'shortcuts_help', label: 'Danh mục phím tắt thao tác nhanh' },
      { id: 'check_updates', label: 'Kiểm tra bản cập nhật' },
      { id: 'about', label: 'Thông tin phần mềm' }
    ]
  }
]

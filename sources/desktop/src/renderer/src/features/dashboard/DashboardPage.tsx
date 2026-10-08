import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../auth/libs/useAuth'
import type { UserInfo } from '../auth/types'
import { ConnectionBadge } from '../connection/components/ConnectionBadge'
import { PersonRegular, AlertRegular, SettingsRegular, SignOutRegular } from '@fluentui/react-icons'
import { AppTitleBar } from '@renderer/components/ui/AppTitleBar'
import { DEFAULT_TITLEBAR_MENUS } from '@renderer/components/window'
import { MainFeatureNavbar } from '@renderer/components/ui/MainFeatureNavbar'

const getRoleLabel = (role: unknown): string => {
  if (!role) return 'Nhân viên'
  if (typeof role === 'string') return role
  if (typeof role === 'object' && role !== null) {
    const r = role as { name?: string; roleName?: string; label?: string }
    return r.name || r.roleName || r.label || 'Nhân viên'
  }
  return 'Nhân viên'
}

interface UserMenuProps {
  user: UserInfo | null
  onLogout: () => void
  onOpenSettings?: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const initial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.username
      ? user.username.charAt(0).toUpperCase()
      : 'U'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-7 h-7 flex items-center justify-center rounded text-titlebar-control hover:text-titlebar-text hover:bg-titlebar-control-hover active:bg-titlebar-control-active transition-colors cursor-pointer ${
          isOpen ? 'bg-titlebar-control-active text-titlebar-text' : ''
        }`}
        title={user?.fullName || user?.username || 'Tài khoản người dùng'}
        aria-label="Tài khoản"
        aria-expanded={isOpen}
      >
        <PersonRegular className="text-base" />
      </button>

      {isOpen && (
        <div
          className="absolute top-9 right-0 z-50 w-56 bg-card-bg border border-border-main rounded-xl shadow-xl p-3 animate-toast-in select-none text-left"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          {/* Thông tin tài khoản */}
          <div className="flex items-center gap-2.5 pb-2.5">
            <div className="w-8 h-8 rounded-full bg-brand text-text-inverse font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-text-primary truncate leading-tight">
                {user?.fullName || user?.username || 'Nhân viên'}
              </h4>
              <p className="text-[11px] text-text-secondary truncate mt-0.5">
                @{user?.username || 'user'}
              </p>
              <div className="mt-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-subtle-bg text-text-secondary border border-border-subtle">
                  {getRoleLabel(user?.role)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border-main my-1" />

          {/* Tùy chọn Cài đặt */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onOpenSettings?.()
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-text-primary hover:bg-subtle-bg transition-colors cursor-pointer"
          >
            <SettingsRegular className="text-base text-text-secondary" />
            <span>Cài đặt hệ thống</span>
          </button>

          {/* Nút Đăng xuất */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-status-offline hover:bg-status-offline-bg transition-colors cursor-pointer mt-0.5"
          >
            <SignOutRegular className="text-base text-status-offline" />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  )
}

import { PosSalePage } from '../business/PosSalePage'
import { GenericFeaturePage } from '../business/GenericFeaturePage'
import { TagSupplierPage } from '../business/TagSupplierPage'
import { ProductCatalogPage } from '../business/ProductCatalogPage'
import { CustomerPage } from '../business/CustomerPage'
import { InventoryPage } from '../business/InventoryPage'
import { SalesReportPage } from '../business/SalesReportPage'
import { CashBookPage } from '../business/CashBookPage'
import { StaffAdminPage } from '../business/StaffAdminPage'
import { BarcodePrintPage } from '../business/BarcodePrintPage'
import { GoldRatesPage } from '../business/GoldRatesPage'
import { GoldBuybackPage } from '../business/GoldBuybackPage'
import { CompanySettingsPage } from '../business/CompanySettingsPage'
import { CustomOrderPage } from '../business/CustomOrderPage'

const FEATURE_TITLES: Record<string, { label: string; category?: string }> = {
  company_info: { label: 'Thông Tin Doanh Nghiệp & Tiệm Vàng', category: 'Hệ thống' },
  connection_settings: { label: 'Cấu Hình Kết Nối Máy Chủ', category: 'Hệ thống' },
  backup_restore: { label: 'Sao Lưu & Phục Hồi Dữ Liệu', category: 'Hệ thống' },
  change_password: { label: 'Đổi Mật Khẩu Tài Khoản', category: 'Hệ thống' },
  gold_rates: { label: 'Bảng Giá Vàng Thời Gian Thực', category: 'Danh mục' },
  gold_types: { label: 'Danh Mục Loại Vàng & Tuổi Vàng', category: 'Danh mục' },
  tag_categories: { label: 'Danh Mục Tem Mã Vạch', category: 'Danh mục' },
  jewelry_items: { label: 'Danh Mục Sản Phẩm Trang Sức', category: 'Danh mục' },
  stones_wages: { label: 'Danh Mục Đá Quý & Tiền Công', category: 'Danh mục' },
  customers: { label: 'Quản Lý Hồ Sơ Khách Hàng', category: 'Danh mục' },
  suppliers: { label: 'Danh Mục Nhà Cung Cấp & Chành Vàng', category: 'Danh mục' },
  retail_trade: { label: 'Bàn Bán Lẻ Vàng & Trang Sức (POS)', category: 'Bán hàng' },
  pos_counter: { label: 'Bàn Bán Lẻ Vàng & Trang Sức (POS)', category: 'Bán hàng' },
  wholesale: { label: 'Bán Buôn Vàng & Tính Giá Sỉ', category: 'Bán hàng' },
  wholesale_counter: { label: 'Bán Buôn Vàng & Tính Giá Sỉ', category: 'Bán hàng' },
  buyback_gold: { label: 'Thu Mua Vàng Cũ / Vàng Nguyên Liệu', category: 'Bán hàng' },
  return_goods: { label: 'Phiếu Hồi Hàng / Thu Mua Vàng Cũ', category: 'Bán hàng' },
  exchange_gold: { label: 'Đổi Hàng Vàng Cũ Lấy Vàng Mới', category: 'Bán hàng' },
  exchange_goods: { label: 'Phiếu Đổi Hàng Vàng Trang Sức', category: 'Bán hàng' },
  orders: { label: 'Quản Lý Đơn Đặt Hàng Chế Tác', category: 'Bán hàng' },
  order_custom: { label: 'Nhận Đơn Đặt Hàng Chế Tác Trang Sức', category: 'Bán hàng' },
  repair_receipt: { label: 'Lập Phiếu Nhận Sửa Chữa Trang Sức', category: 'Sửa chữa' },
  craft_order: { label: 'Lập Phiếu Gia Công Mẫu Mới', category: 'Gia công' },
  assign_craftsman: { label: 'Giao Việc Cho Thợ Kim Hoàn', category: 'Gia công' },
  craft_inspect: { label: 'Nghiệm Thu, Tính Tuổi Vàng & Hao Hụt', category: 'Gia công' },
  import_stock: { label: 'Lập Phiếu Nhập Kho Vàng Mới', category: 'Kho hàng' },
  stock_import: { label: 'Lập Phiếu Nhập Kho Vàng Mới', category: 'Kho hàng' },
  transfer_stock: { label: 'Lập Phiếu Xuất Chuyển Kho / Quầy', category: 'Kho hàng' },
  stock_transfer: { label: 'Lập Phiếu Xuất Chuyển Kho / Quầy', category: 'Kho hàng' },
  barcode_print: { label: 'In Tem Mã Vạch Trang Sức Chuẩn Thông Tư 22', category: 'Kho hàng' },
  stock_audit: { label: 'Kiểm Kê Kho Hàng & Quầy Trưng Bày', category: 'Kho hàng' },
  receipt_voucher: { label: 'Lập Phiếu Thu Tiền Mặt / CK', category: 'Thu chi' },
  payment_voucher: { label: 'Lập Phiếu Chi Tiền Mặt / CK', category: 'Thu chi' },
  cash_book: { label: 'Sổ Quỹ Tiền Mặt & Ngân Hàng', category: 'Thu chi' },
  cashflow: { label: 'Quản Lý Thu Chi & Sổ Quỹ Tiền Mặt', category: 'Thu chi' },
  cashflow_report: { label: 'Báo Cáo Lưu Chuyển Tiền Tệ', category: 'Thu chi' },
  rpt_daily_sales: { label: 'Báo Cáo Doanh Số Bán Hàng Theo Ngày', category: 'Báo cáo' },
  rpt_sales_detail: { label: 'Báo Cáo Chi Tiết Hóa Đơn Bán Hàng', category: 'Báo cáo' },
  rpt_gold_buyback: { label: 'Báo Cáo Thu Mua Vàng Cũ & Trao Đổi', category: 'Báo cáo' },
  rpt_sales_by_staff: { label: 'Báo Cáo Doanh Số Theo Nhân Viên', category: 'Báo cáo' },
  rpt_profit_margin: { label: 'Báo Cáo Lợi Nhuận Gộp Theo Món Hàng', category: 'Báo cáo' },
  rpt_stock_summary: { label: 'Báo Cáo Tổng Hợp Nhập - Xuất - Tồn Kho', category: 'Báo cáo' },
  rpt_gold_weights: { label: 'Báo Cáo Chi Tiết Trọng Lượng Vàng & Tiền Công', category: 'Báo cáo' },
  rpt_gold_type_stock: { label: 'Báo Cáo Tồn Kho Theo Tuổi Vàng', category: 'Báo cáo' },
  rpt_stock_audit: { label: 'Báo Cáo Kiểm Kê Kho & Chênh Lệch Thực Tế', category: 'Báo cáo' },
  rpt_low_stock_warning: { label: 'Báo Cáo Cảnh Báo Tồn Kho Tối Thiểu', category: 'Báo cáo' },
  rpt_cash_book: { label: 'Sổ Quỹ Tiền Mặt & Tài Khoản Ngân Hàng', category: 'Báo cáo' },
  rpt_cashflow: { label: 'Báo Cáo Lưu Chuyển Tiền Tệ Thu Chi', category: 'Báo cáo' },
  rpt_customer_debt: { label: 'Báo Cáo Công Nợ Khách Hàng', category: 'Báo cáo' },
  rpt_supplier_debt: { label: 'Báo Cáo Công Nợ Nhà Cung Cấp / Chành Vàng', category: 'Báo cáo' },
  rpt_pawn_book: { label: 'Báo Cáo Sổ Theo Dõi Cầm Đồ & Tiền Lãi', category: 'Báo cáo' },
  rpt_craft_wage: { label: 'Báo Cáo Tiền Công Thợ Gia Công Kim Hoàn', category: 'Báo cáo' },
  rpt_loss_gold: { label: 'Báo Cáo Hao Hụt Vàng Trong Chế Tác', category: 'Báo cáo' },
  rpt_shift_closing: { label: 'Báo Cáo Tổng Kết Chốt Ca Làm Việc', category: 'Báo cáo' },
  rpt_pnl_summary: { label: 'Báo Cáo Kết Quả Kinh Doanh (P&L)', category: 'Báo cáo' },
  employees_list: { label: 'Danh Sách Nhân Viên & Người Dùng', category: 'Nhân sự' },
  shifts_attendance: { label: 'Phân Ca Làm Việc & Chấm Công', category: 'Nhân sự' },
  craft_wage_report: { label: 'Bảng Tính Tiền Công Thợ Kim Hoàn', category: 'Nhân sự' },
  permissions: { label: 'Phân Quyền Chức Năng & Vai Trò', category: 'Quản trị' },
  audit_log: { label: 'Nhật Ký Thao Tác Hệ Thống (Audit Log)', category: 'Quản trị' },
  system_parameters: { label: 'Thiết Lập Tham Số Bán Lẻ', category: 'Quản trị' },
  user_guide: { label: 'Hướng Dẫn Sử Dụng Hệ Thống', category: 'Trợ giúp' },
  shortcuts_help: { label: 'Danh Mục Phím Tắt Thao Tác Nhanh', category: 'Trợ giúp' },
  check_updates: { label: 'Kiểm Tra Bản Cập Nhật Hệ Thống', category: 'Trợ giúp' },
  about: { label: 'Thông Tin Phần Mềm Quản Lý Tiệm Vàng', category: 'Trợ giúp' }
}

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeFeature, setActiveFeature] = useState<{
    id: string
    label: string
    category?: string
    subId?: string
  } | null>(null)

  const handleSelectFeature = (id: string, subId?: string): void => {
    const targetId = subId || id
    const info = FEATURE_TITLES[targetId] || {
      label: targetId.replace(/_/g, ' ').toUpperCase(),
      category: 'Chức năng hệ thống'
    }
    setActiveFeature({
      id: targetId,
      label: info.label,
      category: info.category,
      subId
    })
  }

  return (
    <div className="flex flex-col w-full h-full text-text-primary select-none bg-card-bg">
      {/* 1. Thanh TitleBar: Hỗ trợ kích hoạt menu chức năng */}
      <AppTitleBar
        menuItems={DEFAULT_TITLEBAR_MENUS}
        onMenuItemClick={handleSelectFeature}
        rightContent={
          <div className="flex items-center gap-1">
            {/* 1. Icon Thông báo */}
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded text-titlebar-control hover:text-titlebar-text hover:bg-titlebar-control-hover active:bg-titlebar-control-active transition-colors cursor-pointer relative"
              title="Thông báo"
              aria-label="Thông báo"
            >
              <AlertRegular className="text-base" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-status-offline rounded-full" />
            </button>

            {/* 2. Icon Cài đặt */}
            <button
              type="button"
              onClick={() => handleSelectFeature('company_info')}
              className="w-7 h-7 flex items-center justify-center rounded text-titlebar-control hover:text-titlebar-text hover:bg-titlebar-control-hover active:bg-titlebar-control-active transition-colors cursor-pointer"
              title="Cài đặt hệ thống"
              aria-label="Cài đặt"
            >
              <SettingsRegular className="text-base" />
            </button>

            {/* 3. Icon Tài khoản người dùng (click mở popup) */}
            <UserMenu user={user} onLogout={logout} onOpenSettings={() => handleSelectFeature('company_info')} />
          </div>
        }
      />

      {/* 2. Thanh Ribbon chức năng: Mặc định không chọn sẵn chức năng nào */}
      <MainFeatureNavbar activeId={activeFeature?.id ?? null} onSelect={handleSelectFeature} />

      {/* 3. Vùng nội dung chính: Khi vừa Login xong thì TRẮNG SẠCH không có gì, chỉ mở page khi bấm chọn chức năng */}
      <main className="flex-1 bg-card-bg overflow-hidden relative flex flex-col">
        {activeFeature ? (
          activeFeature.id === 'barcode_print' ? (
            <BarcodePrintPage onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'gold_rates' ? (
            <GoldRatesPage onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'company_info' ? (
            <CompanySettingsPage onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'orders' || activeFeature.id === 'order_custom' ? (
            <CustomOrderPage onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'return_goods' || activeFeature.id === 'buyback_gold' ? (
            <GoldBuybackPage isExchangeMode={false} onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'exchange_goods' || activeFeature.id === 'exchange_gold' ? (
            <GoldBuybackPage isExchangeMode={true} onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'retail_trade' || activeFeature.id === 'pos_counter' ? (
            <PosSalePage isWholesale={false} onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'wholesale' || activeFeature.id === 'wholesale_counter' ? (
            <PosSalePage isWholesale={true} onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'suppliers' || activeFeature.id === 'tag_categories' ? (
            <TagSupplierPage
              initialTab={activeFeature.id === 'suppliers' ? 'suppliers' : 'tags'}
              onClose={() => setActiveFeature(null)}
            />
          ) : activeFeature.id === 'jewelry_items' || activeFeature.id === 'gold_types' ? (
            <ProductCatalogPage
              initialTab={activeFeature.id === 'gold_types' ? 'goldTypes' : 'products'}
              onClose={() => setActiveFeature(null)}
            />
          ) : activeFeature.id === 'customers' ? (
            <CustomerPage onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'stock_import' || activeFeature.id === 'import_stock' ? (
            <InventoryPage
              initialTab="movements"
              initialMovementType="import"
              onClose={() => setActiveFeature(null)}
            />
          ) : activeFeature.id === 'stock_transfer' || activeFeature.id === 'transfer_stock' ? (
            <InventoryPage
              initialTab="movements"
              initialMovementType="transfer"
              onClose={() => setActiveFeature(null)}
            />
          ) : activeFeature.id === 'stock_audit' ? (
            <InventoryPage
              initialTab="stock"
              onClose={() => setActiveFeature(null)}
            />
          ) : activeFeature.id === 'receipt_voucher' ? (
            <CashBookPage
              initialEntryType="income"
              onClose={() => setActiveFeature(null)}
            />
          ) : activeFeature.id === 'payment_voucher' ? (
            <CashBookPage
              initialEntryType="expense"
              onClose={() => setActiveFeature(null)}
            />
          ) : ['cashflow', 'cash_book', 'cashflow_report', 'rpt_cash_book', 'rpt_cashflow'].includes(activeFeature.id) ? (
            <CashBookPage onClose={() => setActiveFeature(null)} />
          ) : activeFeature.id === 'employees_list' || activeFeature.id === 'permissions' ? (
            <StaffAdminPage
              initialTab={activeFeature.id === 'permissions' ? 'permissions' : 'employees'}
              onClose={() => setActiveFeature(null)}
            />
          ) : [
              'rpt_daily_sales',
              'rpt_sales_detail',
              'rpt_gold_buyback',
              'rpt_gold_weights',
              'rpt_shift_closing',
              'rpt_sales_by_staff',
              'rpt_profit_margin'
            ].includes(activeFeature.id) ? (
            <SalesReportPage onClose={() => setActiveFeature(null)} />
          ) : (
            <GenericFeaturePage
              id={activeFeature.id}
              title={activeFeature.label}
              category={activeFeature.category}
              onClose={() => setActiveFeature(null)}
              onNavigate={handleSelectFeature}
            />
          )
        ) : (
          /* Màn hình làm việc trắng hoàn toàn khi vừa đăng nhập xong */
          <div className="w-full h-full bg-card-bg" />
        )}
      </main>

      {/* 4. Footer Bar */}
      <footer className="h-8 bg-card-bg border-t border-border-main px-6 flex items-center justify-between text-xs text-text-secondary shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span>Phiên bản Desktop v1.0.0</span>
          <span>•</span>
          <span>Hệ thống quản lý bán hàng tiệm vàng</span>
        </div>

        {/* Trạng thái kết nối nằm tinh tế ở Footer Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-tertiary">Trạng thái:</span>
          <ConnectionBadge showLatency={false} />
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage

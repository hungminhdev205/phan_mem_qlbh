import React from 'react'
import { WindowControls } from './WindowControls'
import { TitleBarMenu } from './TitleBarMenu'
import type { TitleBarMenuItem } from './titleBarMenu.types'

export interface TitleBarProps {
  /** Tiêu đề chính của ứng dụng */
  title?: string
  /** Tiêu đề phụ, phân hệ hoặc chi nhánh */
  subtitle?: string
  /** Có hiển thị biểu tượng thương hiệu (Brand Mark) hay không */
  showMark?: boolean
  /** Ký tự viết tắt trên Brand Mark */
  markText?: string
  /** Icon tùy biến thay thế cho chữ trên Brand Mark */
  icon?: React.ReactNode
  /** Danh sách menu chức năng trên thanh tiêu đề */
  menuItems?: TitleBarMenuItem[]
  /** Tùy biến thanh menu nếu cần */
  menuContent?: React.ReactNode
  /** Nội dung tùy biến ở giữa (ví dụ tìm kiếm nhanh, trạng thái) */
  centerContent?: React.ReactNode
  /** Nội dung tùy biến bên phải (trước các nút WindowControls) */
  rightContent?: React.ReactNode
  /** Có hiển thị các nút điều khiển thu nhỏ/phóng to/đóng cửa sổ hay không */
  showControls?: boolean
  /** Callback khi click vào menu item */
  onMenuItemClick?: (menuId: string, subId?: string) => void
  /** Class CSS tùy biến */
  className?: string
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  subtitle,
  showMark = false,
  markText,
  icon,
  menuItems,
  menuContent,
  centerContent,
  rightContent,
  showControls = true,
  onMenuItemClick,
  className = ''
}) => {
  const hasLeftContent = Boolean(showMark || markText || icon || title || subtitle)

  return (
    <header
      className={`h-10 w-full flex items-center justify-between shrink-0 select-none bg-titlebar text-titlebar-text border-b border-white/5 relative z-50 ${className}`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Khối bên trái: Brand Mark, Tiêu đề và Menu Bar */}
      <div className="h-full flex items-center gap-2 px-3 min-w-0">
        {hasLeftContent && (
          <div className="flex items-center gap-2 shrink-0">
            {(showMark || markText || icon) && (
              <div
                className="w-5 h-5 rounded bg-titlebar-mark text-titlebar-mark-text font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs tracking-tight"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
              >
                {icon || markText || 'POS'}
              </div>
            )}

            {title && (
              <span className="text-xs font-bold tracking-wider uppercase text-titlebar-text truncate">
                {title}
              </span>
            )}

            {subtitle && (
              <>
                <span className="text-titlebar-muted/30 text-xs shrink-0">•</span>
                <span className="text-[11px] text-titlebar-muted font-normal truncate">
                  {subtitle}
                </span>
              </>
            )}

            {/* Dấu gạch phân cách giữa Title và Menu nếu cả 2 cùng xuất hiện */}
            {(menuItems || menuContent) && <div className="h-3.5 w-px bg-white/10 mx-1 shrink-0" />}
          </div>
        )}

        {/* Khối Menu Bar (Hệ thống, Danh mục, Bán hàng, Sửa chữa gia công...) */}
        {menuContent ? (
          menuContent
        ) : menuItems && menuItems.length > 0 ? (
          <TitleBarMenu items={menuItems} onItemClick={onMenuItemClick} />
        ) : null}
      </div>

      {/* Khối ở giữa: Tùy biến hoặc khoảng trống kéo cửa sổ */}
      {centerContent ? (
        <div
          className="h-full flex items-center justify-center flex-1 px-4 min-w-0"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          {centerContent}
        </div>
      ) : (
        <div className="flex-1 h-full" />
      )}

      {/* Khối bên phải: Custom Actions / User Profile + WindowControls */}
      <div
        className="h-full flex items-center shrink-0"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {rightContent ? (
          <div className="h-full flex items-center px-2.5 border-r border-white/5">
            {rightContent}
          </div>
        ) : null}

        {showControls && <WindowControls />}
      </div>
    </header>
  )
}

export default TitleBar

import React, { useState, useRef, useEffect } from 'react'
import type { TitleBarMenuItem, TitleBarSubMenuItem } from '../window/titleBarMenu.types'
import { DEFAULT_TITLEBAR_MENUS } from '../window/titleBarMenu.types'

export interface FunctionNavbarProps {
  menus?: TitleBarMenuItem[]
  onItemClick?: (menuId: string, subId?: string) => void
  rightExtra?: React.ReactNode
  className?: string
}

export const FunctionNavbar: React.FC<FunctionNavbarProps> = ({
  menus = DEFAULT_TITLEBAR_MENUS,
  onItemClick,
  rightExtra,
  className = ''
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenuId(null)
      }
    }

    if (activeMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeMenuId])

  // Đóng dropdown khi ấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setActiveMenuId(null)
      }
    }

    if (activeMenuId !== null) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeMenuId])

  const handleMenuClick = (menu: TitleBarMenuItem): void => {
    if (menu.disabled) return
    if (menu.children && menu.children.length > 0) {
      setActiveMenuId(activeMenuId === menu.id ? null : menu.id)
    } else {
      setActiveMenuId(null)
      menu.onClick?.()
      onItemClick?.(menu.id)
    }
  }

  const handleMenuMouseEnter = (menu: TitleBarMenuItem): void => {
    // Khi đang có 1 menu mở, rê chuột qua menu khác sẽ tự động trượt mở (chuẩn Desktop Windows/ERP)
    if (activeMenuId !== null && activeMenuId !== menu.id && menu.children && !menu.disabled) {
      setActiveMenuId(menu.id)
    }
  }

  const handleSubItemClick = (menu: TitleBarMenuItem, subItem: TitleBarSubMenuItem): void => {
    if (subItem.disabled || subItem.divider) return
    setActiveMenuId(null)
    subItem.onClick?.()
    onItemClick?.(menu.id, subItem.id)
  }

  return (
    <nav
      ref={containerRef}
      className={`h-9 w-full bg-card-bg border-b border-border-main px-3 flex items-center justify-between shrink-0 select-none relative z-40 ${className}`}
      aria-label="Thanh điều hướng chức năng"
    >
      {/* Danh sách các menu chức năng chính */}
      <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
        {menus.map((menu) => {
          const isOpen = activeMenuId === menu.id

          return (
            <div key={menu.id} className="relative">
              <button
                type="button"
                onClick={() => handleMenuClick(menu)}
                onMouseEnter={() => handleMenuMouseEnter(menu)}
                disabled={menu.disabled}
                className={`h-7 px-2.5 flex items-center rounded text-xs font-medium transition-colors cursor-pointer ${
                  isOpen
                    ? 'bg-subtle-bg text-brand font-semibold shadow-2xs'
                    : 'text-text-primary hover:text-brand hover:bg-subtle-bg active:bg-border-subtle'
                } ${menu.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {menu.label}
              </button>

              {/* Dropdown danh mục tính năng con */}
              {isOpen && menu.children && (
                <div className="absolute top-full left-0 mt-1 min-w-[230px] bg-card-bg border border-border-main rounded-lg shadow-xl py-1 z-50 text-left animate-toast-in select-none">
                  {menu.children.map((subItem) => {
                    if (subItem.divider) {
                      return <div key={subItem.id} className="h-px bg-border-main my-1" />
                    }

                    return (
                      <button
                        key={subItem.id}
                        type="button"
                        disabled={subItem.disabled}
                        onClick={() => handleSubItemClick(menu, subItem)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-text-primary hover:bg-subtle-bg hover:text-brand transition-colors cursor-pointer ${
                          subItem.disabled ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="font-normal truncate">{subItem.label}</span>
                        {subItem.shortcut && (
                          <span className="text-[10px] text-text-tertiary ml-3 font-mono">
                            {subItem.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Góc phải của Navbar chức năng: Tuỳ biến nếu có */}
      {rightExtra ? <div className="flex items-center gap-3 shrink-0">{rightExtra}</div> : null}
    </nav>
  )
}

export default FunctionNavbar

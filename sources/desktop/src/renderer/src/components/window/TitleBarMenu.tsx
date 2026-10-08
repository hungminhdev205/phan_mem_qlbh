import React, { useState, useRef, useEffect } from 'react'
import type { TitleBarMenuItem, TitleBarSubMenuItem } from './titleBarMenu.types'
import { DEFAULT_TITLEBAR_MENUS, isFeatureImplemented } from './titleBarMenu.types'

interface TitleBarMenuProps {
  items?: TitleBarMenuItem[]
  onItemClick?: (menuId: string, subId?: string) => void
}

export const TitleBarMenu: React.FC<TitleBarMenuProps> = ({
  items = DEFAULT_TITLEBAR_MENUS,
  onItemClick
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Đóng menu khi click ra ngoài
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

  // Đóng menu khi ấn phím Escape
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
    // Khi đang có 1 menu mở, hover qua menu khác sẽ tự động mở menu đó (như chuẩn Windows/VSCode)
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
      className="flex items-center gap-0.5 select-none no-drag"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      aria-label="Application Menu Bar"
    >
      {items.map((menu, index) => {
        const isOpen = activeMenuId === menu.id
        const isNearRight = index >= 7

        return (
          <div key={menu.id} className="relative">
            <button
              type="button"
              onClick={() => handleMenuClick(menu)}
              onMouseEnter={() => handleMenuMouseEnter(menu)}
              disabled={menu.disabled}
              className={`h-7 px-2 sm:px-2.5 flex items-center rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                isOpen
                  ? 'bg-titlebar-control-active text-titlebar-text'
                  : 'text-titlebar-muted hover:text-titlebar-text hover:bg-titlebar-control-hover'
              } ${menu.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {menu.label}
            </button>

            {/* Dropdown menu con */}
            {isOpen && menu.children && (
              <div
                className={`absolute top-full mt-1 min-w-[300px] max-h-[calc(100vh-60px)] overflow-y-auto bg-card-bg border border-border-main rounded-lg shadow-xl py-1 z-50 text-left animate-toast-in select-none ${
                  isNearRight ? 'right-0' : 'left-0'
                }`}
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
              >
                {menu.children.map((subItem) => {
                  if (subItem.divider) {
                    return <div key={subItem.id} className="h-px bg-border-main my-1" />
                  }

                  const isReady = isFeatureImplemented(subItem.id)

                  return (
                    <button
                      key={subItem.id}
                      type="button"
                      disabled={subItem.disabled}
                      onClick={() => handleSubItemClick(menu, subItem)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-text-primary hover:bg-subtle-bg transition-colors cursor-pointer ${
                        subItem.disabled ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="font-normal truncate">{subItem.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {!isReady && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                            Đang phát triển
                          </span>
                        )}
                        {subItem.shortcut && (
                          <span className="text-[10px] text-text-tertiary font-mono">
                            {subItem.shortcut}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default TitleBarMenu

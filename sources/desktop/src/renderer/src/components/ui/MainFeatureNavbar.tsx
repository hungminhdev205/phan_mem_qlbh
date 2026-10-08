import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  BarcodeScannerRegular,
  HomeRegular,
  VaultRegular,
  CalculatorRegular,
  BuildingShopRegular,
  HandshakeRegular,
  ArrowUndoRegular,
  ArrowSwapRegular,
  PeopleRegular,
  ClipboardCheckmarkRegular,
  WalletRegular,
  ChevronDownRegular
} from '@fluentui/react-icons'

export interface MainFeatureSubItem {
  id: string
  label: string
  onClick?: () => void
}

export interface MainFeatureItem {
  id: string
  label: string
  icon: React.ReactNode
  iconColorClass?: string
  hasDropdown?: boolean
  children?: MainFeatureSubItem[]
  onClick?: () => void
}

const TOOLBAR_ITEMS: MainFeatureItem[] = [
  {
    id: 'barcode_print',
    label: 'Tem mã',
    icon: <BarcodeScannerRegular className="text-xl" />,
    iconColorClass: 'text-text-primary',
    hasDropdown: true,
    children: [
      { id: 'tag_categories', label: 'Danh mục tem' },
      { id: 'suppliers', label: 'Nhà cung cấp theo loại tem' },
      { id: 'barcode_print', label: 'In tem mã vạch' }
    ]
  },
  {
    id: 'import_stock',
    label: 'Nhập kho',
    icon: <HomeRegular className="text-xl" />,
    iconColorClass: 'text-brand'
  },
  {
    id: 'transfer_stock',
    label: 'Chuyển kho',
    icon: <VaultRegular className="text-xl" />,
    iconColorClass: 'text-titlebar-mark'
  },
  {
    id: 'retail_trade',
    label: 'Mua, Bán',
    icon: <CalculatorRegular className="text-xl" />,
    iconColorClass: 'text-status-online'
  },
  {
    id: 'wholesale',
    label: 'Bán Buôn',
    icon: <BuildingShopRegular className="text-xl" />,
    iconColorClass: 'text-brand'
  },
  {
    id: 'orders',
    label: 'Đặt Hàng',
    icon: <HandshakeRegular className="text-xl" />,
    iconColorClass: 'text-status-checking'
  },
  {
    id: 'return_goods',
    label: 'Hồi hàng',
    icon: <ArrowUndoRegular className="text-xl" />,
    iconColorClass: 'text-status-checking'
  },
  {
    id: 'exchange_goods',
    label: 'Đổi hàng',
    icon: <ArrowSwapRegular className="text-xl" />,
    iconColorClass: 'text-brand'
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    icon: <PeopleRegular className="text-xl" />,
    iconColorClass: 'text-brand'
  },
  {
    id: 'stock_audit',
    label: 'Kiểm kho',
    icon: <ClipboardCheckmarkRegular className="text-xl" />,
    iconColorClass: 'text-status-online'
  },
  {
    id: 'cashflow',
    label: 'Thu, Chi',
    icon: <WalletRegular className="text-xl" />,
    iconColorClass: 'text-titlebar-mark'
  }
]

interface MainFeatureNavbarProps {
  activeId?: string | null
  onSelect?: (id: string, subId?: string) => void
  className?: string
}

interface OpenDropdownState {
  id: string
  items: MainFeatureSubItem[]
  coords: { top: number; left: number }
}

export const MainFeatureNavbar: React.FC<MainFeatureNavbarProps> = ({
  activeId = null,
  onSelect,
  className = ''
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const selectedId = activeId !== undefined ? activeId : internalSelectedId
  const [openDropdown, setOpenDropdown] = useState<OpenDropdownState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Đóng dropdown khi click ra ngoài, cuộn trang, resize hoặc phím Escape
  useEffect(() => {
    if (!openDropdown) return

    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as Node
      const isInsideContainer = containerRef.current?.contains(target)
      const isInsideDropdown = dropdownRef.current?.contains(target)
      if (!isInsideContainer && !isInsideDropdown) {
        setOpenDropdown(null)
      }
    }

    const handleWindowChange = (): void => {
      setOpenDropdown(null)
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('scroll', handleWindowChange, true)
    document.addEventListener('keydown', handleKeyDown)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('scroll', handleWindowChange, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openDropdown])

  const handleItemClick = (e: React.MouseEvent<HTMLButtonElement>, item: MainFeatureItem): void => {
    setInternalSelectedId(item.id)
    if (item.hasDropdown && item.children && item.children.length > 0) {
      if (openDropdown?.id === item.id) {
        setOpenDropdown(null)
      } else {
        const rect = e.currentTarget.getBoundingClientRect()
        // Nếu nút nằm gần mép phải màn hình (< 220px từ mép phải), căn lề phải của menu theo nút
        const isNearRight = rect.right + 210 > window.innerWidth
        const left = isNearRight ? Math.max(8, rect.right - 210) : rect.left
        setOpenDropdown({
          id: item.id,
          items: item.children,
          coords: {
            top: rect.bottom + 4,
            left
          }
        })
      }
    } else {
      setOpenDropdown(null)
      item.onClick?.()
      onSelect?.(item.id)
    }
  }

  const handleSubItemClick = (parentId: string, subItem: MainFeatureSubItem): void => {
    setOpenDropdown(null)
    subItem.onClick?.()
    onSelect?.(parentId, subItem.id)
  }

  return (
    <div
      ref={containerRef}
      className={`h-16 w-full bg-card-bg border-b border-border-main px-3 flex items-center overflow-hidden shrink-0 select-none shadow-2xs z-30 ${className}`}
      aria-label="Thanh công cụ chức năng tiệm vàng"
    >
      <div className="flex items-center gap-1 shrink-0 py-1">
        {TOOLBAR_ITEMS.map((item) => {
          const isActive = selectedId === item.id
          const isDropdownOpen = openDropdown?.id === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={(e) => handleItemClick(e, item)}
              className={`h-14 px-2.5 py-1.5 flex flex-col items-center justify-between rounded-lg transition-all cursor-pointer select-none group shrink-0 min-w-[58px] border ${
                isActive || isDropdownOpen
                  ? 'bg-subtle-bg border-border-main text-brand shadow-2xs font-semibold'
                  : 'border-transparent text-text-primary hover:bg-subtle-bg hover:shadow-2xs font-normal'
              }`}
              title={item.label}
            >
              {/* Icon ở trên */}
              <div
                className={`text-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  item.iconColorClass || 'text-text-primary'
                }`}
              >
                {item.icon}
              </div>

              {/* Tên chức năng ở dưới */}
              <div className="flex items-center gap-0.5 text-[11px] leading-tight text-center font-medium whitespace-nowrap">
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDownRegular className="text-[10px] text-text-tertiary shrink-0 ml-0.5" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Menu con xổ xuống dùng Portal ra ngoài body để không bị overflow-hidden che mất */}
      {openDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              top: `${openDropdown.coords.top}px`,
              left: `${openDropdown.coords.left}px`
            }}
            className="fixed min-w-[210px] bg-card-bg border border-border-main rounded-xl shadow-xl py-1 z-50 text-left animate-toast-in select-none"
          >
            {openDropdown.items.map((subItem) => (
              <button
                key={subItem.id}
                type="button"
                onClick={() => handleSubItemClick(openDropdown.id, subItem)}
                className="w-full text-left px-3.5 py-2 text-xs text-text-primary hover:bg-subtle-bg hover:text-brand transition-colors cursor-pointer block"
              >
                {subItem.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  )
}

export default MainFeatureNavbar

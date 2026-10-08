import React from 'react'
import { DismissRegular, SquareRegular, SubtractRegular } from '@fluentui/react-icons'

interface WindowControlsProps {
  className?: string
}

export const WindowControls: React.FC<WindowControlsProps> = ({ className = '' }) => {
  const handleMinimize = (): void => {
    window.api?.minimize?.()
  }

  const handleMaximize = (): void => {
    window.api?.maximize?.()
  }

  const handleClose = (): void => {
    window.api?.close?.()
  }

  return (
    <div
      className={`inline-flex items-center h-full no-drag z-50 select-none ${className}`}
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={handleMinimize}
        className="w-12 h-9 flex items-center justify-center text-titlebar-control hover:text-titlebar-text hover:bg-titlebar-control-hover active:bg-titlebar-control-active transition-colors cursor-pointer"
        title="Thu nhỏ"
        aria-label="Thu nhỏ cửa sổ"
      >
        <SubtractRegular className="text-base" />
      </button>

      <button
        type="button"
        onClick={handleMaximize}
        className="w-12 h-9 flex items-center justify-center text-titlebar-control hover:text-titlebar-text hover:bg-titlebar-control-hover active:bg-titlebar-control-active transition-colors cursor-pointer"
        title="Phóng to / Khôi phục"
        aria-label="Phóng to cửa sổ"
      >
        <SquareRegular className="text-sm" />
      </button>

      <button
        type="button"
        onClick={handleClose}
        className="w-12 h-9 flex items-center justify-center text-titlebar-control hover:text-white hover:bg-control-close-hover active:bg-control-close-active transition-colors cursor-pointer"
        title="Đóng ứng dụng"
        aria-label="Đóng cửa sổ"
      >
        <DismissRegular className="text-base" />
      </button>
    </div>
  )
}

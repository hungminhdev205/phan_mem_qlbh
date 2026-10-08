import React, { useEffect } from 'react'
import {
  DismissRegular,
  WrenchRegular,
  SparkleRegular,
  ClockRegular,
  ArrowRightRegular,
  CalculatorRegular,
  PeopleRegular,
  VaultRegular,
  WalletRegular,
  BarcodeScannerRegular,
  ArrowLeftRegular,
  DocumentBulletListRegular
} from '@fluentui/react-icons'

interface GenericFeaturePageProps {
  id: string
  title: string
  subtitle?: string
  category?: string
  onClose: () => void
  onNavigate?: (featureId: string) => void
}

interface QuickFeature {
  id: string
  name: string
  desc: string
  icon: React.ReactNode
  tag: string
}

export const GenericFeaturePage: React.FC<GenericFeaturePageProps> = ({
  id,
  title,
  subtitle,
  category = 'Phân hệ chức năng',
  onClose,
  onNavigate
}) => {
  // Đóng trang khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return (): void => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const quickFeatures: QuickFeature[] = [
    {
      id: 'retail_trade',
      name: 'Bàn Bán Lẻ POS (F2)',
      desc: 'Bán lẻ nhẫn, kiềng vàng, kim cương & tính tiền công thợ',
      icon: <CalculatorRegular className="text-xl text-emerald-500" />,
      tag: 'Bán hàng'
    },
    {
      id: 'jewelry_items',
      name: 'Danh Mục Sản Phẩm',
      desc: 'Quản lý 18+ mẫu vàng 9999, 24K, 18K, 14K & kim cương GIA',
      icon: <DocumentBulletListRegular className="text-xl text-brand" />,
      tag: 'Danh mục'
    },
    {
      id: 'customers',
      name: 'Quản Lý Khách Hàng (F3)',
      desc: 'Hồ sơ khách hàng VIP, điểm tích lũy & hạn mức công nợ',
      icon: <PeopleRegular className="text-xl text-blue-500" />,
      tag: 'Khách hàng'
    },
    {
      id: 'import_stock',
      name: 'Quản Lý Kho Hàng',
      desc: 'Nhập hàng từ SJC/PNJ, luân chuyển quầy & kiểm kê tồn kho',
      icon: <VaultRegular className="text-xl text-purple-500" />,
      tag: 'Kho hàng'
    },
    {
      id: 'cashflow',
      name: 'Thu Chi & Sổ Quỹ',
      desc: 'Phiếu thu, phiếu chi, dòng tiền mặt & tài khoản ngân hàng',
      icon: <WalletRegular className="text-xl text-amber-500" />,
      tag: 'Tài chính'
    },
    {
      id: 'barcode_print',
      name: 'In Tem Mã Vạch',
      desc: 'In tem trang sức chuẩn Thông tư 22 Bộ Khoa học & Công nghệ',
      icon: <BarcodeScannerRegular className="text-xl text-cyan-500" />,
      tag: 'In ấn'
    }
  ]

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      {/* 1. Header trang chức năng */}
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-subtle-bg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Quay lại màn hình chính (Esc)"
          >
            <ArrowLeftRegular className="text-sm" />
            <span>Quay lại</span>
          </button>

          <div className="h-4 w-px bg-border-main" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
              {category}
            </span>
            <span className="text-text-tertiary text-xs">•</span>
            <h2 className="text-sm font-bold text-text-primary leading-tight truncate max-w-md">
              {title}
            </h2>
          </div>

          {/* Badge nhận diện: Đang phát triển */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Chức năng đang phát triển
          </span>
        </div>

        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={onClose}
          className="h-8 px-3 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors cursor-pointer flex items-center gap-1.5"
          title="Đóng trang (Esc)"
          aria-label="Đóng"
        >
          <DismissRegular className="text-sm" />
          <span>Đóng (Esc)</span>
        </button>
      </header>

      {/* 2. Nội dung chính: Giao diện thông báo chức năng đang hoàn thiện */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Hero Banner: Đang phát triển */}
          <div className="relative overflow-hidden rounded-2xl bg-card-bg border border-amber-500/30 p-6 md:p-8 shadow-sm">
            {/* Background glowing gradient */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Icon trung tâm */}
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                <WrenchRegular className="text-3xl" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Kế hoạch phát triển • In Progress
                  </span>
                  <span className="text-xs text-text-tertiary">Mã: {id}</span>
                </div>
                <h1 className="text-lg md:text-xl font-bold text-text-primary leading-snug">
                  Chức năng đang trong quá trình phát triển
                </h1>
                <p className="text-xs md:text-sm text-text-secondary mt-1 leading-relaxed">
                  Tính năng <strong className="text-text-primary font-semibold">&ldquo;{title}&rdquo;</strong> thuộc phân hệ{' '}
                  <span className="text-brand font-medium">&ldquo;{category}&rdquo;</span> đang được xây dựng theo lộ trình phát triển của hệ thống tiệm vàng.
                </p>
                {subtitle && (
                  <p className="text-xs text-text-tertiary mt-1 italic">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Thông số kỹ thuật / Tiến độ */}
            <div className="mt-6 pt-5 border-t border-border-main/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-subtle-bg border border-border-subtle">
                <span className="block text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                  Mã chức năng
                </span>
                <span className="font-mono text-xs font-bold text-brand mt-0.5 block truncate">
                  {id.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-subtle-bg border border-border-subtle">
                <span className="block text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                  Phân hệ trực thuộc
                </span>
                <span className="text-xs font-bold text-text-primary mt-0.5 block truncate">
                  {category}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-subtle-bg border border-border-subtle">
                <span className="block text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                  Trạng thái
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                  <ClockRegular className="text-xs" />
                  Đang phát triển
                </span>
              </div>

              <div className="p-3 rounded-xl bg-subtle-bg border border-border-subtle">
                <span className="block text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                  Kế hoạch phát hành
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-text-primary mt-0.5">
                  <SparkleRegular className="text-xs text-brand" />
                  Bản cập nhật kế tiếp
                </span>
              </div>
            </div>
          </div>

          {/* Lộ trình thiết kế tính năng dự kiến */}
          <div className="bg-card-bg rounded-2xl border border-border-main p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
              <SparkleRegular className="text-sm text-brand" />
              <span>Tiêu chuẩn thiết kế cho phân hệ này</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-subtle-bg border border-border-subtle">
                <div className="font-bold text-xs text-text-primary mb-1">
                  1. Dữ liệu thời gian thực
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Đồng bộ số liệu tức thời với cơ sở dữ liệu PostgreSQL qua Native Queries tối ưu hiệu năng.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-subtle-bg border border-border-subtle">
                <div className="font-bold text-xs text-text-primary mb-1">
                  2. Xuất báo cáo & In ấn
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Hỗ trợ kết xuất file Excel, PDF và in mẫu biểu trên máy in nhiệt hóa đơn & máy in laser A4/A5.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-subtle-bg border border-border-subtle">
                <div className="font-bold text-xs text-text-primary mb-1">
                  3. Phân quyền & Kiểm toán
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Bảo vệ theo vai trò nhân viên, ghi nhận nhật ký thao tác an toàn (Audit Log) chống thất thoát.
                </p>
              </div>
            </div>
          </div>

          {/* Lối tắt truy cập các tính năng đã hoàn thiện */}
          <div className="bg-card-bg rounded-2xl border border-border-main p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Các chức năng đã sẵn sàng sử dụng
                </h3>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  Bạn có thể mở nhanh các phân hệ nghiệp vụ đã hoàn tất bên dưới:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {quickFeatures.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate?.(item.id)}
                  className="p-3.5 rounded-xl border border-border-main bg-subtle-bg/60 hover:bg-subtle-bg hover:border-brand/40 transition-all text-left group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-card-bg border border-border-main flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card-bg border border-border-subtle text-text-secondary">
                        {item.tag}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-text-primary group-hover:text-brand transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-text-tertiary mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-end text-[11px] font-semibold text-brand gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Mở chức năng</span>
                    <ArrowRightRegular className="text-xs" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nút điều hướng chân trang */}
          <div className="flex items-center justify-center gap-3 pt-2 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-xl border border-border-main bg-card-bg text-xs font-semibold text-text-primary hover:bg-subtle-bg transition-colors cursor-pointer shadow-2xs"
            >
              Quay về màn hình chính
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('retail_trade')}
              className="h-9 px-5 rounded-xl bg-brand text-text-inverse text-xs font-semibold hover:bg-brand-hover transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <CalculatorRegular className="text-base" />
              <span>Mở Bàn Bán Lẻ POS (F2)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenericFeaturePage

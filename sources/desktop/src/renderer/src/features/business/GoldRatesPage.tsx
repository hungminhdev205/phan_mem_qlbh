import React, { useState, useEffect } from 'react'
import {
  DismissRegular,
  ArrowClockwiseRegular,
  EditRegular,
  SaveRegular,
  CalculatorRegular,
  ArrowTrendingLinesRegular,
  ArrowTrendingDownRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'

interface GoldRateItem {
  id: string
  code: string
  name: string
  purity: string
  buyPrice: number // VNĐ trên 1 chỉ
  sellPrice: number // VNĐ trên 1 chỉ
  change: number // VNĐ thay đổi
  updatedAt: string
}

const DEFAULT_RATES: GoldRateItem[] = [
  {
    id: 'sjc',
    code: 'SJC',
    name: 'Vàng Miếng SJC',
    purity: '99.99%',
    buyPrice: 8850000,
    sellPrice: 9050000,
    change: 50000,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'ring_9999',
    code: 'NHAN_9999',
    name: 'Vàng Nhẫn Trơn 999.9',
    purity: '99.99%',
    buyPrice: 8750000,
    sellPrice: 8900000,
    change: 30000,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'gold_24k',
    code: '24K',
    name: 'Nữ Trang 24K (99%)',
    purity: '99.00%',
    buyPrice: 8600000,
    sellPrice: 8820000,
    change: 20000,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'gold_18k',
    code: '18K',
    name: 'Nữ Trang 18K (750)',
    purity: '75.00%',
    buyPrice: 6350000,
    sellPrice: 6750000,
    change: -15000,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'white_gold_italy',
    code: 'Y_750',
    name: 'Vàng Trắng Ý 750',
    purity: '75.00%',
    buyPrice: 6400000,
    sellPrice: 6850000,
    change: 10000,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'gold_14k',
    code: '14K',
    name: 'Nữ Trang 14K (585)',
    purity: '58.50%',
    buyPrice: 4850000,
    sellPrice: 5250000,
    change: 0,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'gold_10k',
    code: '10K',
    name: 'Nữ Trang 10K (416)',
    purity: '41.60%',
    buyPrice: 3350000,
    sellPrice: 3750000,
    change: 0,
    updatedAt: 'Hôm nay 08:30'
  },
  {
    id: 'scrap_gold',
    code: 'PHE_LIEU',
    name: 'Vàng Cũ Thu Mua / Phế Liệu',
    purity: 'Đa dạng',
    buyPrice: 8400000,
    sellPrice: 0,
    change: 0,
    updatedAt: 'Hôm nay 08:30'
  }
]

const STORAGE_KEY = 'qlbh_gold_rates_v1'
const money = new Intl.NumberFormat('vi-VN')

interface GoldRatesPageProps {
  onClose: () => void
}

export const GoldRatesPage: React.FC<GoldRatesPageProps> = ({ onClose }) => {
  const [rates, setRates] = useState<GoldRateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return DEFAULT_RATES
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBuy, setEditBuy] = useState<number>(0)
  const [editSell, setEditSell] = useState<number>(0)

  // Công cụ quy đổi nhanh
  const [calcGoldId, setCalcGoldId] = useState<string>('ring_9999')
  const [calcWeight, setCalcWeight] = useState<number>(1)
  const [calcUnit, setCalcUnit] = useState<'chi' | 'luong' | 'phan' | 'gram'>('chi')
  const [calcAction, setCalcAction] = useState<'buy' | 'sell'>('sell')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates))
  }, [rates])

  const startEdit = (item: GoldRateItem): void => {
    setEditingId(item.id)
    setEditBuy(item.buyPrice)
    setEditSell(item.sellPrice)
  }

  const saveEdit = (id: string): void => {
    setRates((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const change = editBuy - item.buyPrice
          return {
            ...item,
            buyPrice: editBuy,
            sellPrice: editSell,
            change,
            updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        }
        return item
      })
    )
    setEditingId(null)
    toast.success('Đã cập nhật giá vàng mới niêm yết.')
  }

  const resetDefault = (): void => {
    setRates(DEFAULT_RATES)
    localStorage.removeItem(STORAGE_KEY)
    toast.info('Đã tải lại bảng giá vàng chuẩn thị trường.')
  }

  // Tính quy đổi
  const currentCalcGold = rates.find((r) => r.id === calcGoldId) || rates[0]
  const weightInChi =
    calcUnit === 'luong'
      ? calcWeight * 10
      : calcUnit === 'phan'
        ? calcWeight * 0.1
        : calcUnit === 'gram'
          ? calcWeight / 3.75
          : calcWeight

  const unitPrice = calcAction === 'sell' ? currentCalcGold.sellPrice : currentCalcGold.buyPrice
  const totalCalculated = Math.round(weightInChi * unitPrice)

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      {/* 1. Header */}
      <header className="h-12 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            <ArrowTrendingLinesRegular className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-brand uppercase">Danh mục</span>
              <span className="text-text-tertiary text-xs">•</span>
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                Bảng giá vàng thời gian thực (Niêm yết quầy)
              </h2>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Đơn vị: <strong>1.000 VNĐ / chỉ</strong> (1 lượng = 10 chỉ = 37.5 gram)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetDefault}
            className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowClockwiseRegular className="text-sm" />
            <span>Tải giá chuẩn</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors flex items-center justify-center cursor-pointer"
            title="Đóng trang"
          >
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      {/* 2. Body: Bảng giá vàng bên trái, Máy tính quy đổi bên phải */}
      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* BẢNG GIÁ VÀNG NIÊM YẾT */}
        <div className="flex-1 bg-card-bg rounded-xl border border-border-main shadow-2xs flex flex-col overflow-hidden">
          <div className="p-3 bg-subtle-bg/60 border-b border-border-main flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Bảng giá vàng niêm yết tại tiệm hôm nay
            </span>
            <span className="text-[11px] text-text-secondary">
              Bấm icon bút <EditRegular className="inline text-xs" /> để sửa giá từng loại
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-semibold sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-4">Loại vàng</th>
                  <th className="py-2.5 px-3 text-center">Hàm lượng</th>
                  <th className="py-2.5 px-4 text-right">Giá Mua Vào (đ/chỉ)</th>
                  <th className="py-2.5 px-4 text-right">Giá Bán Ra (đ/chỉ)</th>
                  <th className="py-2.5 px-4 text-right">Chênh lệch</th>
                  <th className="py-2.5 px-3 text-center">Biến động</th>
                  <th className="py-2.5 px-3 text-right">Cập nhật</th>
                  <th className="py-2.5 px-2 w-12 text-center" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {rates.map((item) => {
                  const isEditing = editingId === item.id
                  const spread = item.sellPrice > 0 ? item.sellPrice - item.buyPrice : 0

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-subtle-bg/70 transition-colors group text-xs"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-text-primary">{item.name}</div>
                        <div className="text-[10px] text-text-secondary font-mono">{item.code}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          {item.purity}
                        </span>
                      </td>

                      {/* Giá mua vào */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        {isEditing ? (
                          <input
                            type="number"
                            step="10000"
                            value={editBuy}
                            onChange={(e) => setEditBuy(Number(e.target.value) || 0)}
                            className="w-28 h-7 text-right px-2 bg-card-bg border border-border-main rounded text-xs font-mono font-bold text-emerald-600 focus:outline-none focus:border-brand"
                          />
                        ) : (
                          `${money.format(item.buyPrice)} đ`
                        )}
                      </td>

                      {/* Giá bán ra */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-brand">
                        {isEditing ? (
                          <input
                            type="number"
                            step="10000"
                            value={editSell}
                            onChange={(e) => setEditSell(Number(e.target.value) || 0)}
                            className="w-28 h-7 text-right px-2 bg-card-bg border border-border-main rounded text-xs font-mono font-bold text-brand focus:outline-none focus:border-brand"
                          />
                        ) : item.sellPrice > 0 ? (
                          `${money.format(item.sellPrice)} đ`
                        ) : (
                          <span className="text-text-tertiary italic">-</span>
                        )}
                      </td>

                      {/* Chênh lệch */}
                      <td className="py-3 px-4 text-right font-mono text-text-secondary">
                        {spread > 0 ? `${money.format(spread)} đ` : '-'}
                      </td>

                      {/* Biến động */}
                      <td className="py-3 px-3 text-center font-mono">
                        {item.change > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[11px]">
                            <ArrowTrendingLinesRegular className="text-xs" />
                            <span>+{money.format(item.change)}</span>
                          </span>
                        ) : item.change < 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold text-[11px]">
                            <ArrowTrendingDownRegular className="text-xs" />
                            <span>{money.format(item.change)}</span>
                          </span>
                        ) : (
                          <span className="text-text-tertiary font-bold text-[11px]">0</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right text-[11px] text-text-secondary">
                        {item.updatedAt}
                      </td>

                      <td className="py-3 px-2 text-center">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => saveEdit(item.id)}
                            className="w-7 h-7 bg-brand text-text-inverse rounded-lg flex items-center justify-center hover:bg-brand-hover transition-colors cursor-pointer shadow-2xs"
                            title="Lưu giá mới"
                          >
                            <SaveRegular className="text-sm" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="w-7 h-7 text-text-tertiary hover:text-brand hover:bg-subtle-bg rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                            title="Chỉnh sửa giá"
                          >
                            <EditRegular className="text-sm" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-subtle-bg/60 border-t border-border-main flex items-center justify-between text-xs text-text-secondary">
            <span>Bảng giá được đồng bộ dùng trong Bàn bán POS và Thu mua vàng cũ</span>
            <span className="font-mono">8 loại vàng niêm yết</span>
          </div>
        </div>

        {/* CÔNG CỤ QUY ĐỔI NHANH GIÁ TRỊ VÀNG */}
        <aside className="w-88 bg-card-bg rounded-xl border border-border-main shadow-2xs p-4 flex flex-col gap-3 shrink-0">
          <div className="flex items-center gap-2 border-b border-border-main pb-2.5">
            <CalculatorRegular className="text-lg text-brand" />
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Máy tính quy đổi vàng tức thì
            </h3>
          </div>

          {/* Chiều giao dịch */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-text-secondary">
              Giao dịch của khách:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setCalcAction('sell')}
                className={`h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  calcAction === 'sell'
                    ? 'bg-brand text-text-inverse border-brand'
                    : 'bg-subtle-bg border-border-main text-text-secondary hover:text-text-primary'
                }`}
              >
                Tiệm bán cho khách
              </button>
              <button
                type="button"
                onClick={() => setCalcAction('buy')}
                className={`h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  calcAction === 'buy'
                    ? 'bg-emerald-600 text-text-inverse border-emerald-600'
                    : 'bg-subtle-bg border-border-main text-text-secondary hover:text-text-primary'
                }`}
              >
                Khách bán lại cho tiệm
              </button>
            </div>
          </div>

          {/* Chọn loại vàng */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-text-secondary">Chọn loại vàng:</label>
            <select
              value={calcGoldId}
              onChange={(e) => setCalcGoldId(e.target.value)}
              className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary font-medium focus:outline-none focus:border-brand"
            >
              {rates
                .filter((r) => (calcAction === 'sell' ? r.sellPrice > 0 : true))
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.purity})
                  </option>
                ))}
            </select>
          </div>

          {/* Trọng lượng & Đơn vị */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-secondary">Khối lượng:</label>
              <input
                type="number"
                min="0.001"
                step="0.1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value) || 0)}
                className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded-lg text-xs font-mono font-bold text-text-primary text-right focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-secondary">Đơn vị đo:</label>
              <select
                value={calcUnit}
                onChange={(e) => setCalcUnit(e.target.value as 'chi' | 'luong' | 'phan' | 'gram')}
                className="w-full h-8 px-2 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand"
              >
                <option value="chi">Chỉ (3.75g)</option>
                <option value="luong">Cây / Lượng (10 chỉ)</option>
                <option value="phan">Phân (0.1 chỉ)</option>
                <option value="gram">Gram (g)</option>
              </select>
            </div>
          </div>

          {/* Bảng kết quả tính */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-2 mt-2">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Đơn giá áp dụng:</span>
              <strong className="font-mono text-text-primary">
                {money.format(unitPrice)} đ/chỉ
              </strong>
            </div>

            <div className="flex justify-between text-xs text-text-secondary">
              <span>Quy đổi ra chỉ:</span>
              <strong className="font-mono text-text-primary">
                {weightInChi.toFixed(3)} chỉ
              </strong>
            </div>

            <div className="pt-2 border-t border-amber-500/20 flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-amber-700">
                THÀNH TIỀN QUY ĐỔI:
              </span>
              <span className="text-xl font-black font-mono text-amber-700 leading-tight">
                {money.format(totalCalculated)} đ
              </span>
            </div>
          </div>

          {/* Chú thích đơn vị vàng Việt Nam */}
          <div className="mt-auto p-2.5 bg-subtle-bg rounded-lg border border-border-subtle text-[11px] text-text-secondary leading-relaxed">
            <strong className="text-text-primary block mb-0.5">Quy chuẩn tiệm vàng:</strong>
            • 1 Cây = 1 Lượng = 10 Chỉ = 37.5 Gram
            <br />• 1 Chỉ = 10 Phân = 3.75 Gram
            <br />• 1 Phân = 10 Ly = 0.375 Gram
          </div>
        </aside>
      </div>
    </div>
  )
}

export default GoldRatesPage

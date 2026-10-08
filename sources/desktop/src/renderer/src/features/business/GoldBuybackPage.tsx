import React, { useCallback, useEffect, useState } from 'react'
import {
  DismissRegular,
  PrintRegular,
  AddRegular,
  DeleteRegular,
  ArrowClockwiseRegular,
  PersonRegular,
  CheckmarkRegular,
  ArrowSwapRegular,
  MoneyRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  createCashBookEntry,
  getCustomers,
  getGoldTypes,
  type Customer,
  type GoldType
} from './catalog.api'

interface GoldBuybackItem {
  id: string
  itemName: string
  goldTypeUuid: string
  goldTypeName: string
  grossWeight: number // Tổng TL cân
  deductWeight: number // Trừ hột / dơ
  netWeight: number // TL vàng thực tế
  buyRate: number // Đơn giá mua vào (đ/chỉ)
  totalAmount: number
  note?: string
}

interface GoldBuybackPageProps {
  onClose: () => void
  isExchangeMode?: boolean
}

const DEFAULT_RATES_MAP: Record<string, number> = {
  '9999': 8750000,
  '24K': 8600000,
  '18K': 6350000,
  '14K': 4850000,
  '10K': 3350000
}

const money = new Intl.NumberFormat('vi-VN')

export const GoldBuybackPage: React.FC<GoldBuybackPageProps> = ({
  onClose,
  isExchangeMode = false
}) => {
  const { token } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [goldTypes, setGoldTypes] = useState<GoldType[]>([])
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState('')
  const [items, setItems] = useState<GoldBuybackItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [mode, setMode] = useState<'buyback' | 'exchange'>(
    isExchangeMode ? 'exchange' : 'buyback'
  )

  // Form thêm món
  const [formItemName, setFormItemName] = useState('Vàng cũ thu mua')
  const [formGoldTypeUuid, setFormGoldTypeUuid] = useState('')
  const [formGrossWeight, setFormGrossWeight] = useState(1)
  const [formDeductWeight, setFormDeductWeight] = useState(0)
  const [formBuyRate, setFormBuyRate] = useState(8600000)

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    try {
      const [customerRows, goldTypeRows] = await Promise.all([
        getCustomers(token),
        getGoldTypes(token)
      ])
      setCustomers(customerRows.filter((c) => c.status === 'active'))
      setGoldTypes(goldTypeRows.filter((g) => g.status === 'active'))
      if (goldTypeRows.length > 0 && !formGoldTypeUuid) {
        setFormGoldTypeUuid(goldTypeRows[0].uuid)
      }
    } catch {
      // fallback
    }
  }, [formGoldTypeUuid, token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const selectedGoldType = goldTypes.find((g) => g.uuid === formGoldTypeUuid) || goldTypes[0]

  useEffect(() => {
    if (selectedGoldType) {
      const code = selectedGoldType.code.toUpperCase()
      const rate =
        DEFAULT_RATES_MAP[code] ||
        (code.includes('18')
          ? 6350000
          : code.includes('24') || code.includes('99')
            ? 8600000
            : code.includes('14')
              ? 4850000
              : 8400000)
      setFormBuyRate(rate)
    }
  }, [selectedGoldType])

  const handleAddItem = (): void => {
    const netWeight = Math.max(0, formGrossWeight - formDeductWeight)
    const total = Math.round(netWeight * formBuyRate)
    const newItem: GoldBuybackItem = {
      id: `item_${Date.now()}`,
      itemName: formItemName.trim() || 'Vàng cũ thu mua',
      goldTypeUuid: selectedGoldType?.uuid || '',
      goldTypeName: selectedGoldType?.name || '24K',
      grossWeight: formGrossWeight,
      deductWeight: formDeductWeight,
      netWeight,
      buyRate: formBuyRate,
      totalAmount: total
    }
    setItems((prev) => [...prev, newItem])
    setFormGrossWeight(1)
    setFormDeductWeight(0)
    toast.success('Đã thêm món vàng vào bảng thu mua.')
  }

  const handleDeleteItem = (id: string): void => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalGross = items.reduce((sum, item) => sum + item.grossWeight, 0)
  const totalDeduct = items.reduce((sum, item) => sum + item.deductWeight, 0)
  const totalNet = items.reduce((sum, item) => sum + item.netWeight, 0)
  const totalBuybackAmount = items.reduce((sum, item) => sum + item.totalAmount, 0)

  const selectedCustomer = customers.find((c) => c.uuid === selectedCustomerUuid) || null

  const handleCompleteTransaction = async (): Promise<void> => {
    if (items.length === 0 || !token) return
    setIsSaving(true)
    try {
      if (mode === 'buyback') {
        // Tự động tạo phiếu chi trong Sổ quỹ
        await createCashBookEntry(token, {
          entryType: 'expense',
          paymentMethod: 'cash',
          amount: totalBuybackAmount,
          title: `Thu mua vàng cũ - ${selectedCustomer?.name || 'Khách vãng lai'}`,
          description: `Thu mua ${items.length} món vàng cũ, tổng KL: ${totalNet.toFixed(3)} chỉ`,
          status: 'active'
        })
        toast.success(
          `Đã hoàn tất phiếu thu mua vàng và tạo phiếu chi tiền mặt ${money.format(totalBuybackAmount)} đ.`
        )
      } else {
        toast.success(
          `Đã xác nhận đổi vàng. Giá trị vàng cũ ${money.format(totalBuybackAmount)} đ sẵn sàng cấn trừ đơn mới.`
        )
      }
      setItems([])
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Lỗi xử lý phiếu thu mua'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      {/* 1. Header */}
      <header className="h-12 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            {mode === 'buyback' ? (
              <MoneyRegular className="text-xl" />
            ) : (
              <ArrowSwapRegular className="text-xl" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-brand uppercase">Bán hàng</span>
              <span className="text-text-tertiary text-xs">•</span>
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                {mode === 'buyback'
                  ? 'Phiếu thu mua vàng cũ / Nguyên liệu'
                  : 'Phiếu đổi hàng vàng cũ lấy vàng mới'}
              </h2>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Quy đổi tuổi vàng, trừ hao hụt/đá hột và tính giá trị thu mua thực tế
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút chuyển nhanh chế độ Thu mua vs Đổi hàng */}
          <div className="flex items-center bg-subtle-bg border border-border-main rounded-lg p-0.5 mr-2">
            <button
              type="button"
              onClick={() => setMode('buyback')}
              className={`h-7 px-3 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                mode === 'buyback'
                  ? 'bg-card-bg text-brand shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Thu mua vàng cũ
            </button>
            <button
              type="button"
              onClick={() => setMode('exchange')}
              className={`h-7 px-3 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                mode === 'exchange'
                  ? 'bg-card-bg text-brand shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Đổi vàng cũ lấy mới
            </button>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowClockwiseRegular className="text-sm" />
            <span>Làm mới</span>
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

      {/* 2. Body */}
      <div className="flex-1 flex p-3 gap-3 overflow-hidden">
        {/* VÙNG DANH SÁCH MÓN VÀNG THU MUA */}
        <div className="flex-1 bg-card-bg rounded-xl border border-border-main shadow-2xs flex flex-col overflow-hidden">
          {/* Form thêm món thu mua */}
          <div className="p-3 bg-subtle-bg/60 border-b border-border-main flex items-end gap-2.5">
            <div className="flex-1 max-w-[180px]">
              <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                Tên món vàng cũ:
              </label>
              <input
                type="text"
                value={formItemName}
                onChange={(e) => setFormItemName(e.target.value)}
                placeholder="Ví dụ: Nhẫn 24K, Dây chuyền 18K..."
                className="w-full h-8 px-2.5 bg-card-bg border border-border-main rounded text-xs text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div className="w-36">
              <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                Loại vàng / Tuổi vàng:
              </label>
              <select
                value={formGoldTypeUuid}
                onChange={(e) => setFormGoldTypeUuid(e.target.value)}
                className="w-full h-8 px-2 bg-card-bg border border-border-main rounded text-xs text-text-primary focus:outline-none focus:border-brand"
              >
                {goldTypes.map((g) => (
                  <option key={g.uuid} value={g.uuid}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-24">
              <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                Tổng TL (chỉ):
              </label>
              <input
                type="number"
                min="0.001"
                step="0.01"
                value={formGrossWeight}
                onChange={(e) => setFormGrossWeight(Number(e.target.value) || 0)}
                className="w-full h-8 px-2 text-right bg-card-bg border border-border-main rounded text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div className="w-24">
              <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                Trừ hột/dơ:
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formDeductWeight}
                onChange={(e) => setFormDeductWeight(Number(e.target.value) || 0)}
                className="w-full h-8 px-2 text-right bg-card-bg border border-border-main rounded text-xs font-mono text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div className="w-32">
              <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                Giá mua (đ/chỉ):
              </label>
              <input
                type="number"
                min="0"
                step="50000"
                value={formBuyRate}
                onChange={(e) => setFormBuyRate(Number(e.target.value) || 0)}
                className="w-full h-8 px-2 text-right bg-card-bg border border-border-main rounded text-xs font-mono font-bold text-emerald-600 focus:outline-none focus:border-brand"
              />
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="h-8 px-3.5 bg-brand text-text-inverse rounded-lg text-xs font-bold hover:bg-brand-hover active:bg-brand-active transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
            >
              <AddRegular className="text-sm" />
              <span>Thêm món</span>
            </button>
          </div>

          {/* Bảng danh sách món */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-semibold sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-3 text-center w-10">STT</th>
                  <th className="py-2.5 px-3">Tên món vàng thu mua</th>
                  <th className="py-2.5 px-3 text-center">Tuổi vàng</th>
                  <th className="py-2.5 px-3 text-right">Tổng TL cân</th>
                  <th className="py-2.5 px-3 text-right">Trừ đá / dơ</th>
                  <th className="py-2.5 px-3 text-right">TL vàng tính tiền</th>
                  <th className="py-2.5 px-3 text-right">Đơn giá mua</th>
                  <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  <th className="py-2.5 px-2 w-10 text-center" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-subtle-bg/70 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-text-tertiary">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-text-primary">{item.itemName}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                        {item.goldTypeName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-text-secondary">
                      {item.grossWeight.toFixed(3)} chỉ
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600">
                      -{item.deductWeight.toFixed(3)} chỉ
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">
                      {item.netWeight.toFixed(3)} chỉ
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600">
                      {money.format(item.buyRate)} đ
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-brand">
                      {money.format(item.totalAmount)} đ
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-7 h-7 rounded hover:bg-status-offline-bg text-text-tertiary hover:text-status-offline flex items-center justify-center transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <DeleteRegular className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-text-tertiary">
                      Chưa có món vàng cũ nào trong danh sách.
                      <br />
                      Nhập thông tin ở thanh trên và bấm "Thêm món".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tổng kết trọng lượng */}
          <div className="p-2.5 bg-subtle-bg border-t border-border-main flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-4">
              <span>
                Tổng số món: <strong className="text-text-primary">{items.length}</strong>
              </span>
              <span>•</span>
              <span>
                Tổng cân:{' '}
                <strong className="text-text-primary font-mono">{totalGross.toFixed(3)} chỉ</strong>
              </span>
              <span>•</span>
              <span>
                Trừ đá:{' '}
                <strong className="text-rose-600 font-mono">-{totalDeduct.toFixed(3)} chỉ</strong>
              </span>
              <span>•</span>
              <span>
                TL vàng ròng tính tiền:{' '}
                <strong className="text-brand font-mono font-bold">
                  {totalNet.toFixed(3)} chỉ
                </strong>
              </span>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setItems([])}
                className="text-[11px] text-text-tertiary hover:text-status-offline cursor-pointer"
              >
                Xóa toàn bộ bảng
              </button>
            )}
          </div>
        </div>

        {/* THÔNG TIN THANH TOÁN & KHÁCH HÀNG */}
        <aside className="w-88 bg-card-bg rounded-xl border border-border-main shadow-2xs p-3.5 flex flex-col gap-3 shrink-0">
          <div className="p-3 bg-subtle-bg rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text-primary">
              <span className="flex items-center gap-1.5">
                <PersonRegular className="text-sm text-brand" />
                Khách hàng giao dịch
              </span>
            </div>
            <select
              value={selectedCustomerUuid}
              onChange={(e) => setSelectedCustomerUuid(e.target.value)}
              className="w-full h-8 px-2.5 bg-card-bg border border-border-main rounded text-xs text-text-primary focus:outline-none focus:border-brand"
            >
              <option value="">Khách vãng lai</option>
              {customers.map((c) => (
                <option key={c.uuid} value={c.uuid}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
            <div className="h-8 px-2.5 bg-card-bg border border-border-main rounded flex items-center text-xs text-text-secondary">
              {selectedCustomer?.phone || 'Chưa có số điện thoại'}
            </div>
          </div>

          {/* Chi tiết giá trị thanh toán */}
          <div className="space-y-2 border-t border-b border-border-main py-3 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Số lượng món:</span>
              <strong className="text-text-primary font-mono">{items.length} món</strong>
            </div>
            <div className="flex justify-between">
              <span>Tổng KL vàng thanh toán:</span>
              <strong className="text-text-primary font-mono">{totalNet.toFixed(3)} chỉ</strong>
            </div>
            <div className="flex justify-between text-sm font-bold text-text-primary pt-2 border-t border-dashed border-border-main">
              <span className="text-brand">
                {mode === 'buyback' ? 'TIỀN TRẢ CHO KHÁCH:' : 'GIÁ TRỊ QUY ĐỔI:'}
              </span>
              <span className="font-mono text-lg font-black text-brand">
                {money.format(totalBuybackAmount)} đ
              </span>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button
              type="button"
              onClick={() => void handleCompleteTransaction()}
              disabled={items.length === 0 || isSaving}
              className={`w-full h-11 rounded-xl text-xs font-bold text-text-inverse shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                items.length > 0 && !isSaving
                  ? 'bg-brand hover:bg-brand-hover active:bg-brand-active'
                  : 'bg-btn-disabled-bg text-btn-disabled-text cursor-not-allowed'
              }`}
            >
              <CheckmarkRegular className="text-base" />
              <span>
                {isSaving
                  ? 'ĐANG XỬ LÝ...'
                  : mode === 'buyback'
                    ? 'CHI TIỀN & LẬP PHIẾU THU MUA'
                    : 'XÁC NHẬN ĐỔI VÀNG CŨ'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                disabled={items.length === 0}
                className="h-8 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PrintRegular className="text-sm" />
                <span>In biên nhận</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg transition-colors flex items-center justify-center cursor-pointer"
              >
                <DismissRegular className="text-sm" />
                <span>Đóng trang</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default GoldBuybackPage

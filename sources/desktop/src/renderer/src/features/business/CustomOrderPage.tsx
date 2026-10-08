import React, { useCallback, useEffect, useState } from 'react'
import {
  DismissRegular,
  PrintRegular,
  AddRegular,
  DeleteRegular,
  HandshakeRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  WrenchRegular,
  PersonRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import { getCustomers, getGoldTypes, type Customer, type GoldType } from './catalog.api'

interface CustomOrder {
  id: string
  code: string
  customerName: string
  customerPhone: string
  itemName: string
  goldTypeName: string
  estWeight: number // TL dự kiến
  ringSize?: string // Ni tay / Size
  laborWage: number // Tiền công chế tác
  depositAmount: number // Tiền đặt cọc
  totalEstAmount: number // Tổng tiền dự kiến
  deliveryDate: string // Ngày hẹn giao
  notes?: string
  status: 'pending' | 'crafting' | 'completed' | 'delivered'
  createdAt: string
}

const STORAGE_KEY = 'qlbh_custom_orders_v1'
const money = new Intl.NumberFormat('vi-VN')

const SAMPLE_ORDERS: CustomOrder[] = [
  {
    id: 'ord_1',
    code: 'DH-2026-001',
    customerName: 'Nguyễn Văn Hùng',
    customerPhone: '0912 345 678',
    itemName: 'Cặp nhẫn cưới đính kim cương nhân tạo',
    goldTypeName: '18K (750)',
    estWeight: 2.5,
    ringSize: 'Nam: 16, Nữ: 11',
    laborWage: 2500000,
    depositAmount: 5000000,
    totalEstAmount: 18500000,
    deliveryDate: '12/10/2026',
    notes: 'Khắc tên lồng vào lòng nhẫn: H & M 2026',
    status: 'crafting',
    createdAt: '07/10/2026 10:15'
  },
  {
    id: 'ord_2',
    code: 'DH-2026-002',
    customerName: 'Trần Thị Mai',
    customerPhone: '0988 776 655',
    itemName: 'Kiềng cưới hoa mai chạm lộng',
    goldTypeName: '24K (999.9)',
    estWeight: 5.0,
    ringSize: 'Tiêu chuẩn',
    laborWage: 3000000,
    depositAmount: 10000000,
    totalEstAmount: 46500000,
    deliveryDate: '15/10/2026',
    notes: 'Khách yêu cầu hoa mai đúc nổi sắc nét',
    status: 'pending',
    createdAt: '07/10/2026 14:30'
  }
]

interface CustomOrderPageProps {
  onClose: () => void
}

export const CustomOrderPage: React.FC<CustomOrderPageProps> = ({ onClose }) => {
  const { token } = useAuth()
  const [orders, setOrders] = useState<CustomOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return SAMPLE_ORDERS
  })

  const [customers, setCustomers] = useState<Customer[]>([])
  const [goldTypes, setGoldTypes] = useState<GoldType[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)

  // Form tạo đơn mới
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [itemName, setItemName] = useState('')
  const [goldTypeName, setGoldTypeName] = useState('18K (750)')
  const [estWeight, setEstWeight] = useState(2.0)
  const [ringSize, setRingSize] = useState('')
  const [laborWage, setLaborWage] = useState(2000000)
  const [depositAmount, setDepositAmount] = useState(3000000)
  const [totalEstAmount, setTotalEstAmount] = useState(15000000)
  const [deliveryDate, setDeliveryDate] = useState('15/10/2026')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    try {
      const [cRows, gRows] = await Promise.all([getCustomers(token), getGoldTypes(token)])
      setCustomers(cRows.filter((c) => c.status === 'active'))
      setGoldTypes(gRows.filter((g) => g.status === 'active'))
    } catch {
      // fallback
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0] || null

  const handleCreateOrder = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!customerName.trim() || !itemName.trim()) {
      toast.error('Vui lòng nhập tên khách hàng và tên món trang sức.')
      return
    }

    const newOrder: CustomOrder = {
      id: `ord_${Date.now()}`,
      code: `DH-2026-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      itemName: itemName.trim(),
      goldTypeName,
      estWeight,
      ringSize: ringSize.trim() || 'Tiêu chuẩn',
      laborWage,
      depositAmount,
      totalEstAmount,
      deliveryDate,
      notes,
      status: 'pending',
      createdAt: new Date().toLocaleString('vi-VN')
    }

    setOrders((prev) => [newOrder, ...prev])
    setSelectedOrderId(newOrder.id)
    setIsCreating(false)
    toast.success(`Đã lập đơn đặt hàng ${newOrder.code} thành công!`)
  }

  const handleUpdateStatus = (id: string, newStatus: CustomOrder['status']): void => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    toast.success('Đã cập nhật trạng thái đơn chế tác.')
  }

  const handleDeleteOrder = (id: string): void => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
    toast.info('Đã xóa đơn đặt hàng.')
  }

  const statusBadge = (status: CustomOrder['status']): React.ReactNode => {
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/25">
          <ClockRegular className="text-xs" />
          Chờ thợ nhận
        </span>
      )
    }
    if (status === 'crafting') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-700 border border-blue-500/25">
          <WrenchRegular className="text-xs" />
          Đang chế tác
        </span>
      )
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/25">
          <CheckmarkCircleRegular className="text-xs" />
          Đã xong chờ giao
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-200 text-zinc-700 border border-zinc-300">
        Đã giao khách
      </span>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      {/* 1. Header */}
      <header className="h-12 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold">
            <HandshakeRegular className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-brand uppercase">Bán hàng</span>
              <span className="text-text-tertiary text-xs">•</span>
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                Quản lý đơn đặt hàng chế tác trang sức
              </h2>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Nhận mẫu chế tác, theo dõi tiến độ thợ kim hoàn & hẹn ngày trả hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="h-8 px-3.5 bg-brand text-text-inverse rounded-lg text-xs font-bold hover:bg-brand-hover transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <AddRegular className="text-sm" />
            <span>+ Nhận đơn đặt mới</span>
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
        {/* DANH SÁCH ĐƠN HÀNG */}
        <section className="flex-1 bg-card-bg rounded-xl border border-border-main shadow-2xs flex flex-col overflow-hidden">
          <div className="p-3 bg-subtle-bg/60 border-b border-border-main flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Danh sách đơn đặt hàng chế tác ({orders.length})
            </span>
            <span className="text-[11px] text-text-secondary">Click để xem chi tiết & cập nhật tiến độ</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-semibold sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-3">Mã đơn</th>
                  <th className="py-2.5 px-3">Khách hàng</th>
                  <th className="py-2.5 px-3">Món trang sức</th>
                  <th className="py-2.5 px-3 text-center">Tuổi vàng</th>
                  <th className="py-2.5 px-3 text-right">TL dự kiến</th>
                  <th className="py-2.5 px-3 text-right">Đặt cọc</th>
                  <th className="py-2.5 px-3 text-right">Ngày hẹn giao</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {orders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`hover:bg-subtle-bg/70 cursor-pointer transition-colors ${
                        isSelected ? 'bg-brand/5 border-l-3 border-brand' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-brand">{order.code}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-text-primary">{order.customerName}</div>
                        <div className="text-[10px] text-text-secondary font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-text-primary max-w-[200px] truncate">
                        {order.itemName}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-amber-600">
                        {order.goldTypeName}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">
                        {order.estWeight.toFixed(2)} chỉ
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                        {money.format(order.depositAmount)} đ
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-rose-600">
                        {order.deliveryDate}
                      </td>
                      <td className="py-3 px-3 text-center">{statusBadge(order.status)}</td>
                    </tr>
                  )
                })}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-text-tertiary">
                      Chưa có đơn đặt hàng nào. Bấm "+ Nhận đơn đặt mới" để tạo đơn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* CHI TIẾT ĐƠN HÀNG ĐANG CHỌN */}
        <aside className="w-96 bg-card-bg rounded-xl border border-border-main shadow-2xs p-4 flex flex-col gap-3 shrink-0 overflow-y-auto">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between border-b border-border-main pb-3">
                <div>
                  <h3 className="text-sm font-bold text-text-primary font-mono">{selectedOrder.code}</h3>
                  <p className="text-[11px] text-text-secondary">{selectedOrder.createdAt}</p>
                </div>
                {statusBadge(selectedOrder.status)}
              </div>

              {/* Thông tin khách */}
              <div className="p-3 bg-subtle-bg rounded-xl border border-border-subtle space-y-1 text-xs">
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <PersonRegular className="text-brand text-sm" />
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className="text-[11px] text-text-secondary font-mono">
                  SĐT: {selectedOrder.customerPhone || 'Chưa có'}
                </div>
              </div>

              {/* Chi tiết yêu cầu kỹ thuật */}
              <div className="space-y-2 text-xs border-b border-border-main pb-3">
                <div className="font-bold text-text-primary">{selectedOrder.itemName}</div>
                <div className="grid grid-cols-2 gap-2 text-text-secondary">
                  <div>
                    Tuổi vàng: <strong className="text-text-primary">{selectedOrder.goldTypeName}</strong>
                  </div>
                  <div>
                    Ni tay/Size: <strong className="text-text-primary font-mono">{selectedOrder.ringSize}</strong>
                  </div>
                  <div>
                    TL ước tính: <strong className="text-text-primary font-mono">{selectedOrder.estWeight} chỉ</strong>
                  </div>
                  <div>
                    Tiền công: <strong className="text-text-primary font-mono">{money.format(selectedOrder.laborWage)} đ</strong>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-800">
                    <strong>Ghi chú thợ:</strong> {selectedOrder.notes}
                  </div>
                )}
              </div>

              {/* Tiến độ & Tài chính */}
              <div className="space-y-1.5 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Tổng tiền dự kiến:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {money.format(selectedOrder.totalEstAmount)} đ
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Tiền đã đặt cọc:</span>
                  <span className="font-mono">-{money.format(selectedOrder.depositAmount)} đ</span>
                </div>
                <div className="flex justify-between text-brand font-bold pt-1 border-t border-dashed border-border-main">
                  <span>CÒN LẠI PHẢI THU:</span>
                  <span className="font-mono text-sm">
                    {money.format(Math.max(0, selectedOrder.totalEstAmount - selectedOrder.depositAmount))} đ
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-[11px] text-rose-600 font-bold">
                  <span>HẸN TRẢ KHÁCH NGÀY:</span>
                  <span className="font-mono">{selectedOrder.deliveryDate}</span>
                </div>
              </div>

              {/* Chuyển trạng thái tiến độ */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-text-primary block">
                  Cập nhật tiến độ gia công:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'crafting')}
                    className="h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold cursor-pointer"
                  >
                    Giao cho thợ làm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    className="h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold cursor-pointer"
                  >
                    Đã hoàn thành
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  className="w-full h-8 rounded-lg bg-subtle-bg hover:bg-border-main text-text-primary text-xs font-semibold cursor-pointer border border-border-main"
                >
                  Đã giao khách & thanh toán xong
                </button>
              </div>

              {/* Nút hành động */}
              <div className="mt-auto pt-3 border-t border-border-main flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 h-9 rounded-xl border border-border-main text-xs font-bold text-text-primary hover:bg-subtle-bg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PrintRegular className="text-sm" />
                  <span>In phiếu hẹn</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="h-9 px-3 rounded-xl border border-border-main text-text-tertiary hover:text-status-offline hover:bg-status-offline-bg cursor-pointer"
                  title="Xóa đơn"
                >
                  <DeleteRegular className="text-sm" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-text-tertiary">
              Chọn một đơn hàng để xem chi tiết.
            </div>
          )}
        </aside>
      </div>

      {/* MODAL TẠO ĐƠN ĐẶT MỚI */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card-bg border border-border-main rounded-2xl shadow-2xl max-w-lg w-full p-5 flex flex-col gap-4 animate-toast-in">
            <div className="flex items-center justify-between border-b border-border-main pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <HandshakeRegular className="text-brand text-base" />
                <span>Nhận đơn đặt hàng chế tác trang sức mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-7 h-7 rounded hover:bg-subtle-bg text-text-tertiary hover:text-text-primary flex items-center justify-center cursor-pointer"
              >
                <DismissRegular className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Tên khách hàng *:</label>
                  <input
                    type="text"
                    required
                    list="order-customer-list"
                    value={customerName}
                    onChange={(e) => {
                      const val = e.target.value
                      setCustomerName(val)
                      const matched = customers.find(
                        (c) => c.name.toLowerCase() === val.toLowerCase()
                      )
                      if (matched?.phone) setCustomerPhone(matched.phone)
                    }}
                    placeholder="Nguyễn Văn A..."
                    className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                  <datalist id="order-customer-list">
                    {customers.map((c) => (
                      <option key={c.uuid} value={c.name}>
                        {c.phone ? `${c.name} - ${c.phone}` : c.name}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Số điện thoại *:</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Món trang sức chế tác *:</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ví dụ: Nhẫn nam đá Ruby, Kiềng cổ hoa mai..."
                  className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded text-xs font-medium text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Tuổi vàng:</label>
                  <select
                    value={goldTypeName}
                    onChange={(e) => setGoldTypeName(e.target.value)}
                    className="w-full h-8 px-2 bg-subtle-bg border border-border-main rounded text-xs text-text-primary"
                  >
                    {goldTypes.length > 0 ? (
                      goldTypes.map((gt) => (
                        <option key={gt.uuid} value={gt.name}>
                          {gt.name} ({gt.purity || 'Chuẩn'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="24K (999.9)">24K (999.9)</option>
                        <option value="18K (750)">18K (750)</option>
                        <option value="14K (585)">14K (585)</option>
                        <option value="Vàng Ý 750">Vàng Ý 750</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-text-secondary block mb-1">TL dự kiến (chỉ):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={estWeight}
                    onChange={(e) => setEstWeight(Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 text-right bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Ni tay / Size:</label>
                  <input
                    type="text"
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    placeholder="Size 14..."
                    className="w-full h-8 px-2 bg-subtle-bg border border-border-main rounded text-xs text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Tiền công chế tác:</label>
                  <input
                    type="number"
                    step="50000"
                    value={laborWage}
                    onChange={(e) => setLaborWage(Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 text-right bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Tiền đặt cọc:</label>
                  <input
                    type="number"
                    step="100000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 text-right bg-subtle-bg border border-border-main rounded text-xs font-mono font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Tổng tiền ước tính:</label>
                  <input
                    type="number"
                    step="500000"
                    value={totalEstAmount}
                    onChange={(e) => setTotalEstAmount(Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 text-right bg-subtle-bg border border-border-main rounded text-xs font-mono font-bold text-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Ngày hẹn lấy hàng:</label>
                  <input
                    type="text"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    placeholder="15/10/2026..."
                    className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-text-secondary block mb-1">Ghi chú khắc chữ/đá:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Khắc tên, đính đá phụ..."
                    className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded text-xs text-text-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="h-9 px-4 rounded-lg border border-border-main text-xs font-semibold text-text-secondary hover:bg-subtle-bg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-lg bg-brand text-text-inverse text-xs font-bold hover:bg-brand-hover cursor-pointer"
                >
                  Xác nhận lưu đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomOrderPage

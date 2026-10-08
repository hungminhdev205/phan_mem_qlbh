import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowCounterclockwiseRegular,
  BarcodeScannerRegular,
  CheckmarkRegular,
  DeleteRegular,
  DismissRegular,
  MoneyRegular,
  PaymentRegular,
  PersonRegular,
  PrintRegular,
  QrCodeRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  createSaleTransaction,
  getCustomers,
  getStockBalances,
  type Customer,
  type Product,
  type StockBalance
} from './catalog.api'

import { InvoiceModal, type InvoiceData } from './InvoiceModal'

export interface PosItem {
  id: string
  product: Product
  warehouseUuid?: string | null
  warehouseName: string
  quantity: number
  unitPrice: number
  discountAmount: number
}

interface PosSalePageProps {
  onClose: () => void
  isWholesale?: boolean
}

const money = new Intl.NumberFormat('vi-VN')

export const PosSalePage: React.FC<PosSalePageProps> = ({ onClose, isWholesale = false }) => {
  const { token, user } = useAuth()
  const [barcodeInput, setBarcodeInput] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash')
  const [customerPaid, setCustomerPaid] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [stockRows, setStockRows] = useState<StockBalance[]>([])
  const [cartItems, setCartItems] = useState<PosItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)


  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const [stock, customerRows] = await Promise.all([getStockBalances(token), getCustomers(token)])
      setStockRows(stock.filter((row) => Number(row.quantity) > 0))
      setCustomers(customerRows.filter((customer) => customer.status === 'active'))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được dữ liệu bán hàng'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.uuid === selectedCustomerUuid) || null,
    [customers, selectedCustomerUuid]
  )

  const availableProducts = useMemo(
    () =>
      stockRows
        .filter(
          (row) =>
            !cartItems.some(
              (item) =>
                item.product.uuid === row.product.uuid && item.warehouseUuid === row.warehouse.uuid
            )
        )
        .slice(0, 40),
    [cartItems, stockRows]
  )

  const addStockRow = (row: StockBalance): void => {
    setCartItems((items) => [
      ...items,
      {
        id: `${row.product.uuid}_${row.warehouse.uuid}_${Date.now()}`,
        product: row.product,
        warehouseUuid: row.warehouse.uuid,
        warehouseName: row.warehouse.name,
        quantity: 1,
        unitPrice: Number(row.product.salePrice || 0),
        discountAmount: 0
      }
    ])
    setBarcodeInput('')
  }

  const addByCode = (): void => {
    const keyword = barcodeInput.trim().toLowerCase()
    if (!keyword) return
    const row = stockRows.find((item) => {
      const code = item.product.code.toLowerCase()
      const name = item.product.name.toLowerCase()
      return code === keyword || code.includes(keyword) || name.includes(keyword)
    })
    if (!row) {
      toast.info('Không tìm thấy sản phẩm còn tồn theo mã hoặc tên vừa nhập.')
      return
    }
    addStockRow(row)
  }

  const updateItem = (id: string, patch: Partial<PosItem>): void => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const handleDeleteItem = (id: string): void => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const totalItemsCount = cartItems.length
  const totalGoldWeight = cartItems.reduce(
    (sum, item) => sum + Number(item.product.goldWeight || 0) * item.quantity,
    0
  )
  const totalWage = cartItems.reduce(
    (sum, item) => sum + Number(item.product.laborCost || 0) * item.quantity,
    0
  )
  const subTotal = cartItems.reduce(
    (sum, item) => sum + Math.max(0, item.unitPrice * item.quantity - item.discountAmount),
    0
  )
  const finalTotal = Math.max(0, subTotal - discount)
  const changeMoney = customerPaid > 0 ? Math.max(0, customerPaid - finalTotal) : 0

  const submitSale = async (): Promise<void> => {
    if (!token || cartItems.length === 0) return
    setIsSaving(true)
    try {
      const sale = await createSaleTransaction(token, {
        customerUuid: selectedCustomerUuid || null,
        paymentMethod,
        discountAmount: discount,
        paidAmount: customerPaid,
        details: cartItems.map((item) => ({
          productUuid: item.product.uuid,
          warehouseUuid: item.warehouseUuid,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount
        }))
      })

      // Chuẩn bị dữ liệu hiển thị & in hóa đơn
      const inv: InvoiceData = {
        code: sale.code,
        createdAt: sale.createdAt || new Date().toISOString(),
        customerName: selectedCustomer?.name || 'Khách vãng lai',
        customerPhone: selectedCustomer?.phone || '',
        customerAddress: selectedCustomer?.address || '',
        cashierName: user?.fullName || user?.username || 'Thu ngân',
        paymentMethod,
        items: cartItems.map((item) => ({
          productName: item.product.name,
          productCode: item.product.code,
          goldTypeName: item.product.goldType?.name || '24K',
          goldWeight: Number(item.product.goldWeight) || 0,
          laborCost: Number(item.product.laborCost) || 0,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
          totalAmount: Math.max(0, item.unitPrice * item.quantity - item.discountAmount)
        })),
        subTotal,
        discountAmount: discount,
        totalAmount: finalTotal,
        paidAmount: customerPaid,
        changeAmount: changeMoney
      }

      setInvoiceData(inv)
      setShowInvoiceModal(true)
      toast.success(`Đã thanh toán hóa đơn ${sale.code}.`)
      setCartItems([])
      setDiscount(0)
      setCustomerPaid(0)
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tạo được hóa đơn'
      toast.error(message, { title: 'Lỗi thanh toán' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreviewInvoice = (): void => {
    if (cartItems.length === 0) {
      toast.info('Chưa có sản phẩm nào trong giỏ hàng để in thử.')
      return
    }
    const inv: InvoiceData = {
      code: `HD-IN-THU-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      customerName: selectedCustomer?.name || 'Khách vãng lai',
      customerPhone: selectedCustomer?.phone || '',
      customerAddress: selectedCustomer?.address || '',
      cashierName: user?.fullName || user?.username || 'Thu ngân',
      paymentMethod,
      items: cartItems.map((item) => ({
        productName: item.product.name,
        productCode: item.product.code,
        goldTypeName: item.product.goldType?.name || '24K',
        goldWeight: Number(item.product.goldWeight) || 0,
        laborCost: Number(item.product.laborCost) || 0,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountAmount: item.discountAmount,
        totalAmount: Math.max(0, item.unitPrice * item.quantity - item.discountAmount)
      })),
      subTotal,
      discountAmount: discount,
      totalAmount: finalTotal,
      paidAmount: customerPaid,
      changeAmount: changeMoney
    }
    setInvoiceData(inv)
    setShowInvoiceModal(true)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold">
            <BarcodeScannerRegular className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                {isWholesale ? 'Bàn bán buôn vàng & Tính giá sỉ' : 'Bàn bán lẻ vàng & trang sức (POS)'}
              </h2>
              {isWholesale && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/25 uppercase">
                  Chế độ bán sỉ
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
              <span className="font-mono text-brand font-semibold">Hóa đơn mới</span>
              <span>•</span>
              <span>{selectedCustomer?.name || 'Khách vãng lai'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void loadData()} className="h-8 px-3 rounded-lg border border-border-main text-xs font-medium text-text-primary hover:bg-subtle-bg hover:text-brand transition-colors flex items-center gap-1.5 cursor-pointer">
            <ArrowClockwiseRegular className="text-sm" />
            <span>{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
          </button>

          <button type="button" onClick={onClose} className="h-8 w-8 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors flex items-center justify-center" title="Đóng trang bán hàng" aria-label="Đóng">
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        <div className="flex-1 flex flex-col bg-card-bg rounded-xl border border-border-main shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-border-main bg-subtle-bg/60 flex items-center gap-3">
            <div className="flex-1 relative flex items-center">
              <BarcodeScannerRegular className="absolute left-3 text-lg text-text-tertiary" />
              <input
                type="text"
                placeholder="Quét mã tem hoặc nhập tên sản phẩm..."
                value={barcodeInput}
                onChange={(event) => setBarcodeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') addByCode()
                }}
                className="w-full h-10 pl-10 pr-4 bg-card-bg border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all font-mono"
              />
            </div>
            <button type="button" onClick={addByCode} className="h-10 px-4 bg-brand text-text-inverse text-xs font-semibold rounded-lg hover:bg-brand-hover active:bg-brand-active transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs">
              <AddRegular className="text-sm" />
              <span>Thêm vào đơn</span>
            </button>
          </div>

          <div className="max-h-32 overflow-y-auto border-b border-border-main bg-card-bg px-3 py-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {availableProducts.map((row) => (
                <button key={`${row.warehouse.uuid}_${row.product.uuid}`} type="button" onClick={() => addStockRow(row)} className="shrink-0 h-10 px-3 rounded-lg border border-border-main hover:border-brand hover:bg-subtle-bg text-left">
                  <div className="text-[11px] font-bold text-text-primary">{row.product.code}</div>
                  <div className="text-[10px] text-text-secondary max-w-44 truncate">{row.product.name} • tồn {row.quantity}</div>
                </button>
              ))}
              {availableProducts.length === 0 && <span className="text-xs text-text-tertiary">Chưa có sản phẩm tồn kho để bán.</span>}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-medium sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">STT</th>
                  <th className="py-2.5 px-3">Mã tem / Tên món vàng</th>
                  <th className="py-2.5 px-3 text-center">Loại vàng</th>
                  <th className="py-2.5 px-3 text-right">KL vàng</th>
                  <th className="py-2.5 px-3 text-right">SL</th>
                  <th className="py-2.5 px-3 text-right">Đơn giá</th>
                  <th className="py-2.5 px-3 text-right">Giảm</th>
                  <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  <th className="py-2.5 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {cartItems.map((item, idx) => {
                  const total = Math.max(0, item.unitPrice * item.quantity - item.discountAmount)
                  return (
                    <tr key={item.id} className="hover:bg-subtle-bg/70 transition-colors">
                      <td className="py-3 px-3 text-center text-text-tertiary font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-text-primary">{item.product.name}</div>
                        <div className="text-[11px] font-mono text-text-secondary mt-0.5">{item.product.code} • {item.warehouseName}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-brand/10 text-brand border border-brand/20">
                          {item.product.goldType?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">{Number(item.product.goldWeight || 0).toFixed(3)}</td>
                      <td className="py-3 px-3 text-right">
                        <input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) || 1 })} className="w-16 h-7 text-right px-2 bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary focus:outline-none focus:border-brand" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <input type="number" min="0" step="1000" value={item.unitPrice} onChange={(event) => updateItem(item.id, { unitPrice: Number(event.target.value) || 0 })} className="w-24 h-7 text-right px-2 bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary focus:outline-none focus:border-brand" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <input type="number" min="0" step="1000" value={item.discountAmount || ''} onChange={(event) => updateItem(item.id, { discountAmount: Number(event.target.value) || 0 })} className="w-20 h-7 text-right px-2 bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary focus:outline-none focus:border-brand" />
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-brand">{money.format(total)}</td>
                      <td className="py-3 px-2 text-center">
                        <button type="button" onClick={() => handleDeleteItem(item.id)} className="w-7 h-7 rounded hover:bg-status-offline-bg text-text-tertiary hover:text-status-offline flex items-center justify-center transition-colors" title="Xóa món này">
                          <DeleteRegular className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {cartItems.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-text-tertiary">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BarcodeScannerRegular className="text-3xl opacity-40" />
                        <p className="text-xs">Chưa có sản phẩm nào trong đơn hàng</p>
                        <p className="text-[11px]">Quét mã tem hoặc chọn sản phẩm còn tồn ở thanh gợi ý phía trên</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-subtle-bg border-t border-border-main flex items-center justify-between text-xs text-text-secondary shrink-0">
            <div className="flex items-center gap-4">
              <span>Tổng số món: <strong className="text-text-primary">{totalItemsCount}</strong></span>
              <span>•</span>
              <span>Tổng KL vàng: <strong className="text-text-primary">{totalGoldWeight.toFixed(3)}</strong></span>
              <span>•</span>
              <span>Tổng tiền công: <strong className="text-text-primary">{money.format(totalWage)} đ</strong></span>
            </div>

            <button type="button" onClick={() => setCartItems([])} className="text-[11px] text-text-tertiary hover:text-status-offline flex items-center gap-1 transition-colors">
              <ArrowCounterclockwiseRegular className="text-xs" />
              <span>Làm trống giỏ hàng</span>
            </button>
          </div>
        </div>

        <div className="w-88 flex flex-col bg-card-bg rounded-xl border border-border-main shadow-2xs p-3.5 gap-3 shrink-0">
          <div className="p-3 bg-subtle-bg rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text-primary">
              <span className="flex items-center gap-1.5"><PersonRegular className="text-sm text-brand" />Thông tin khách hàng</span>
            </div>
            <select value={selectedCustomerUuid} onChange={(event) => setSelectedCustomerUuid(event.target.value)} className="w-full h-8 px-2.5 bg-card-bg border border-border-main rounded text-xs text-text-primary focus:outline-none focus:border-brand">
              <option value="">Khách vãng lai</option>
              {customers.map((customer) => <option key={customer.uuid} value={customer.uuid}>{customer.code} - {customer.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="h-8 px-2.5 bg-card-bg border border-border-main rounded flex items-center text-text-secondary">{selectedCustomer?.phone || 'Chưa có SĐT'}</div>
              <div className="h-8 px-2.5 bg-card-bg border border-border-main rounded flex items-center text-text-secondary">{selectedCustomer?.rankName || 'Hạng thường'}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary block">Phương thức thanh toán:</label>
            <div className="grid grid-cols-3 gap-1.5">
              <PaymentButton active={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')} icon={<MoneyRegular className="text-sm" />} label="Tiền mặt" />
              <PaymentButton active={paymentMethod === 'transfer'} onClick={() => setPaymentMethod('transfer')} icon={<QrCodeRegular className="text-sm" />} label="QR" />
              <PaymentButton active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={<PaymentRegular className="text-sm" />} label="Thẻ" />
            </div>
          </div>

          <div className="space-y-2 border-t border-b border-border-main py-2.5 text-xs text-text-secondary">
            <SummaryRow label="Tổng tiền hàng:" value={`${money.format(subTotal)} đ`} />
            <div className="flex justify-between items-center">
              <span>Giảm giá / Ưu đãi:</span>
              <div className="flex items-center gap-1">
                <input type="number" min="0" step="50000" value={discount || ''} onChange={(event) => setDiscount(Number(event.target.value) || 0)} placeholder="0" className="w-24 h-7 text-right px-2 bg-subtle-bg border border-border-main rounded text-xs font-mono text-text-primary focus:outline-none focus:border-brand" />
                <span>đ</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-dashed border-border-main text-sm font-bold text-text-primary">
              <span className="text-brand">CẦN THANH TOÁN:</span>
              <span className="font-mono text-lg font-black text-brand">{money.format(finalTotal)} đ</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span>Tiền khách đưa:</span>
              <input type="number" min="0" step="100000" value={customerPaid || ''} onChange={(event) => setCustomerPaid(Number(event.target.value) || 0)} placeholder="Nhập số tiền..." className="w-32 h-8 text-right px-2 bg-subtle-bg border border-border-main rounded text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-brand" />
            </div>
            {customerPaid > 0 && <SummaryRow label="Tiền thối lại:" value={`${money.format(changeMoney)} đ`} highlight />}
          </div>

          <div className="mt-auto space-y-2">
            <button type="button" onClick={() => void submitSale()} disabled={cartItems.length === 0 || isSaving} className={`w-full h-11 rounded-xl text-xs font-bold text-text-inverse shadow-xs flex items-center justify-center gap-2 transition-all ${cartItems.length > 0 && !isSaving ? 'bg-brand hover:bg-brand-hover active:bg-brand-active' : 'bg-btn-disabled-bg text-btn-disabled-text cursor-not-allowed'}`}>
              <CheckmarkRegular className="text-base" />
              <span>{isSaving ? 'ĐANG THANH TOÁN...' : 'THANH TOÁN & LƯU HÓA ĐƠN'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePreviewInvoice}
                disabled={cartItems.length === 0}
                className={`h-8 rounded-lg border border-border-main text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  cartItems.length > 0
                    ? 'text-text-primary hover:bg-subtle-bg'
                    : 'text-text-tertiary cursor-not-allowed opacity-60'
                }`}
              >
                <PrintRegular className="text-sm" />
                <span>In thử phiếu</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DismissRegular className="text-sm" />
                <span>Đóng bàn bán</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal In hóa đơn bán hàng */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={invoiceData}
      />
    </div>
  )
}

const PaymentButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button type="button" onClick={onClick} className={`h-9 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${active ? 'bg-brand/10 border-brand text-brand font-semibold' : 'border-border-main text-text-secondary hover:bg-subtle-bg'}`}>
    {icon}
    {label}
  </button>
)

const SummaryRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`flex justify-between items-center ${highlight ? 'text-status-online-text font-semibold' : ''}`}>
    <span>{label}</span>
    <span className="font-mono font-semibold text-text-primary">{value}</span>
  </div>
)

export default PosSalePage

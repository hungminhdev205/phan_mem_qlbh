import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {
  ArrowClockwiseRegular,
  DismissRegular,
  ReceiptRegular,
  PrintRegular,
  SearchRegular,
  FilterRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import { getSaleTransactions, type SaleTransaction } from './catalog.api'
import { InvoiceModal, type InvoiceData } from './InvoiceModal'

interface SalesReportPageProps {
  onClose: () => void
}

const money = new Intl.NumberFormat('vi-VN')

export const SalesReportPage: React.FC<SalesReportPageProps> = ({ onClose }) => {
  const { token } = useAuth()
  const [rows, setRows] = useState<SaleTransaction[]>([])
  const [selectedUuid, setSelectedUuid] = useState('')
  const [keyword, setKeyword] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceToPrint, setInvoiceToPrint] = useState<InvoiceData | null>(null)


  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const data = await getSaleTransactions(token)
      setRows(data)
      setSelectedUuid((current) => current || data[0]?.uuid || '')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được hóa đơn bán hàng'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredRows = useMemo(() => {
    let result = rows
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase()
      result = result.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.customer?.name.toLowerCase().includes(q) ||
          r.customer?.phone?.includes(q)
      )
    }
    if (dateFilter !== 'all') {
      const now = new Date().getTime()
      const days = dateFilter === 'today' ? 1 : dateFilter === '7days' ? 7 : 30
      result = result.filter((r) => {
        if (!r.createdAt) return false
        const time = new Date(r.createdAt).getTime()
        return now - time <= days * 24 * 60 * 60 * 1000
      })
    }
    return result
  }, [rows, keyword, dateFilter])

  const selected = useMemo(
    () => filteredRows.find((row) => row.uuid === selectedUuid) || filteredRows[0] || null,
    [filteredRows, selectedUuid]
  )

  const handlePrintSelected = (): void => {
    if (!selected) return
    const subTotal = selected.details.reduce(
      (sum, d) => sum + (Number(d.unitPrice) || 0) * (Number(d.quantity) || 1),
      0
    )
    const inv: InvoiceData = {
      code: selected.code,
      createdAt: selected.createdAt,
      customerName: selected.customer?.name || 'Khách vãng lai',
      customerPhone: selected.customer?.phone || '',
      customerAddress: selected.customer?.address || '',
      paymentMethod: selected.paymentMethod || 'cash',
      items: selected.details.map((d) => ({
        productName: d.product.name,
        productCode: d.product.code,
        goldTypeName: d.product.goldType?.name || '24K',
        goldWeight: Number(d.product.goldWeight) || 0,
        laborCost: Number(d.product.laborCost) || 0,
        quantity: d.quantity,
        unitPrice: Number(d.unitPrice) || 0,
        discountAmount: Number(d.discountAmount) || 0,
        totalAmount: Number(d.totalAmount) || 0
      })),
      subTotal,
      discountAmount: Math.max(0, subTotal - Number(selected.totalAmount || 0)),
      totalAmount: Number(selected.totalAmount) || 0,
      paidAmount: Number(selected.paidAmount) || 0,
      changeAmount: Number(selected.changeAmount) || 0
    }
    setInvoiceToPrint(inv)
    setShowInvoiceModal(true)
  }

  const totalRevenue = filteredRows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0)
  const totalPaid = filteredRows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0)
  const totalItems = filteredRows.reduce((sum, row) => sum + row.details.length, 0)

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Báo cáo</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Báo cáo & Hóa đơn bán hàng</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadData()}
            className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowClockwiseRegular className="text-sm" />
            <span>{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors flex items-center justify-center cursor-pointer"
          >
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      {/* Thanh bộ lọc & Tổng số liệu */}
      <div className="h-14 bg-card-bg border-b border-border-main px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1 flex items-center">
            <SearchRegular className="absolute left-2.5 text-sm text-text-tertiary" />
            <input
              type="text"
              placeholder="Tìm mã hóa đơn, tên hoặc SĐT khách hàng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <FilterRegular className="text-sm text-text-tertiary" />
            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value as 'all' | 'today' | '7days' | '30days')
              }
              className="h-8 px-2 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary font-medium"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày gần nhất</option>
              <option value="30days">30 ngày qua</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Metric label="Số hóa đơn" value={String(filteredRows.length)} />
          <Metric label="Tổng doanh thu" value={`${money.format(totalRevenue)} đ`} />
          <Metric label="Đã thu thực tế" value={`${money.format(totalPaid)} đ`} />
        </div>
      </div>

      <div className="flex-1 p-3 grid grid-cols-[1fr_390px] gap-3 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0 shadow-2xs">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-medium sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-3">Mã hóa đơn</th>
                  <th className="py-2.5 px-3">Khách hàng</th>
                  <th className="py-2.5 px-3">Thanh toán</th>
                  <th className="py-2.5 px-3 text-right">Số món</th>
                  <th className="py-2.5 px-3 text-right">Tổng tiền</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredRows.map((row) => (
                  <tr
                    key={row.uuid}
                    onClick={() => setSelectedUuid(row.uuid)}
                    className={`hover:bg-subtle-bg/70 cursor-pointer transition-colors ${
                      selected?.uuid === row.uuid ? 'bg-brand/5 border-l-2 border-brand' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-brand">{row.code}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-text-primary">
                        {row.customer?.name || 'Khách vãng lai'}
                      </div>
                      <div className="text-[10px] text-text-tertiary">{formatDate(row.createdAt)}</div>
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary">
                      {paymentLabel(row.paymentMethod)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">{row.details.length}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-brand">
                      {money.format(Number(row.totalAmount || 0))} đ
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-text-tertiary">
                      {isLoading ? 'Đang tải dữ liệu...' : 'Không có hóa đơn nào phù hợp.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="h-9 bg-subtle-bg border-t border-border-main px-4 flex items-center text-xs text-text-secondary shrink-0">
            {isLoading
              ? 'Đang tải dữ liệu...'
              : `Hiển thị ${filteredRows.length} hóa đơn, ${totalItems} món vàng`}
          </div>
        </section>

        <aside className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col shadow-2xs">
          <div className="h-12 px-4 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptRegular className="text-lg text-brand" />
              <div>
                <div className="text-xs font-bold text-text-primary">
                  {selected?.code || 'Chưa chọn hóa đơn'}
                </div>
                <div className="text-[10px] text-text-secondary">
                  {selected ? formatDate(selected.createdAt) : 'Chọn một hóa đơn'}
                </div>
              </div>
            </div>

            {selected && (
              <button
                type="button"
                onClick={handlePrintSelected}
                className="h-8 px-2.5 bg-brand text-text-inverse rounded-lg text-xs font-bold hover:bg-brand-hover flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <PrintRegular className="text-sm" />
                <span>In hóa đơn</span>
              </button>
            )}
          </div>

          {selected ? (
            <>
              <div className="p-3.5 border-b border-border-main text-xs space-y-1.5 bg-subtle-bg/40">
                <SummaryRow
                  label="Khách hàng"
                  value={selected.customer?.name || 'Khách vãng lai'}
                />
                <SummaryRow label="Hình thức" value={paymentLabel(selected.paymentMethod)} />
                <SummaryRow
                  label="Tổng tiền hàng"
                  value={`${money.format(Number(selected.totalAmount || 0))} đ`}
                />
                <SummaryRow
                  label="Đã thanh toán"
                  value={`${money.format(Number(selected.paidAmount || 0))} đ`}
                />
                <SummaryRow
                  label="Tiền thối lại"
                  value={`${money.format(Number(selected.changeAmount || 0))} đ`}
                />
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-2">
                {selected.details.map((detail, index) => (
                  <div
                    key={`${detail.product.uuid}_${index}`}
                    className="border border-border-main rounded-lg p-2.5 text-xs bg-card-bg"
                  >
                    <div className="font-bold text-text-primary">{detail.product.name}</div>
                    <div className="mt-0.5 text-[10px] text-text-secondary font-mono">
                      {detail.product.code} • {detail.warehouse?.name || 'Kho chính'}
                    </div>
                    <div className="mt-1.5 grid grid-cols-3 gap-1 text-[11px] text-text-secondary">
                      <span>
                        SL: <strong className="text-text-primary">{detail.quantity}</strong>
                      </span>
                      <span>
                        Giá:{' '}
                        <strong className="text-text-primary">
                          {money.format(Number(detail.unitPrice || 0))}
                        </strong>
                      </span>
                      <span className="text-right font-bold text-brand">
                        {money.format(Number(detail.totalAmount || 0))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-text-tertiary">
              Chưa có hóa đơn bán hàng.
            </div>
          )}
        </aside>
      </div>

      {/* Modal in hóa đơn */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={invoiceToPrint}
      />
    </div>
  )
}


const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="h-10 px-3 rounded-lg bg-subtle-bg border border-border-subtle flex flex-col justify-center">
    <span className="text-[10px] uppercase font-semibold text-text-tertiary">{label}</span>
    <strong className="text-sm text-text-primary font-mono">{value}</strong>
  </div>
)

const StatusPill: React.FC<{ status: string }> = ({ status }) => (
  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-status-online-bg text-status-online-text border-status-online-border">
    {status === 'completed' ? 'Hoàn tất' : status}
  </span>
)

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-text-secondary">{label}</span>
    <strong className="text-text-primary text-right">{value}</strong>
  </div>
)

function paymentLabel(value?: string | null): string {
  if (value === 'cash') return 'Tiền mặt'
  if (value === 'transfer') return 'Chuyển khoản/QR'
  if (value === 'card') return 'Thẻ'
  return 'Chưa rõ'
}

function formatDate(value?: string): string {
  if (!value) return ''
  return new Date(value).toLocaleString('vi-VN')
}

export default SalesReportPage

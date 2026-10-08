import React from 'react'
import {
  DismissRegular,
  PrintRegular,
  CheckmarkCircleRegular,
  ShieldCheckmarkRegular
} from '@fluentui/react-icons'

export interface InvoiceItemDetail {
  productName: string
  productCode: string
  goldTypeName?: string
  goldWeight?: number
  laborCost?: number
  quantity: number
  unitPrice: number
  discountAmount?: number
  totalAmount: number
}

export interface InvoiceData {
  code: string
  createdAt?: string
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  cashierName?: string
  paymentMethod?: string
  items: InvoiceItemDetail[]
  subTotal: number
  discountAmount: number
  totalAmount: number
  paidAmount?: number
  changeAmount?: number
}

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: InvoiceData | null
  companyName?: string
  companyAddress?: string
  companyPhone?: string
  companyTaxCode?: string
}

const money = new Intl.NumberFormat('vi-VN')

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  companyName = 'DNTN KINH DOANH VÀNG BẠC KIM NGÂN',
  companyAddress = '56 Hàng Bạc, Q. Hoàn Kiếm, TP. Hà Nội',
  companyPhone = '0386 884 915',
  companyTaxCode = '038688491522'
}) => {
  if (!isOpen || !invoice) return null

  const handlePrint = (): void => {
    window.print()
  }

  const paymentLabel = (method?: string): string => {
    if (method === 'cash') return 'Tiền mặt'
    if (method === 'transfer') return 'Chuyển khoản ngân hàng / QR'
    if (method === 'card') return 'Thẻ POS'
    return 'Tiền mặt'
  }

  const formattedDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : new Date().toLocaleString('vi-VN')

  const totalGoldWeight = invoice.items.reduce(
    (sum, item) => sum + (Number(item.goldWeight) || 0) * (Number(item.quantity) || 1),
    0
  )

  const totalLaborCost = invoice.items.reduce(
    (sum, item) => sum + (Number(item.laborCost) || 0) * (Number(item.quantity) || 1),
    0
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-toast-in">
        {/* Thanh điều khiển trên cùng (ẩn khi in) */}
        <div className="print:hidden h-12 bg-zinc-100 border-b border-zinc-200 px-4 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
            <CheckmarkCircleRegular className="text-emerald-600 text-base" />
            <span>Xem trước & In hóa đơn trang sức</span>
            <span className="text-zinc-400 font-normal">|</span>
            <span className="font-mono text-zinc-600">{invoice.code}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PrintRegular className="text-sm" />
              <span>In hóa đơn</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
              title="Đóng"
            >
              <DismissRegular className="text-sm" />
            </button>
          </div>
        </div>

        {/* Nội dung Hóa đơn thật (khu vực sẽ in ra) */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs bg-white text-zinc-900 selection:bg-amber-100">
          {/* Header tiệm vàng */}
          <div className="text-center pb-4 border-b border-zinc-300">
            <h1 className="text-base font-extrabold tracking-wide uppercase text-amber-900">
              {companyName}
            </h1>
            <p className="text-[11px] text-zinc-600 mt-0.5">Địa chỉ: {companyAddress}</p>
            <p className="text-[11px] text-zinc-600">
              Điện thoại: <strong className="text-zinc-800 font-mono">{companyPhone}</strong> • MST:{' '}
              <strong className="text-zinc-800 font-mono">{companyTaxCode}</strong>
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-md">
              <h2 className="text-xs font-black tracking-wider text-amber-900 uppercase">
                HÓA ĐƠN BÁN LẺ & GIẤY BẢO HÀNH VÀNG
              </h2>
            </div>
          </div>

          {/* Thông tin hóa đơn & Khách hàng */}
          <div className="grid grid-cols-2 gap-3 py-3 text-[11px] border-b border-zinc-200">
            <div>
              <p>
                <span className="text-zinc-500">Mã hóa đơn:</span>{' '}
                <strong className="font-mono font-bold text-zinc-900">{invoice.code}</strong>
              </p>
              <p className="mt-0.5">
                <span className="text-zinc-500">Ngày giờ:</span>{' '}
                <span className="font-mono">{formattedDate}</span>
              </p>
              <p className="mt-0.5">
                <span className="text-zinc-500">Thu ngân:</span>{' '}
                <span className="font-medium">{invoice.cashierName || 'Nhân viên bán lẻ'}</span>
              </p>
            </div>
            <div className="text-right">
              <p>
                <span className="text-zinc-500">Khách hàng:</span>{' '}
                <strong className="text-zinc-900">{invoice.customerName || 'Khách vãng lai'}</strong>
              </p>
              <p className="mt-0.5">
                <span className="text-zinc-500">Số ĐT:</span>{' '}
                <span className="font-mono">{invoice.customerPhone || 'Chưa cập nhật'}</span>
              </p>
              <p className="mt-0.5 text-zinc-500 truncate">
                {invoice.customerAddress ? `Đ/c: ${invoice.customerAddress}` : ''}
              </p>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="mt-3">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-zinc-400 text-zinc-700 font-bold bg-zinc-50">
                  <th className="py-1.5 px-2 text-center w-8">STT</th>
                  <th className="py-1.5 px-2">Tên món / Mã vàng</th>
                  <th className="py-1.5 px-2 text-center">Tuổi vàng</th>
                  <th className="py-1.5 px-2 text-right">KL Vàng</th>
                  <th className="py-1.5 px-2 text-right">Tiền công</th>
                  <th className="py-1.5 px-2 text-right">SL</th>
                  <th className="py-1.5 px-2 text-right">Đơn giá</th>
                  <th className="py-1.5 px-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {invoice.items.map((item, index) => (
                  <tr key={`${item.productCode}_${index}`}>
                    <td className="py-2 px-2 text-center font-mono text-zinc-500">{index + 1}</td>
                    <td className="py-2 px-2">
                      <div className="font-bold text-zinc-900">{item.productName}</div>
                      <div className="font-mono text-[10px] text-zinc-500">{item.productCode}</div>
                    </td>
                    <td className="py-2 px-2 text-center font-semibold text-amber-800">
                      {item.goldTypeName || '24K'}
                    </td>
                    <td className="py-2 px-2 text-right font-mono">
                      {Number(item.goldWeight || 0).toFixed(3)} chỉ
                    </td>
                    <td className="py-2 px-2 text-right font-mono">
                      {money.format(item.laborCost || 0)} đ
                    </td>
                    <td className="py-2 px-2 text-right font-mono">{item.quantity}</td>
                    <td className="py-2 px-2 text-right font-mono">
                      {money.format(item.unitPrice)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-zinc-900">
                      {money.format(item.totalAmount)} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tổng tiền & Chi tiết thanh toán */}
          <div className="mt-4 pt-3 border-t border-zinc-300 flex justify-between items-start text-[11px]">
            <div className="space-y-1 text-zinc-600 max-w-[280px]">
              <p>
                • Tổng số món: <strong className="text-zinc-900">{invoice.items.length}</strong>
              </p>
              <p>
                • Tổng KL vàng:{' '}
                <strong className="text-zinc-900 font-mono">{totalGoldWeight.toFixed(3)} chỉ</strong>
              </p>
              <p>
                • Tổng tiền công:{' '}
                <strong className="text-zinc-900 font-mono">{money.format(totalLaborCost)} đ</strong>
              </p>
              <p>
                • Thanh toán:{' '}
                <strong className="text-zinc-900">{paymentLabel(invoice.paymentMethod)}</strong>
              </p>
            </div>

            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-zinc-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-mono font-medium">{money.format(invoice.subTotal)} đ</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Giảm giá / Ưu đãi:</span>
                  <span className="font-mono">-{money.format(invoice.discountAmount)} đ</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black text-amber-900 pt-1 border-t border-dashed border-zinc-300">
                <span>TỔNG THANH TOÁN:</span>
                <span className="font-mono text-sm">{money.format(invoice.totalAmount)} đ</span>
              </div>
              {invoice.paidAmount !== undefined && invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-zinc-600 text-[10px]">
                    <span>Tiền khách đưa:</span>
                    <span className="font-mono">{money.format(invoice.paidAmount)} đ</span>
                  </div>
                  {invoice.changeAmount !== undefined && invoice.changeAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 text-[10px] font-semibold">
                      <span>Tiền thối lại:</span>
                      <span className="font-mono">{money.format(invoice.changeAmount)} đ</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Cam kết & Chữ ký */}
          <div className="mt-5 pt-3 border-t border-zinc-200">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-700 font-semibold mb-2">
              <ShieldCheckmarkRegular className="text-amber-700 text-xs" />
              <span>Cam kết chất lượng & Chính sách bảo hành:</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed italic">
              1. Tiệm vàng cam kết đúng tuổi vàng niêm yết theo quy định chuẩn nhà nước.
              <br />
              2. Miễn phí trọn đời công làm mới, đánh bóng, gắn đá phụ rơi rớt.
              <br />
              3. Quý khách vui lòng giữ lại hóa đơn này để trao đổi hoặc thu hồi với giá tốt nhất.
            </p>

            <div className="grid grid-cols-2 text-center text-[11px] pt-6 pb-4">
              <div>
                <p className="font-bold text-zinc-800">KHÁCH HÀNG</p>
                <p className="text-[10px] text-zinc-400 italic">(Ký và ghi rõ họ tên)</p>
                <div className="h-14" />
                <p className="text-zinc-600 font-medium">{invoice.customerName || ''}</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800">ĐẠI DIỆN TIỆM VÀNG</p>
                <p className="text-[10px] text-zinc-400 italic">(Ký, đóng dấu thu ngân)</p>
                <div className="h-14" />
                <p className="text-zinc-600 font-medium">{companyName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal

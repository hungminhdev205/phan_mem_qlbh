import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BarcodeScannerRegular,
  DismissRegular,
  PrintRegular,
  AddRegular,
  DeleteRegular,
  ArrowClockwiseRegular,
  SearchRegular,
  TagRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import { getProducts, type Product } from './catalog.api'

interface BarcodePrintPageProps {
  onClose: () => void
}

interface QueuedTagItem {
  product: Product
  copies: number
  showWage: boolean
  showStone: boolean
  showPrice: boolean
}

const money = new Intl.NumberFormat('vi-VN')

export const BarcodePrintPage: React.FC<BarcodePrintPageProps> = ({ onClose }) => {
  const { token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [printQueue, setPrintQueue] = useState<QueuedTagItem[]>([])
  const [selectedProductUuid, setSelectedProductUuid] = useState<string>('')
  const [tagTemplate, setTagTemplate] = useState<'standard' | 'mini'>('standard')
  const [storeBrand, setStoreBrand] = useState('KIM NGÂN JEWELRY')

  const loadProducts = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const data = await getProducts(token, keyword)
      setProducts(data.filter((p) => p.status !== 'deleted'))
      if (data.length > 0 && !selectedProductUuid) {
        setSelectedProductUuid(data[0].uuid)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được danh mục trang sức'
      toast.error(message, { title: 'Lỗi tải dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [keyword, selectedProductUuid, token])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const selectedProduct = useMemo(
    () => products.find((p) => p.uuid === selectedProductUuid) || products[0] || null,
    [products, selectedProductUuid]
  )

  const addToQueue = (product: Product): void => {
    setPrintQueue((prev) => {
      const existing = prev.find((item) => item.product.uuid === product.uuid)
      if (existing) {
        return prev.map((item) =>
          item.product.uuid === product.uuid ? { ...item, copies: item.copies + 1 } : item
        )
      }
      return [
        ...prev,
        {
          product,
          copies: 1,
          showWage: true,
          showStone: true,
          showPrice: false
        }
      ]
    })
    toast.info(`Đã thêm tem món ${product.code} vào hàng đợi in.`)
  }

  const addAllToQueue = (): void => {
    if (products.length === 0) return
    const newItems: QueuedTagItem[] = products.map((product) => ({
      product,
      copies: 1,
      showWage: true,
      showStone: true,
      showPrice: false
    }))
    setPrintQueue(newItems)
    toast.success(`Đã đưa toàn bộ ${products.length} sản phẩm vào hàng đợi in tem.`)
  }

  const updateQueueItem = (productUuid: string, patch: Partial<QueuedTagItem>): void => {
    setPrintQueue((prev) =>
      prev.map((item) => (item.product.uuid === productUuid ? { ...item, ...patch } : item))
    )
  }

  const removeFromQueue = (productUuid: string): void => {
    setPrintQueue((prev) => prev.filter((item) => item.product.uuid !== productUuid))
  }

  const handlePrint = (): void => {
    if (printQueue.length === 0) {
      toast.error('Vui lòng thêm ít nhất một món vào hàng đợi in tem.')
      return
    }
    window.print()
  }

  const totalTagsToPrint = printQueue.reduce((sum, item) => sum + item.copies, 0)

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      {/* 1. Header trang */}
      <header className="h-12 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0 shadow-2xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold">
            <TagRegular className="text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary leading-tight">
              Quản lý in tem mã vạch trang sức
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-text-secondary">
              <span>Chuẩn tem vàng thông tư 22/BKHCN</span>
              <span>•</span>
              <span className="font-mono text-brand font-semibold">
                Đang chọn in: {totalTagsToPrint} tem
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            disabled={printQueue.length === 0}
            className={`h-8 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
              printQueue.length > 0
                ? 'bg-brand hover:bg-brand-hover text-text-inverse'
                : 'bg-btn-disabled-bg text-btn-disabled-text cursor-not-allowed'
            }`}
          >
            <PrintRegular className="text-sm" />
            <span>In {totalTagsToPrint} tem ngay</span>
          </button>

          <button
            type="button"
            onClick={() => void loadProducts()}
            className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowClockwiseRegular className="text-sm" />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors flex items-center justify-center cursor-pointer"
            title="Đóng trang in tem"
          >
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      {/* 2. Nội dung 3 cột: Cột 1 Chọn sản phẩm, Cột 2 Xem trước tem, Cột 3 Hàng đợi in */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3 print:p-0 print:m-0">
        {/* CỘT 1: Danh sách sản phẩm để chọn in (Ẩn khi in) */}
        <section className="w-80 bg-card-bg rounded-xl border border-border-main shadow-2xs flex flex-col overflow-hidden shrink-0 print:hidden">
          <div className="p-2.5 border-b border-border-main bg-subtle-bg/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text-primary">
              <span>Sản phẩm trong kho</span>
              <button
                type="button"
                onClick={addAllToQueue}
                className="text-[11px] text-brand hover:underline font-semibold cursor-pointer"
              >
                + Đưa tất cả vào in
              </button>
            </div>
            <div className="relative flex items-center">
              <SearchRegular className="absolute left-2.5 text-sm text-text-tertiary" />
              <input
                type="text"
                placeholder="Tìm mã hoặc tên món..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full h-8 pl-8 pr-2.5 bg-card-bg border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand font-mono"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
            {products.map((item) => {
              const isSelected = selectedProductUuid === item.uuid
              return (
                <div
                  key={item.uuid}
                  onClick={() => setSelectedProductUuid(item.uuid)}
                  className={`p-2.5 flex items-center justify-between hover:bg-subtle-bg/80 cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand/10 border-l-3 border-brand' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-brand">{item.code}</span>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-subtle-bg text-text-secondary border border-border-subtle">
                        {item.goldType?.name || '24K'}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-text-primary truncate mt-0.5">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-text-secondary font-mono mt-0.5">
                      TL: {Number(item.weight || 0).toFixed(3)} | V:{' '}
                      {Number(item.goldWeight || 0).toFixed(3)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToQueue(item)
                    }}
                    className="h-7 px-2 bg-subtle-bg hover:bg-brand hover:text-text-inverse text-text-secondary border border-border-main rounded-md text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="Thêm vào danh sách in tem"
                  >
                    <AddRegular className="text-xs" />
                    <span>In</span>
                  </button>
                </div>
              )
            })}

            {products.length === 0 && (
              <div className="p-8 text-center text-xs text-text-tertiary">
                {isLoading ? 'Đang tải sản phẩm...' : 'Chưa có sản phẩm trang sức nào.'}
              </div>
            )}
          </div>
        </section>

        {/* CỘT 2: Xem trước trực quan con tem vàng (1:1 & Phóng to) */}
        <section className="flex-1 bg-card-bg rounded-xl border border-border-main shadow-2xs flex flex-col overflow-hidden print:hidden">
          <div className="p-3 border-b border-border-main bg-subtle-bg/60 flex items-center justify-between">
            <div className="text-xs font-bold text-text-primary flex items-center gap-2">
              <BarcodeScannerRegular className="text-base text-brand" />
              <span>Mô phỏng con tem đuôi trang sức (Live Preview)</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-text-secondary flex items-center gap-1">
                <span>Mẫu tem:</span>
                <select
                  value={tagTemplate}
                  onChange={(e) => setTagTemplate(e.target.value as 'standard' | 'mini')}
                  className="h-7 px-2 bg-card-bg border border-border-main rounded text-xs text-text-primary"
                >
                  <option value="standard">Tem chuẩn 2 cánh gập (35x22mm)</option>
                  <option value="mini">Tem nhỏ dây chuyền (25x15mm)</option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => selectedProduct && addToQueue(selectedProduct)}
                disabled={!selectedProduct}
                className="h-7 px-2.5 bg-brand text-text-inverse rounded text-xs font-semibold hover:bg-brand-hover cursor-pointer"
              >
                + Thêm món này vào in
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-zinc-100">
            {selectedProduct ? (
              <div className="flex flex-col items-center gap-6">
                <span className="text-xs text-zinc-500 font-medium">
                  Kích thước mẫu tem phóng to xem trước:
                </span>

                {/* Khung mô phỏng con tem gấp 2 cánh thực tế của tiệm vàng */}
                <div className="w-[420px] bg-white rounded-lg shadow-xl border-2 border-zinc-300 p-4 font-mono text-[11px] text-black select-text flex flex-col gap-2 relative">
                  {/* Nhãn tiệm vàng */}
                  <div className="flex justify-between items-center border-b border-dashed border-zinc-400 pb-1.5">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
                      {storeBrand}
                    </span>
                    <span className="font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">
                      {selectedProduct.goldType?.name || '24K'}
                    </span>
                  </div>

                  {/* 2 Cánh tem: Cánh trái thông số vàng, Cánh phải mã vạch */}
                  <div className="grid grid-cols-2 gap-3 py-1">
                    {/* Cánh trái: Thông tin trọng lượng vàng và đá theo chuẩn TT22 */}
                    <div className="space-y-0.5 text-[10px] leading-tight">
                      <p className="font-bold truncate text-[11px] text-zinc-900">
                        {selectedProduct.name}
                      </p>
                      <p className="pt-0.5">
                        Mã: <strong className="text-zinc-900">{selectedProduct.code}</strong>
                      </p>
                      <p>
                        Tổng TL:{' '}
                        <strong>{Number(selectedProduct.weight || 0).toFixed(3)} chỉ</strong>
                      </p>
                      <p>
                        TL Vàng:{' '}
                        <strong>{Number(selectedProduct.goldWeight || 0).toFixed(3)} chỉ</strong>
                      </p>
                      <p>
                        Hột/Đá:{' '}
                        <strong>{Number(selectedProduct.stoneWeight || 0).toFixed(3)} chỉ</strong>
                      </p>
                      <p>
                        Công:{' '}
                        <strong>{money.format(Number(selectedProduct.laborCost || 0))} đ</strong>
                      </p>
                    </div>

                    {/* Cánh phải: Mã vạch Barcode 1D + Giá bán (nếu có) */}
                    <div className="flex flex-col items-center justify-center border-l border-dashed border-zinc-300 pl-3">
                      {/* Giả lập Barcode 1D bằng thanh sọc chuẩn */}
                      <div className="w-full flex items-center justify-center gap-[2px] h-12 bg-zinc-50 p-1 border border-zinc-200 rounded">
                        {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 1, 5, 2, 4].map(
                          (w, i) => (
                            <div
                              key={i}
                              className="bg-black h-full"
                              style={{ width: `${(w % 3) + 1.5}px` }}
                            />
                          )
                        )}
                      </div>
                      <span className="font-mono text-[10px] font-bold tracking-widest mt-1">
                        *{selectedProduct.code}*
                      </span>

                      {selectedProduct.fixedPrice && (
                        <div className="mt-1 font-bold text-amber-900 text-xs">
                          {money.format(Number(selectedProduct.salePrice || 0))} đ
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phần đuôi dán tem gập nhẫn */}
                  <div className="pt-1 border-t border-dashed border-zinc-300 flex items-center justify-between text-[9px] text-zinc-500">
                    <span>Chuẩn kiểm định vàng</span>
                    <span>Đuôi dán nhẫn siêu bền</span>
                  </div>
                </div>

                <div className="text-center text-xs text-zinc-500">
                  Tem tự động căn vừa khổ in máy in mã vạch chuyên dụng (Godex G500, Bixolon T403,
                  TSC TE200).
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-400">Chọn một sản phẩm để xem trước con tem.</div>
            )}
          </div>
        </section>

        {/* CỘT 3: Hàng đợi in tem (Queue) (Ẩn khi in) */}
        <section className="w-96 bg-card-bg rounded-xl border border-border-main shadow-2xs flex flex-col overflow-hidden shrink-0 print:hidden">
          <div className="p-3 border-b border-border-main bg-subtle-bg/60 flex items-center justify-between">
            <div className="text-xs font-bold text-text-primary">
              Hàng đợi in ({totalTagsToPrint} tem)
            </div>
            {printQueue.length > 0 && (
              <button
                type="button"
                onClick={() => setPrintQueue([])}
                className="text-[11px] text-status-offline hover:underline cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="p-3 border-b border-border-main bg-card-bg space-y-2 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                Tên thương hiệu trên tem:
              </label>
              <input
                type="text"
                value={storeBrand}
                onChange={(e) => setStoreBrand(e.target.value)}
                placeholder="Tên tiệm vàng..."
                className="w-full h-8 px-2.5 bg-subtle-bg border border-border-main rounded text-xs text-text-primary font-bold"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
            {printQueue.map((item) => (
              <div key={item.product.uuid} className="p-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-brand">
                      {item.product.code}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      {item.product.goldType?.name || '24K'}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-text-primary truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    TL: {Number(item.product.goldWeight || 0).toFixed(3)} chỉ
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="text-[11px] text-text-secondary flex items-center gap-1">
                    <span>SL:</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={item.copies}
                      onChange={(e) =>
                        updateQueueItem(item.product.uuid, {
                          copies: Math.max(1, parseInt(e.target.value) || 1)
                        })
                      }
                      className="w-12 h-7 text-center bg-subtle-bg border border-border-main rounded text-xs font-bold text-text-primary font-mono"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => removeFromQueue(item.product.uuid)}
                    className="w-7 h-7 rounded hover:bg-status-offline-bg text-text-tertiary hover:text-status-offline flex items-center justify-center transition-colors cursor-pointer"
                    title="Xóa khỏi hàng đợi"
                  >
                    <DeleteRegular className="text-sm" />
                  </button>
                </div>
              </div>
            ))}

            {printQueue.length === 0 && (
              <div className="p-8 text-center text-xs text-text-tertiary">
                Chưa có tem nào trong hàng đợi in.
                <br />
                Bấm nút "In" ở danh sách sản phẩm để thêm.
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border-main bg-subtle-bg/60">
            <button
              type="button"
              onClick={handlePrint}
              disabled={printQueue.length === 0}
              className={`w-full h-10 rounded-xl text-xs font-bold text-text-inverse shadow-xs flex items-center justify-center gap-2 transition-all ${
                printQueue.length > 0
                  ? 'bg-brand hover:bg-brand-hover active:bg-brand-active cursor-pointer'
                  : 'bg-btn-disabled-bg text-btn-disabled-text cursor-not-allowed'
              }`}
            >
              <PrintRegular className="text-base" />
              <span>XUẤT IN {totalTagsToPrint} TEM TRANG SỨC</span>
            </button>
          </div>
        </section>
      </div>

      {/* KHU VỰC IN THỰC TẾ (Chỉ hiển thị khi @media print) */}
      <div className="hidden print:block print:p-2 bg-white text-black font-mono">
        <div className="grid grid-cols-2 gap-2">
          {printQueue.flatMap((item) =>
            Array.from({ length: item.copies }).map((_, idx) => (
              <div
                key={`${item.product.uuid}_${idx}`}
                className="border border-black p-2 text-[9px] leading-tight page-break-inside-avoid flex flex-col justify-between h-[100px]"
              >
                <div className="flex justify-between font-bold border-b border-black pb-0.5">
                  <span>{storeBrand}</span>
                  <span>{item.product.goldType?.name || '24K'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <div>
                    <div className="font-bold truncate max-w-[120px]">{item.product.name}</div>
                    <div>Mã: {item.product.code}</div>
                    <div>TL: {Number(item.product.weight || 0).toFixed(3)}c</div>
                    <div>Vàng: {Number(item.product.goldWeight || 0).toFixed(3)}c</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">*{item.product.code}*</div>
                    <div>Công: {money.format(Number(item.product.laborCost || 0))}đ</div>
                  </div>
                </div>
                <div className="text-[8px] text-center border-t border-black pt-0.5">
                  Chuẩn TT22 BKHCN
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default BarcodePrintPage

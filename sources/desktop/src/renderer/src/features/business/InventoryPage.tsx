import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  DismissRegular,
  EditRegular,
  ArrowSwapRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  createStockBalance,
  createWarehouse,
  createInventoryMovement,
  deleteStockBalance,
  deleteWarehouse,
  getInventoryMovements,
  getProducts,
  getStockBalances,
  getWarehouses,
  type InventoryMovement,
  type InventoryMovementPayload,
  type Product,
  type RecordStatus,
  type StockBalance,
  type StockBalancePayload,
  type Warehouse,
  type WarehousePayload,
  updateStockBalance,
  updateWarehouse
} from './catalog.api'

interface InventoryPageProps {
  onClose: () => void
  initialTab?: ActiveTab
  initialMovementType?: 'import' | 'transfer'
}

type ActiveTab = 'warehouses' | 'stock' | 'movements'

const emptyWarehouseForm: WarehousePayload = {
  code: '',
  name: '',
  address: '',
  status: 'active'
}

const emptyStockForm: StockBalancePayload = {
  warehouseUuid: '',
  productUuid: '',
  quantity: 0,
  minQuantity: 0,
  locationCode: ''
}

const emptyMovementForm: InventoryMovementPayload = {
  movementType: 'import',
  sourceWarehouseUuid: '',
  targetWarehouseUuid: '',
  productUuid: '',
  quantity: 1,
  unitCost: 0,
  note: ''
}

const statusLabel: Record<RecordStatus, string> = {
  active: 'Đang dùng',
  inactive: 'Tạm ngưng',
  deleted: 'Đã xóa'
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ onClose, initialTab, initialMovementType }) => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'stock')
  const [isLoading, setIsLoading] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [editingStock, setEditingStock] = useState<StockBalance | null>(null)
  const [warehouseForm, setWarehouseForm] = useState<WarehousePayload>(emptyWarehouseForm)
  const [stockForm, setStockForm] = useState<StockBalancePayload>(emptyStockForm)
  const [movementForm, setMovementForm] = useState<InventoryMovementPayload>({
    ...emptyMovementForm,
    movementType: initialMovementType || 'import'
  })

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  useEffect(() => {
    if (initialMovementType) {
      setMovementForm((prev) => ({ ...prev, movementType: initialMovementType }))
    }
  }, [initialMovementType])

  const activeWarehouses = useMemo(
    () => warehouses.filter((warehouse) => warehouse.status !== 'deleted'),
    [warehouses]
  )

  const activeProducts = useMemo(
    () => products.filter((product) => product.status !== 'deleted'),
    [products]
  )

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const [warehouseRows, stockRows, productRows, movementRows] = await Promise.all([
        getWarehouses(token),
        getStockBalances(token),
        getProducts(token),
        getInventoryMovements(token)
      ])
      setWarehouses(warehouseRows)
      setStockBalances(stockRows)
      setProducts(productRows)
      setMovements(movementRows)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được dữ liệu kho'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetWarehouseForm = (): void => {
    setEditingWarehouse(null)
    setWarehouseForm(emptyWarehouseForm)
  }

  const resetStockForm = (): void => {
    setEditingStock(null)
    setStockForm(emptyStockForm)
  }

  const resetMovementForm = (): void => {
    setMovementForm({
      ...emptyMovementForm,
      movementType: initialMovementType || 'import'
    })
  }

  const submitWarehouse = async (): Promise<void> => {
    if (!token) return
    try {
      if (editingWarehouse) {
        await updateWarehouse(token, editingWarehouse.uuid, warehouseForm)
        toast.success('Đã cập nhật kho.')
      } else {
        await createWarehouse(token, warehouseForm)
        toast.success('Đã thêm kho mới.')
      }
      resetWarehouseForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được kho'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const submitStock = async (): Promise<void> => {
    if (!token) return
    const payload = {
      ...stockForm,
      quantity: Number(stockForm.quantity || 0),
      minQuantity: Number(stockForm.minQuantity || 0)
    }
    try {
      if (editingStock) {
        await updateStockBalance(token, editingStock.uuid, payload)
        toast.success('Đã cập nhật tồn kho.')
      } else {
        await createStockBalance(token, payload)
        toast.success('Đã thêm dòng tồn kho.')
      }
      resetStockForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được tồn kho'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const submitMovement = async (): Promise<void> => {
    if (!token) return
    const payload = {
      ...movementForm,
      sourceWarehouseUuid: movementForm.movementType === 'transfer' ? movementForm.sourceWarehouseUuid || null : null,
      targetWarehouseUuid: movementForm.targetWarehouseUuid || null,
      quantity: Number(movementForm.quantity || 0),
      unitCost: Number(movementForm.unitCost || 0)
    }
    try {
      await createInventoryMovement(token, payload)
      toast.success(movementForm.movementType === 'import' ? 'Đã nhập kho.' : 'Đã chuyển kho.')
      resetMovementForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được phiếu kho'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const startEditWarehouse = (warehouse: Warehouse): void => {
    setActiveTab('warehouses')
    setEditingWarehouse(warehouse)
    setWarehouseForm({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address || '',
      status: warehouse.status
    })
  }

  const startEditStock = (stock: StockBalance): void => {
    setActiveTab('stock')
    setEditingStock(stock)
    setStockForm({
      warehouseUuid: stock.warehouse.uuid,
      productUuid: stock.product.uuid,
      quantity: stock.quantity,
      minQuantity: stock.minQuantity,
      locationCode: stock.locationCode || ''
    })
  }

  const removeWarehouse = async (warehouse: Warehouse): Promise<void> => {
    if (!token) return
    await deleteWarehouse(token, warehouse.uuid)
    toast.info('Đã ngưng dùng kho.')
    await loadData()
  }

  const removeStock = async (stock: StockBalance): Promise<void> => {
    if (!token) return
    await deleteStockBalance(token, stock.uuid)
    toast.info('Đã xóa dòng tồn kho.')
    await loadData()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Kho hàng</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Kho & tồn kho sản phẩm</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void loadData()} className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg hover:text-text-primary transition-colors flex items-center gap-1.5">
            <ArrowClockwiseRegular className="text-sm" />
            <span>Làm mới</span>
          </button>
          <button type="button" onClick={onClose} className="h-8 w-8 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors flex items-center justify-center">
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      <div className="h-11 bg-card-bg border-b border-border-main px-4 flex items-center shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'stock' as const, label: 'Tồn kho' },
            { id: 'movements' as const, label: 'Phiếu kho' },
            { id: 'warehouses' as const, label: 'Kho / quầy' }
          ].map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${activeTab === tab.id ? 'bg-brand text-text-inverse' : 'text-text-secondary hover:bg-subtle-bg hover:text-text-primary'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[1fr_350px] gap-4 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0">
          {activeTab === 'warehouses' ? (
            <WarehouseTable rows={warehouses} isLoading={isLoading} onEdit={startEditWarehouse} onDelete={removeWarehouse} />
          ) : activeTab === 'movements' ? (
            <MovementTable rows={movements} isLoading={isLoading} />
          ) : (
            <StockTable rows={stockBalances} isLoading={isLoading} onEdit={startEditStock} onDelete={removeStock} />
          )}
        </section>

        <aside className="bg-card-bg border border-border-main rounded-xl p-4 overflow-y-auto">
          {activeTab === 'warehouses' ? (
            <WarehouseForm form={warehouseForm} editing={editingWarehouse} onChange={setWarehouseForm} onCancel={resetWarehouseForm} onSubmit={submitWarehouse} />
          ) : activeTab === 'movements' ? (
            <MovementForm form={movementForm} warehouses={activeWarehouses} products={activeProducts} onChange={setMovementForm} onCancel={resetMovementForm} onSubmit={submitMovement} />
          ) : (
            <StockForm form={stockForm} warehouses={activeWarehouses} products={activeProducts} editing={editingStock} onChange={setStockForm} onCancel={resetStockForm} onSubmit={submitStock} />
          )}
        </aside>
      </div>
    </div>
  )
}

interface TableProps<T> {
  rows: T[]
  isLoading: boolean
  onEdit: (row: T) => void
  onDelete: (row: T) => Promise<void>
}

const WarehouseTable: React.FC<TableProps<Warehouse>> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell columns={['Mã kho', 'Tên kho/quầy', 'Địa chỉ', 'Trạng thái', '']} isLoading={isLoading} emptyText="Danh sách kho/quầy">
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
        <td className="py-3 px-4 font-semibold text-text-primary">{row.name}</td>
        <td className="py-3 px-4 text-text-secondary">{row.address || '-'}</td>
        <td className="py-3 px-4"><StatusPill status={row.status} /></td>
        <RowActions onEdit={() => onEdit(row)} onDelete={() => void onDelete(row)} />
      </tr>
    ))}
  </TableShell>
)

const StockTable: React.FC<TableProps<StockBalance>> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell columns={['Kho', 'Sản phẩm', 'Mã SP', 'Tồn hiện có', 'Tồn tối thiểu', 'Vị trí', 'Cảnh báo', '']} isLoading={isLoading} emptyText="Danh sách tồn kho">
    {rows.map((row) => {
      const low = Number(row.quantity) <= Number(row.minQuantity)
      return (
        <tr key={row.uuid} className="hover:bg-subtle-bg/70">
          <td className="py-3 px-4 font-semibold text-text-primary">{row.warehouse.name}</td>
          <td className="py-3 px-4 text-text-primary">{row.product.name}</td>
          <td className="py-3 px-4 font-mono text-brand font-bold">{row.product.code}</td>
          <td className="py-3 px-4 text-right font-mono font-bold">{row.quantity}</td>
          <td className="py-3 px-4 text-right font-mono">{row.minQuantity}</td>
          <td className="py-3 px-4 text-text-secondary">{row.locationCode || '-'}</td>
          <td className="py-3 px-4">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${low ? 'bg-status-offline-bg text-status-offline border-status-offline-border' : 'bg-status-online-bg text-status-online-text border-status-online-border'}`}>
              {low ? 'Sắp hết' : 'Ổn'}
            </span>
          </td>
          <RowActions onEdit={() => onEdit(row)} onDelete={() => void onDelete(row)} />
        </tr>
      )
    })}
  </TableShell>
)

const MovementTable: React.FC<{ rows: InventoryMovement[]; isLoading: boolean }> = ({ rows, isLoading }) => (
  <TableShell columns={['Mã phiếu', 'Loại', 'Sản phẩm', 'Kho nguồn', 'Kho nhận', 'Số lượng', 'Giá vốn', 'Ngày lập']} isLoading={isLoading} emptyText="Lịch sử phiếu nhập/chuyển kho">
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
        <td className="py-3 px-4"><MovementTypePill type={row.movementType} /></td>
        <td className="py-3 px-4">
          <div className="font-semibold text-text-primary">{row.product.name}</div>
          <div className="text-[11px] text-text-tertiary font-mono">{row.product.code}</div>
        </td>
        <td className="py-3 px-4 text-text-secondary">{row.sourceWarehouse?.name || '-'}</td>
        <td className="py-3 px-4 text-text-secondary">{row.targetWarehouse?.name || '-'}</td>
        <td className="py-3 px-4 text-right font-mono font-bold">{row.quantity}</td>
        <td className="py-3 px-4 text-right font-mono">{Number(row.unitCost || 0).toLocaleString('vi-VN')}</td>
        <td className="py-3 px-4 text-text-secondary">{formatDate(row.createdAt)}</td>
      </tr>
    ))}
  </TableShell>
)

const TableShell: React.FC<React.PropsWithChildren<{ columns: string[]; isLoading: boolean; emptyText: string }>> = ({ columns, isLoading, emptyText, children }) => (
  <>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-subtle-bg text-text-secondary font-medium sticky top-0 border-b border-border-main z-10">
          <tr>{columns.map((column) => <th key={column || 'actions'} className="py-2.5 px-4 whitespace-nowrap">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">{children}</tbody>
      </table>
    </div>
    <div className="h-10 bg-subtle-bg border-t border-border-main px-4 flex items-center text-xs text-text-secondary shrink-0">{isLoading ? 'Đang tải dữ liệu...' : emptyText}</div>
  </>
)

const WarehouseForm: React.FC<{ form: WarehousePayload; editing: Warehouse | null; onChange: (form: WarehousePayload) => void; onCancel: () => void; onSubmit: () => Promise<void> }> = ({ form, editing, onChange, onCancel, onSubmit }) => (
  <FormShell title={editing ? 'Sửa kho/quầy' : 'Thêm kho/quầy'} onCancel={onCancel} onSubmit={onSubmit}>
    <Field label="Mã kho"><input value={form.code} onChange={(e) => onChange({ ...form, code: e.target.value })} className={inputClass} /></Field>
    <Field label="Tên kho/quầy"><input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className={inputClass} /></Field>
    <Field label="Địa chỉ"><textarea value={form.address || ''} onChange={(e) => onChange({ ...form, address: e.target.value })} className={`${inputClass} h-20 resize-none py-2`} /></Field>
  </FormShell>
)

const StockForm: React.FC<{ form: StockBalancePayload; warehouses: Warehouse[]; products: Product[]; editing: StockBalance | null; onChange: (form: StockBalancePayload) => void; onCancel: () => void; onSubmit: () => Promise<void> }> = ({ form, warehouses, products, editing, onChange, onCancel, onSubmit }) => (
  <FormShell title={editing ? 'Sửa tồn kho' : 'Thêm tồn kho'} onCancel={onCancel} onSubmit={onSubmit}>
    <Field label="Kho/quầy"><select value={form.warehouseUuid} onChange={(e) => onChange({ ...form, warehouseUuid: e.target.value })} className={inputClass}><option value="">Chọn kho</option>{warehouses.map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></Field>
    <Field label="Sản phẩm"><select value={form.productUuid} onChange={(e) => onChange({ ...form, productUuid: e.target.value })} className={inputClass}><option value="">Chọn sản phẩm</option>{products.map((item) => <option key={item.uuid} value={item.uuid}>{item.code} - {item.name}</option>)}</select></Field>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Tồn hiện có"><input type="number" min="0" step="0.001" value={String(form.quantity ?? 0)} onChange={(e) => onChange({ ...form, quantity: e.target.value })} className={inputClass} /></Field>
      <Field label="Tồn tối thiểu"><input type="number" min="0" step="0.001" value={String(form.minQuantity ?? 0)} onChange={(e) => onChange({ ...form, minQuantity: e.target.value })} className={inputClass} /></Field>
    </div>
    <Field label="Vị trí"><input value={form.locationCode || ''} onChange={(e) => onChange({ ...form, locationCode: e.target.value })} className={inputClass} /></Field>
  </FormShell>
)

const MovementForm: React.FC<{ form: InventoryMovementPayload; warehouses: Warehouse[]; products: Product[]; onChange: (form: InventoryMovementPayload) => void; onCancel: () => void; onSubmit: () => Promise<void> }> = ({ form, warehouses, products, onChange, onCancel, onSubmit }) => (
  <FormShell title="Lập phiếu kho" onCancel={onCancel} onSubmit={onSubmit}>
    <Field label="Loại phiếu"><select value={form.movementType} onChange={(e) => onChange({ ...form, movementType: e.target.value as InventoryMovementPayload['movementType'] })} className={inputClass}><option value="import">Nhập kho</option><option value="transfer">Chuyển kho</option></select></Field>
    {form.movementType === 'transfer' && (
      <Field label="Kho nguồn"><select value={form.sourceWarehouseUuid || ''} onChange={(e) => onChange({ ...form, sourceWarehouseUuid: e.target.value })} className={inputClass}><option value="">Chọn kho nguồn</option>{warehouses.map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></Field>
    )}
    <Field label={form.movementType === 'import' ? 'Kho nhập' : 'Kho nhận'}><select value={form.targetWarehouseUuid || ''} onChange={(e) => onChange({ ...form, targetWarehouseUuid: e.target.value })} className={inputClass}><option value="">Chọn kho nhận</option>{warehouses.map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></Field>
    <Field label="Sản phẩm"><select value={form.productUuid} onChange={(e) => onChange({ ...form, productUuid: e.target.value })} className={inputClass}><option value="">Chọn sản phẩm</option>{products.map((item) => <option key={item.uuid} value={item.uuid}>{item.code} - {item.name}</option>)}</select></Field>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Số lượng"><input type="number" min="0.001" step="0.001" value={String(form.quantity ?? 1)} onChange={(e) => onChange({ ...form, quantity: e.target.value })} className={inputClass} /></Field>
      <Field label="Giá vốn"><input type="number" min="0" step="1000" value={String(form.unitCost ?? 0)} onChange={(e) => onChange({ ...form, unitCost: e.target.value })} className={inputClass} /></Field>
    </div>
    <Field label="Ghi chú"><textarea value={form.note || ''} onChange={(e) => onChange({ ...form, note: e.target.value })} className={`${inputClass} h-20 resize-none py-2`} /></Field>
  </FormShell>
)

const FormShell: React.FC<React.PropsWithChildren<{ title: string; onCancel: () => void; onSubmit: () => Promise<void> }>> = ({ title, children, onCancel, onSubmit }) => (
  <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); void onSubmit() }}>
    <h3 className="text-sm font-bold text-text-primary">{title}</h3>
    {children}
    <div className="flex items-center justify-end gap-2 pt-2">
      <button type="button" onClick={onCancel} className="h-8 px-3 rounded-lg border border-border-main text-xs font-semibold text-text-secondary hover:bg-subtle-bg">Hủy</button>
      <button type="submit" className="h-8 px-3 rounded-lg bg-brand text-text-inverse text-xs font-semibold hover:bg-brand-hover flex items-center gap-1.5"><AddRegular className="text-sm" /><span>Lưu</span></button>
    </div>
  </form>
)

const StatusPill: React.FC<{ status: RecordStatus }> = ({ status }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status === 'active' ? 'bg-status-online-bg text-status-online-text border-status-online-border' : 'bg-status-checking-bg text-status-checking-text border-status-checking-border'}`}>
    {statusLabel[status]}
  </span>
)

const MovementTypePill: React.FC<{ type: InventoryMovement['movementType'] }> = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${type === 'import' ? 'bg-status-online-bg text-status-online-text border-status-online-border' : 'bg-status-checking-bg text-status-checking-text border-status-checking-border'}`}>
    <ArrowSwapRegular className="text-xs" />
    {type === 'import' ? 'Nhập kho' : 'Chuyển kho'}
  </span>
)

const RowActions: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
  <td className="py-2 px-4 text-right">
    <div className="flex items-center justify-end gap-1">
      <button type="button" onClick={onEdit} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-brand hover:bg-subtle-bg flex items-center justify-center" title="Sửa"><EditRegular className="text-sm" /></button>
      <button type="button" onClick={onDelete} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg flex items-center justify-center" title="Xóa"><DeleteRegular className="text-sm" /></button>
    </div>
  </td>
)

const inputClass = 'w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand'

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-xs font-semibold text-text-secondary">
    <span>{label}</span>
    {children}
  </label>
)

function formatDate(value?: string): string {
  if (!value) return ''
  return new Date(value).toLocaleString('vi-VN')
}

export default InventoryPage

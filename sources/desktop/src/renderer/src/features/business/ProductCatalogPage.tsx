import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  DismissRegular,
  EditRegular,
  SearchRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  createGoldType,
  createProduct,
  deleteGoldType,
  deleteProduct,
  getGoldTypes,
  getProducts,
  getSuppliers,
  type GoldType,
  type GoldTypePayload,
  type Product,
  type ProductPayload,
  type RecordStatus,
  type Supplier,
  updateGoldType,
  updateProduct
} from './catalog.api'

type ActiveTab = 'goldTypes' | 'products'

interface ProductCatalogPageProps {
  onClose: () => void
  initialTab?: ActiveTab
}

const emptyGoldTypeForm: GoldTypePayload = {
  code: '',
  name: '',
  purity: '',
  description: '',
  status: 'active'
}

const emptyProductForm: ProductPayload = {
  goldTypeUuid: '',
  supplierUuid: '',
  code: '',
  name: '',
  categoryName: 'Trang sức',
  unitName: 'chiếc',
  weight: 0,
  goldWeight: 0,
  stoneWeight: 0,
  laborCost: 0,
  stoneCost: 0,
  baseLaborCost: 0,
  baseStoneCost: 0,
  costPrice: 0,
  purchasePrice: 0,
  salePrice: 0,
  fixedPrice: false,
  vatRate: 0,
  status: 'active'
}

const statusLabel: Record<RecordStatus, string> = {
  active: 'Đang dùng',
  inactive: 'Tạm ngưng',
  deleted: 'Đã xóa'
}

const money = new Intl.NumberFormat('vi-VN')

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({ onClose, initialTab }) => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'products')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [goldTypes, setGoldTypes] = useState<GoldType[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [editingGoldType, setEditingGoldType] = useState<GoldType | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [goldTypeForm, setGoldTypeForm] = useState<GoldTypePayload>(emptyGoldTypeForm)
  const [productForm, setProductForm] = useState<ProductPayload>(emptyProductForm)

  const activeGoldTypes = useMemo(
    () => goldTypes.filter((item) => item.status !== 'deleted'),
    [goldTypes]
  )

  const activeSuppliers = useMemo(
    () => suppliers.filter((item) => item.status !== 'deleted'),
    [suppliers]
  )

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const [goldRows, productRows, supplierRows] = await Promise.all([
        getGoldTypes(token, activeTab === 'goldTypes' ? keyword : ''),
        getProducts(token, activeTab === 'products' ? keyword : ''),
        getSuppliers(token)
      ])
      setGoldTypes(goldRows)
      setProducts(productRows)
      setSuppliers(supplierRows)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được dữ liệu sản phẩm'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, keyword, token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetGoldTypeForm = (): void => {
    setEditingGoldType(null)
    setGoldTypeForm(emptyGoldTypeForm)
  }

  const resetProductForm = (): void => {
    setEditingProduct(null)
    setProductForm(emptyProductForm)
  }

  const submitGoldType = async (): Promise<void> => {
    if (!token) return
    try {
      if (editingGoldType) {
        await updateGoldType(token, editingGoldType.uuid, goldTypeForm)
        toast.success('Đã cập nhật loại vàng.')
      } else {
        await createGoldType(token, goldTypeForm)
        toast.success('Đã thêm loại vàng mới.')
      }
      resetGoldTypeForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được loại vàng'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const submitProduct = async (): Promise<void> => {
    if (!token) return
    try {
      const payload = normalizeProductPayload(productForm)
      if (editingProduct) {
        await updateProduct(token, editingProduct.uuid, payload)
        toast.success('Đã cập nhật sản phẩm.')
      } else {
        await createProduct(token, payload)
        toast.success('Đã thêm sản phẩm mới.')
      }
      resetProductForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được sản phẩm'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const startEditGoldType = (goldType: GoldType): void => {
    setActiveTab('goldTypes')
    setEditingGoldType(goldType)
    setGoldTypeForm({
      code: goldType.code,
      name: goldType.name,
      purity: goldType.purity || '',
      description: goldType.description || '',
      status: goldType.status
    })
  }

  const startEditProduct = (product: Product): void => {
    setActiveTab('products')
    setEditingProduct(product)
    setProductForm({
      goldTypeUuid: product.goldType?.uuid || '',
      supplierUuid: product.supplier?.uuid || '',
      code: product.code,
      name: product.name,
      categoryName: product.categoryName,
      unitName: product.unitName,
      weight: product.weight,
      goldWeight: product.goldWeight,
      stoneWeight: product.stoneWeight,
      laborCost: product.laborCost,
      stoneCost: product.stoneCost,
      baseLaborCost: product.baseLaborCost,
      baseStoneCost: product.baseStoneCost,
      costPrice: product.costPrice,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      fixedPrice: product.fixedPrice,
      vatRate: product.vatRate,
      status: product.status
    })
  }

  const removeGoldType = async (goldType: GoldType): Promise<void> => {
    if (!token) return
    await deleteGoldType(token, goldType.uuid)
    toast.info('Đã ngưng dùng loại vàng.')
    await loadData()
  }

  const removeProduct = async (product: Product): Promise<void> => {
    if (!token) return
    await deleteProduct(token, product.uuid)
    toast.info('Đã ngưng dùng sản phẩm.')
    await loadData()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Danh mục</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Danh mục sản phẩm vàng</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadData()}
            className="h-8 px-2.5 rounded-lg border border-border-main text-xs font-medium text-text-secondary hover:bg-subtle-bg hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <ArrowClockwiseRegular className="text-sm" />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg hover:border-status-offline-border transition-colors flex items-center justify-center"
          >
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      <div className="h-11 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'products' as const, label: 'Sản phẩm' },
            { id: 'goldTypes' as const, label: 'Loại vàng' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand text-text-inverse'
                  : 'text-text-secondary hover:bg-subtle-bg hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-80 relative flex items-center">
          <SearchRegular className="absolute left-3 text-base text-text-tertiary" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm mã, tên, nhóm sản phẩm..."
            className="w-full h-8 pl-9 pr-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[1fr_390px] gap-4 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0">
          {activeTab === 'goldTypes' ? (
            <GoldTypeTable rows={goldTypes} isLoading={isLoading} onEdit={startEditGoldType} onDelete={removeGoldType} />
          ) : (
            <ProductTable rows={products} isLoading={isLoading} onEdit={startEditProduct} onDelete={removeProduct} />
          )}
        </section>
        <aside className="bg-card-bg border border-border-main rounded-xl p-4 overflow-y-auto">
          {activeTab === 'goldTypes' ? (
            <GoldTypeForm
              form={goldTypeForm}
              editing={editingGoldType}
              onChange={setGoldTypeForm}
              onCancel={resetGoldTypeForm}
              onSubmit={submitGoldType}
            />
          ) : (
            <ProductForm
              form={productForm}
              goldTypes={activeGoldTypes}
              suppliers={activeSuppliers}
              editing={editingProduct}
              onChange={setProductForm}
              onCancel={resetProductForm}
              onSubmit={submitProduct}
            />
          )}
        </aside>
      </div>
    </div>
  )
}

function normalizeProductPayload(form: ProductPayload): ProductPayload {
  return {
    ...form,
    goldTypeUuid: form.goldTypeUuid || null,
    supplierUuid: form.supplierUuid || null,
    weight: Number(form.weight || 0),
    goldWeight: Number(form.goldWeight || 0),
    stoneWeight: Number(form.stoneWeight || 0),
    laborCost: Number(form.laborCost || 0),
    stoneCost: Number(form.stoneCost || 0),
    baseLaborCost: Number(form.baseLaborCost || 0),
    baseStoneCost: Number(form.baseStoneCost || 0),
    costPrice: Number(form.costPrice || 0),
    purchasePrice: Number(form.purchasePrice || 0),
    salePrice: Number(form.salePrice || 0),
    vatRate: Number(form.vatRate || 0)
  }
}

interface TableProps<T> {
  rows: T[]
  isLoading: boolean
  onEdit: (row: T) => void
  onDelete: (row: T) => Promise<void>
}

const GoldTypeTable: React.FC<TableProps<GoldType>> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell columns={['Mã', 'Tên loại vàng', 'Hàm lượng', 'Mô tả', 'Trạng thái', '']} isLoading={isLoading} emptyText="Chưa có loại vàng nào.">
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
        <td className="py-3 px-4 font-semibold text-text-primary">{row.name}</td>
        <td className="py-3 px-4 font-mono text-text-secondary">{row.purity || '-'}</td>
        <td className="py-3 px-4 text-text-secondary">{row.description || '-'}</td>
        <td className="py-3 px-4"><StatusPill status={row.status} /></td>
        <RowActions onEdit={() => onEdit(row)} onDelete={() => void onDelete(row)} />
      </tr>
    ))}
  </TableShell>
)

const ProductTable: React.FC<TableProps<Product>> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell
    columns={['Mã SP', 'Tên sản phẩm', 'Loại vàng', 'Tem/NCC', 'KL vàng', 'KL đá', 'Giá bán', 'Trạng thái', '']}
    isLoading={isLoading}
    emptyText="Chưa có sản phẩm nào."
  >
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
        <td className="py-3 px-4">
          <div className="font-semibold text-text-primary">{row.name}</div>
          <div className="text-[11px] text-text-tertiary">{row.categoryName} · {row.unitName}</div>
        </td>
        <td className="py-3 px-4 text-text-secondary">{row.goldType?.name || '-'}</td>
        <td className="py-3 px-4 text-text-secondary">
          <div>{row.supplier?.tagCategory.name || '-'}</div>
          <div className="text-[11px] text-text-tertiary">{row.supplier?.name || ''}</div>
        </td>
        <td className="py-3 px-4 font-mono text-right">{row.goldWeight}</td>
        <td className="py-3 px-4 font-mono text-right">{row.stoneWeight}</td>
        <td className="py-3 px-4 font-mono text-right font-bold text-brand">{money.format(row.salePrice)} đ</td>
        <td className="py-3 px-4"><StatusPill status={row.status} /></td>
        <RowActions onEdit={() => onEdit(row)} onDelete={() => void onDelete(row)} />
      </tr>
    ))}
  </TableShell>
)

interface TableShellProps {
  columns: string[]
  isLoading: boolean
  emptyText: string
  children: React.ReactNode
}

const TableShell: React.FC<TableShellProps> = ({ columns, isLoading, emptyText, children }) => (
  <>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-subtle-bg text-text-secondary font-medium sticky top-0 border-b border-border-main z-10">
          <tr>{columns.map((column) => <th key={column || 'actions'} className="py-2.5 px-4 whitespace-nowrap">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">{children}</tbody>
      </table>
    </div>
    <div className="h-10 bg-subtle-bg border-t border-border-main px-4 flex items-center text-xs text-text-secondary shrink-0">
      <span>{isLoading ? 'Đang tải dữ liệu...' : emptyText}</span>
    </div>
  </>
)

const StatusPill: React.FC<{ status: RecordStatus }> = ({ status }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
    status === 'active'
      ? 'bg-status-online-bg text-status-online-text border-status-online-border'
      : 'bg-status-checking-bg text-status-checking-text border-status-checking-border'
  }`}>
    {statusLabel[status]}
  </span>
)

const RowActions: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
  <td className="py-2 px-4 text-right">
    <div className="flex items-center justify-end gap-1">
      <button type="button" onClick={onEdit} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-brand hover:bg-subtle-bg flex items-center justify-center" title="Sửa">
        <EditRegular className="text-sm" />
      </button>
      <button type="button" onClick={onDelete} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg flex items-center justify-center" title="Ngưng dùng">
        <DeleteRegular className="text-sm" />
      </button>
    </div>
  </td>
)

const GoldTypeForm: React.FC<{
  form: GoldTypePayload
  editing: GoldType | null
  onChange: (form: GoldTypePayload) => void
  onCancel: () => void
  onSubmit: () => Promise<void>
}> = ({ form, editing, onChange, onCancel, onSubmit }) => (
  <FormShell title={editing ? 'Sửa loại vàng' : 'Thêm loại vàng'} onCancel={onCancel} onSubmit={onSubmit}>
    <Field label="Mã loại vàng"><input value={form.code} onChange={(e) => onChange({ ...form, code: e.target.value })} className={inputClass} /></Field>
    <Field label="Tên loại vàng"><input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className={inputClass} /></Field>
    <Field label="Hàm lượng"><input value={form.purity || ''} onChange={(e) => onChange({ ...form, purity: e.target.value })} className={inputClass} /></Field>
    <Field label="Mô tả"><textarea value={form.description || ''} onChange={(e) => onChange({ ...form, description: e.target.value })} className={`${inputClass} h-20 resize-none py-2`} /></Field>
  </FormShell>
)

const ProductForm: React.FC<{
  form: ProductPayload
  goldTypes: GoldType[]
  suppliers: Supplier[]
  editing: Product | null
  onChange: (form: ProductPayload) => void
  onCancel: () => void
  onSubmit: () => Promise<void>
}> = ({ form, goldTypes, suppliers, editing, onChange, onCancel, onSubmit }) => (
  <FormShell title={editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} onCancel={onCancel} onSubmit={onSubmit}>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Mã sản phẩm"><input value={form.code} onChange={(e) => onChange({ ...form, code: e.target.value })} className={inputClass} /></Field>
      <Field label="Đơn vị tính"><input value={form.unitName || ''} onChange={(e) => onChange({ ...form, unitName: e.target.value })} className={inputClass} /></Field>
    </div>
    <Field label="Tên sản phẩm"><input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className={inputClass} /></Field>
    <Field label="Nhóm sản phẩm"><input value={form.categoryName} onChange={(e) => onChange({ ...form, categoryName: e.target.value })} className={inputClass} /></Field>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Loại vàng"><select value={form.goldTypeUuid || ''} onChange={(e) => onChange({ ...form, goldTypeUuid: e.target.value })} className={inputClass}><option value="">Chọn</option>{goldTypes.map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></Field>
      <Field label="Nhà cung cấp"><select value={form.supplierUuid || ''} onChange={(e) => onChange({ ...form, supplierUuid: e.target.value })} className={inputClass}><option value="">Chọn</option>{suppliers.map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></Field>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <NumberField label="KL tổng" value={form.weight} onChange={(value) => onChange({ ...form, weight: value })} />
      <NumberField label="KL vàng" value={form.goldWeight} onChange={(value) => onChange({ ...form, goldWeight: value })} />
      <NumberField label="KL đá" value={form.stoneWeight} onChange={(value) => onChange({ ...form, stoneWeight: value })} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <NumberField label="Tiền công" value={form.laborCost} onChange={(value) => onChange({ ...form, laborCost: value })} />
      <NumberField label="Tiền đá" value={form.stoneCost} onChange={(value) => onChange({ ...form, stoneCost: value })} />
      <NumberField label="Tiền công gốc" value={form.baseLaborCost} onChange={(value) => onChange({ ...form, baseLaborCost: value })} />
      <NumberField label="Tiền đá gốc" value={form.baseStoneCost} onChange={(value) => onChange({ ...form, baseStoneCost: value })} />
      <NumberField label="Giá mua" value={form.purchasePrice} onChange={(value) => onChange({ ...form, purchasePrice: value })} />
      <NumberField label="Giá vốn" value={form.costPrice} onChange={(value) => onChange({ ...form, costPrice: value })} />
      <NumberField label="Giá bán" value={form.salePrice} onChange={(value) => onChange({ ...form, salePrice: value })} />
      <NumberField label="VAT %" value={form.vatRate} onChange={(value) => onChange({ ...form, vatRate: value })} />
    </div>
    <label className="h-9 px-3 rounded-lg bg-subtle-bg border border-border-main flex items-center gap-2 text-xs font-semibold text-text-secondary">
      <input type="checkbox" checked={Boolean(form.fixedPrice)} onChange={(e) => onChange({ ...form, fixedPrice: e.target.checked })} />
      <span>Sản phẩm áp giá cố định</span>
    </label>
  </FormShell>
)

const NumberField: React.FC<{ label: string; value: unknown; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <Field label={label}><input type="number" min="0" step="0.001" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={inputClass} /></Field>
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

const inputClass = 'w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand'

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-xs font-semibold text-text-secondary">
    <span>{label}</span>
    {children}
  </label>
)

export default ProductCatalogPage

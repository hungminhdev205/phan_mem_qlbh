import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  DismissRegular,
  EditRegular,
  SearchRegular,
  TagRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  createSupplier,
  createTagCategory,
  deleteSupplier,
  deleteTagCategory,
  getSuppliers,
  getTagCategories,
  type RecordStatus,
  type Supplier,
  type SupplierPayload,
  type TagCategory,
  type TagCategoryPayload,
  updateSupplier,
  updateTagCategory
} from './catalog.api'

type ActiveTab = 'tags' | 'suppliers'

interface TagSupplierPageProps {
  onClose: () => void
  initialTab?: ActiveTab
}

const emptyTagForm: TagCategoryPayload = {
  code: '',
  name: '',
  description: '',
  status: 'active'
}

const emptySupplierForm: SupplierPayload = {
  tagCategoryUuid: '',
  code: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  taxCode: '',
  status: 'active'
}

const statusLabel: Record<RecordStatus, string> = {
  active: 'Đang dùng',
  inactive: 'Tạm ngưng',
  deleted: 'Đã xóa'
}

export const TagSupplierPage: React.FC<TagSupplierPageProps> = ({ onClose, initialTab }) => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'tags')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [editingTag, setEditingTag] = useState<TagCategory | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [tagForm, setTagForm] = useState<TagCategoryPayload>(emptyTagForm)
  const [supplierForm, setSupplierForm] = useState<SupplierPayload>(emptySupplierForm)

  const activeTags = useMemo(
    () => tagCategories.filter((tag) => tag.status !== 'deleted'),
    [tagCategories]
  )

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const [tags, supplierRows] = await Promise.all([
        getTagCategories(token, activeTab === 'tags' ? keyword : ''),
        getSuppliers(token, activeTab === 'suppliers' ? keyword : '')
      ])
      setTagCategories(tags)
      setSuppliers(supplierRows)
      if (!supplierForm.tagCategoryUuid && tags[0]) {
        setSupplierForm((current) => ({ ...current, tagCategoryUuid: tags[0].uuid }))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được dữ liệu'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, keyword, supplierForm.tagCategoryUuid, token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetTagForm = (): void => {
    setEditingTag(null)
    setTagForm(emptyTagForm)
  }

  const resetSupplierForm = (): void => {
    setEditingSupplier(null)
    setSupplierForm({ ...emptySupplierForm, tagCategoryUuid: activeTags[0]?.uuid || '' })
  }

  const submitTag = async (): Promise<void> => {
    if (!token) return
    try {
      if (editingTag) {
        await updateTagCategory(token, editingTag.uuid, tagForm)
        toast.success('Đã cập nhật loại tem.')
      } else {
        await createTagCategory(token, tagForm)
        toast.success('Đã thêm loại tem mới.')
      }
      resetTagForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được loại tem'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const submitSupplier = async (): Promise<void> => {
    if (!token) return
    try {
      if (editingSupplier) {
        await updateSupplier(token, editingSupplier.uuid, supplierForm)
        toast.success('Đã cập nhật nhà cung cấp.')
      } else {
        await createSupplier(token, supplierForm)
        toast.success('Đã thêm nhà cung cấp mới.')
      }
      resetSupplierForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được nhà cung cấp'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const startEditTag = (tag: TagCategory): void => {
    setActiveTab('tags')
    setEditingTag(tag)
    setTagForm({
      code: tag.code,
      name: tag.name,
      description: tag.description || '',
      status: tag.status
    })
  }

  const startEditSupplier = (supplier: Supplier): void => {
    setActiveTab('suppliers')
    setEditingSupplier(supplier)
    setSupplierForm({
      tagCategoryUuid: supplier.tagCategory.uuid,
      code: supplier.code,
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      taxCode: supplier.taxCode || '',
      status: supplier.status
    })
  }

  const removeTag = async (tag: TagCategory): Promise<void> => {
    if (!token) return
    await deleteTagCategory(token, tag.uuid)
    toast.info('Đã ngưng dùng loại tem.')
    await loadData()
  }

  const removeSupplier = async (supplier: Supplier): Promise<void> => {
    if (!token) return
    await deleteSupplier(token, supplier.uuid)
    toast.info('Đã ngưng dùng nhà cung cấp.')
    await loadData()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Danh mục</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Danh mục tem & nhà cung cấp</h2>
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
            title="Đóng"
            aria-label="Đóng"
          >
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      <div className="h-11 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'tags' as const, label: 'Loại tem' },
            { id: 'suppliers' as const, label: 'Nhà cung cấp' }
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
            placeholder="Tìm theo mã, tên, loại tem..."
            className="w-full h-8 pl-9 pr-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[1fr_340px] gap-4 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0">
          {activeTab === 'tags' ? (
            <TagTable rows={tagCategories} isLoading={isLoading} onEdit={startEditTag} onDelete={removeTag} />
          ) : (
            <SupplierTable
              rows={suppliers}
              isLoading={isLoading}
              onEdit={startEditSupplier}
              onDelete={removeSupplier}
            />
          )}
        </section>

        <aside className="bg-card-bg border border-border-main rounded-xl p-4 overflow-y-auto">
          {activeTab === 'tags' ? (
            <TagForm
              form={tagForm}
              editing={editingTag}
              onChange={setTagForm}
              onCancel={resetTagForm}
              onSubmit={submitTag}
            />
          ) : (
            <SupplierForm
              form={supplierForm}
              tagCategories={activeTags}
              editing={editingSupplier}
              onChange={setSupplierForm}
              onCancel={resetSupplierForm}
              onSubmit={submitSupplier}
            />
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

const TagTable: React.FC<TableProps<TagCategory>> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell
    columns={['Mã loại tem', 'Tên loại tem', 'Mô tả', 'Trạng thái', '']}
    isLoading={isLoading}
    emptyText="Chưa có loại tem nào."
  >
    {rows.map((tag) => (
      <tr key={tag.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{tag.code}</td>
        <td className="py-3 px-4 font-semibold text-text-primary">{tag.name}</td>
        <td className="py-3 px-4 text-text-secondary">{tag.description || '-'}</td>
        <td className="py-3 px-4">
          <StatusPill status={tag.status} />
        </td>
        <RowActions onEdit={() => onEdit(tag)} onDelete={() => void onDelete(tag)} />
      </tr>
    ))}
  </TableShell>
)

const SupplierTable: React.FC<TableProps<Supplier>> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell
    columns={['Mã NCC', 'Tên nhà cung cấp', 'Loại tem', 'Liên hệ', 'MST', 'Trạng thái', '']}
    isLoading={isLoading}
    emptyText="Chưa có nhà cung cấp nào."
  >
    {rows.map((supplier) => (
      <tr key={supplier.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{supplier.code}</td>
        <td className="py-3 px-4 font-semibold text-text-primary">{supplier.name}</td>
        <td className="py-3 px-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-subtle-bg text-xs text-text-primary border border-border-main">
            <TagRegular className="text-sm text-brand" />
            {supplier.tagCategory.name}
          </span>
        </td>
        <td className="py-3 px-4 text-text-secondary">
          <div>{supplier.phone || '-'}</div>
          <div className="text-[11px] text-text-tertiary">{supplier.email || ''}</div>
        </td>
        <td className="py-3 px-4 font-mono text-text-secondary">{supplier.taxCode || '-'}</td>
        <td className="py-3 px-4">
          <StatusPill status={supplier.status} />
        </td>
        <RowActions onEdit={() => onEdit(supplier)} onDelete={() => void onDelete(supplier)} />
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
          <tr>
            {columns.map((column) => (
              <th key={column || 'actions'} className="py-2.5 px-4 whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">{children}</tbody>
      </table>
    </div>
    <div className="h-10 bg-subtle-bg border-t border-border-main px-4 flex items-center justify-between text-xs text-text-secondary shrink-0">
      <span>{isLoading ? 'Đang tải dữ liệu...' : emptyText}</span>
    </div>
  </>
)

const StatusPill: React.FC<{ status: RecordStatus }> = ({ status }) => (
  <span
    className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
      status === 'active'
        ? 'bg-status-online-bg text-status-online-text border-status-online-border'
        : 'bg-status-checking-bg text-status-checking-text border-status-checking-border'
    }`}
  >
    {statusLabel[status]}
  </span>
)

interface RowActionsProps {
  onEdit: () => void
  onDelete: () => void
}

const RowActions: React.FC<RowActionsProps> = ({ onEdit, onDelete }) => (
  <td className="py-2 px-4 text-right">
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-brand hover:bg-subtle-bg flex items-center justify-center"
        title="Sửa"
      >
        <EditRegular className="text-sm" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg flex items-center justify-center"
        title="Ngưng dùng"
      >
        <DeleteRegular className="text-sm" />
      </button>
    </div>
  </td>
)

interface TagFormProps {
  form: TagCategoryPayload
  editing: TagCategory | null
  onChange: (form: TagCategoryPayload) => void
  onCancel: () => void
  onSubmit: () => Promise<void>
}

const TagForm: React.FC<TagFormProps> = ({ form, editing, onChange, onCancel, onSubmit }) => (
  <FormShell title={editing ? 'Sửa loại tem' : 'Thêm loại tem'} onCancel={onCancel} onSubmit={onSubmit}>
    <Field label="Mã loại tem">
      <input value={form.code} onChange={(e) => onChange({ ...form, code: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Tên loại tem">
      <input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Mô tả">
      <textarea
        value={form.description || ''}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        className={`${inputClass} h-20 resize-none py-2`}
      />
    </Field>
  </FormShell>
)

interface SupplierFormProps {
  form: SupplierPayload
  tagCategories: TagCategory[]
  editing: Supplier | null
  onChange: (form: SupplierPayload) => void
  onCancel: () => void
  onSubmit: () => Promise<void>
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  form,
  tagCategories,
  editing,
  onChange,
  onCancel,
  onSubmit
}) => (
  <FormShell title={editing ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'} onCancel={onCancel} onSubmit={onSubmit}>
    <Field label="Loại tem">
      <select
        value={form.tagCategoryUuid}
        onChange={(e) => onChange({ ...form, tagCategoryUuid: e.target.value })}
        className={inputClass}
      >
        <option value="">Chọn loại tem</option>
        {tagCategories.map((tag) => (
          <option key={tag.uuid} value={tag.uuid}>
            {tag.name}
          </option>
        ))}
      </select>
    </Field>
    <Field label="Mã nhà cung cấp">
      <input value={form.code} onChange={(e) => onChange({ ...form, code: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Tên nhà cung cấp">
      <input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Số điện thoại">
      <input value={form.phone || ''} onChange={(e) => onChange({ ...form, phone: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Email">
      <input value={form.email || ''} onChange={(e) => onChange({ ...form, email: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Mã số thuế">
      <input value={form.taxCode || ''} onChange={(e) => onChange({ ...form, taxCode: e.target.value })} className={inputClass} />
    </Field>
    <Field label="Địa chỉ">
      <textarea
        value={form.address || ''}
        onChange={(e) => onChange({ ...form, address: e.target.value })}
        className={`${inputClass} h-20 resize-none py-2`}
      />
    </Field>
  </FormShell>
)

interface FormShellProps {
  title: string
  children: React.ReactNode
  onCancel: () => void
  onSubmit: () => Promise<void>
}

const FormShell: React.FC<FormShellProps> = ({ title, children, onCancel, onSubmit }) => (
  <form
    className="flex flex-col gap-3"
    onSubmit={(event) => {
      event.preventDefault()
      void onSubmit()
    }}
  >
    <h3 className="text-sm font-bold text-text-primary">{title}</h3>
    {children}
    <div className="flex items-center justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-8 px-3 rounded-lg border border-border-main text-xs font-semibold text-text-secondary hover:bg-subtle-bg"
      >
        Hủy
      </button>
      <button
        type="submit"
        className="h-8 px-3 rounded-lg bg-brand text-text-inverse text-xs font-semibold hover:bg-brand-hover flex items-center gap-1.5"
      >
        <AddRegular className="text-sm" />
        <span>Lưu</span>
      </button>
    </div>
  </form>
)

const inputClass =
  'w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand'

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-xs font-semibold text-text-secondary">
    <span>{label}</span>
    {children}
  </label>
)

export default TagSupplierPage

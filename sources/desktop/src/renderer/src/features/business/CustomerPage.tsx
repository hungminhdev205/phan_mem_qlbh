import React, { useCallback, useEffect, useState } from 'react'
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
  createCustomer,
  deleteCustomer,
  getCustomers,
  type Customer,
  type CustomerPayload,
  type RecordStatus,
  updateCustomer
} from './catalog.api'

interface CustomerPageProps {
  onClose: () => void
}

const emptyForm: CustomerPayload = {
  code: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  rankName: '',
  debtAmount: 0,
  status: 'active'
}

const statusLabel: Record<RecordStatus, string> = {
  active: 'Đang dùng',
  inactive: 'Tạm ngưng',
  deleted: 'Đã xóa'
}

const money = new Intl.NumberFormat('vi-VN')

export const CustomerPage: React.FC<CustomerPageProps> = ({ onClose }) => {
  const { token } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<CustomerPayload>(emptyForm)

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      setCustomers(await getCustomers(token, keyword))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được khách hàng'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [keyword, token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetForm = (): void => {
    setEditing(null)
    setForm(emptyForm)
  }

  const submit = async (): Promise<void> => {
    if (!token) return
    const payload = { ...form, debtAmount: Number(form.debtAmount || 0) }
    try {
      if (editing) {
        await updateCustomer(token, editing.uuid, payload)
        toast.success('Đã cập nhật khách hàng.')
      } else {
        await createCustomer(token, payload)
        toast.success('Đã thêm khách hàng mới.')
      }
      resetForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được khách hàng'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const startEdit = (customer: Customer): void => {
    setEditing(customer)
    setForm({
      code: customer.code,
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      rankName: customer.rankName || '',
      debtAmount: customer.debtAmount || 0,
      status: customer.status
    })
  }

  const remove = async (customer: Customer): Promise<void> => {
    if (!token) return
    await deleteCustomer(token, customer.uuid)
    toast.info('Đã ngưng dùng khách hàng.')
    await loadData()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Danh mục</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Quản lý khách hàng</h2>
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

      <div className="h-11 bg-card-bg border-b border-border-main px-4 flex items-center justify-end shrink-0">
        <div className="w-80 relative flex items-center">
          <SearchRegular className="absolute left-3 text-base text-text-tertiary" />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm mã, tên, số điện thoại..." className="w-full h-8 pl-9 pr-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand" />
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[1fr_340px] gap-4 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-medium sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-4">Mã KH</th>
                  <th className="py-2.5 px-4">Tên khách hàng</th>
                  <th className="py-2.5 px-4">Liên hệ</th>
                  <th className="py-2.5 px-4">Hạng</th>
                  <th className="py-2.5 px-4 text-right">Công nợ</th>
                  <th className="py-2.5 px-4">Trạng thái</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {customers.map((customer) => (
                  <tr key={customer.uuid} className="hover:bg-subtle-bg/70">
                    <td className="py-3 px-4 font-mono font-bold text-brand">{customer.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text-primary">{customer.name}</div>
                      <div className="text-[11px] text-text-tertiary">{customer.address || ''}</div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      <div>{customer.phone || '-'}</div>
                      <div className="text-[11px] text-text-tertiary">{customer.email || ''}</div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{customer.rankName || '-'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-brand">{money.format(customer.debtAmount || 0)} đ</td>
                    <td className="py-3 px-4"><StatusPill status={customer.status} /></td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => startEdit(customer)} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-brand hover:bg-subtle-bg flex items-center justify-center" title="Sửa">
                          <EditRegular className="text-sm" />
                        </button>
                        <button type="button" onClick={() => void remove(customer)} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg flex items-center justify-center" title="Ngưng dùng">
                          <DeleteRegular className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-10 bg-subtle-bg border-t border-border-main px-4 flex items-center text-xs text-text-secondary shrink-0">
            {isLoading ? 'Đang tải dữ liệu...' : 'Danh sách khách hàng'}
          </div>
        </section>

        <aside className="bg-card-bg border border-border-main rounded-xl p-4 overflow-y-auto">
          <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); void submit() }}>
            <h3 className="text-sm font-bold text-text-primary">{editing ? 'Sửa khách hàng' : 'Thêm khách hàng'}</h3>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Mã KH"><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputClass} /></Field>
              <Field label="Hạng"><input value={form.rankName || ''} onChange={(e) => setForm({ ...form, rankName: e.target.value })} className={inputClass} /></Field>
            </div>
            <Field label="Tên khách hàng"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></Field>
            <Field label="Số điện thoại"><input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></Field>
            <Field label="Email"><input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></Field>
            <Field label="Công nợ"><input type="number" min="0" value={String(form.debtAmount ?? 0)} onChange={(e) => setForm({ ...form, debtAmount: e.target.value })} className={inputClass} /></Field>
            <Field label="Địa chỉ"><textarea value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${inputClass} h-20 resize-none py-2`} /></Field>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={resetForm} className="h-8 px-3 rounded-lg border border-border-main text-xs font-semibold text-text-secondary hover:bg-subtle-bg">Hủy</button>
              <button type="submit" className="h-8 px-3 rounded-lg bg-brand text-text-inverse text-xs font-semibold hover:bg-brand-hover flex items-center gap-1.5"><AddRegular className="text-sm" /><span>Lưu</span></button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  )
}

const StatusPill: React.FC<{ status: RecordStatus }> = ({ status }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
    status === 'active'
      ? 'bg-status-online-bg text-status-online-text border-status-online-border'
      : 'bg-status-checking-bg text-status-checking-text border-status-checking-border'
  }`}>
    {statusLabel[status]}
  </span>
)

const inputClass = 'w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand'

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-xs font-semibold text-text-secondary">
    <span>{label}</span>
    {children}
  </label>
)

export default CustomerPage

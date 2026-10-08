import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  DismissRegular,
  EditRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  createCashBookEntry,
  deleteCashBookEntry,
  getCashBookEntries,
  type CashBookEntry,
  type CashBookEntryPayload,
  updateCashBookEntry
} from './catalog.api'

interface CashBookPageProps {
  onClose: () => void
  initialEntryType?: 'income' | 'expense'
}

const money = new Intl.NumberFormat('vi-VN')

const emptyForm: CashBookEntryPayload = {
  entryType: 'income',
  paymentMethod: 'cash',
  amount: 0,
  title: '',
  description: '',
  status: 'active'
}

export const CashBookPage: React.FC<CashBookPageProps> = ({ onClose, initialEntryType }) => {
  const { token } = useAuth()
  const [rows, setRows] = useState<CashBookEntry[]>([])
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(initialEntryType || 'all')
  const [editing, setEditing] = useState<CashBookEntry | null>(null)
  const [form, setForm] = useState<CashBookEntryPayload>({
    ...emptyForm,
    entryType: initialEntryType || 'income'
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialEntryType) {
      setFilterType(initialEntryType)
      setForm((prev) => ({ ...prev, entryType: initialEntryType }))
    }
  }, [initialEntryType])

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      setRows(await getCashBookEntries(token))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được sổ quỹ'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const totals = useMemo(() => {
    const income = rows.filter((row) => row.entryType === 'income').reduce((sum, row) => sum + Number(row.amount || 0), 0)
    const expense = rows.filter((row) => row.entryType === 'expense').reduce((sum, row) => sum + Number(row.amount || 0), 0)
    return { income, expense, balance: income - expense }
  }, [rows])

  const filteredRows = useMemo(() => {
    if (filterType === 'all') return rows
    return rows.filter((row) => row.entryType === filterType)
  }, [rows, filterType])

  const resetForm = (): void => {
    setEditing(null)
    setForm({
      ...emptyForm,
      entryType: initialEntryType || 'income'
    })
  }

  const submit = async (): Promise<void> => {
    if (!token) return
    const payload = { ...form, amount: Number(form.amount || 0) }
    try {
      if (editing) {
        await updateCashBookEntry(token, editing.uuid, payload)
        toast.success('Đã cập nhật phiếu thu chi.')
      } else {
        await createCashBookEntry(token, payload)
        toast.success('Đã thêm phiếu thu chi.')
      }
      resetForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được phiếu thu chi'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const startEdit = (entry: CashBookEntry): void => {
    setEditing(entry)
    setForm({
      entryType: entry.entryType,
      paymentMethod: entry.paymentMethod || 'cash',
      amount: entry.amount,
      title: entry.title,
      description: entry.description || '',
      occurredAt: entry.occurredAt,
      status: entry.status
    })
  }

  const remove = async (entry: CashBookEntry): Promise<void> => {
    if (!token) return
    await deleteCashBookEntry(token, entry.uuid)
    toast.info('Đã xóa phiếu khỏi sổ quỹ.')
    await loadData()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Thu chi</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Sổ quỹ tiền mặt & ngân hàng</h2>
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

      <div className="h-16 bg-card-bg border-b border-border-main px-4 grid grid-cols-3 gap-3 items-center shrink-0">
        <Metric label="Tổng thu" value={`${money.format(totals.income)} đ`} tone="income" />
        <Metric label="Tổng chi" value={`${money.format(totals.expense)} đ`} tone="expense" />
        <Metric label="Chênh lệch" value={`${money.format(totals.balance)} đ`} tone="balance" />
      </div>

      <div className="h-11 bg-card-bg border-b border-border-main px-4 flex items-center shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'all' as const, label: 'Tất cả' },
            { id: 'income' as const, label: 'Thu tiền' },
            { id: 'expense' as const, label: 'Chi tiền' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${
                filterType === tab.id ? 'bg-brand text-text-inverse' : 'text-text-secondary hover:bg-subtle-bg hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[1fr_350px] gap-4 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-subtle-bg text-text-secondary font-medium sticky top-0 border-b border-border-main z-10">
                <tr>
                  <th className="py-2.5 px-4">Mã phiếu</th>
                  <th className="py-2.5 px-4">Nội dung</th>
                  <th className="py-2.5 px-4">Loại</th>
                  <th className="py-2.5 px-4">Phương thức</th>
                  <th className="py-2.5 px-4 text-right">Số tiền</th>
                  <th className="py-2.5 px-4">Ngày</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredRows.map((row) => (
                  <tr key={row.uuid} className="hover:bg-subtle-bg/70">
                    <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text-primary">{row.title}</div>
                      <div className="text-[11px] text-text-tertiary">{row.description || ''}</div>
                    </td>
                    <td className="py-3 px-4"><TypePill type={row.entryType} /></td>
                    <td className="py-3 px-4 text-text-secondary">{paymentLabel(row.paymentMethod)}</td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${row.entryType === 'income' ? 'text-status-online-text' : 'text-status-offline'}`}>{money.format(Number(row.amount || 0))} đ</td>
                    <td className="py-3 px-4 text-text-secondary">{formatDate(row.occurredAt)}</td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => startEdit(row)} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-brand hover:bg-subtle-bg flex items-center justify-center" title="Sửa">
                          <EditRegular className="text-sm" />
                        </button>
                        <button type="button" onClick={() => void remove(row)} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg flex items-center justify-center" title="Xóa">
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
            {isLoading ? 'Đang tải dữ liệu...' : 'Sổ quỹ thu chi'}
          </div>
        </section>

        <aside className="bg-card-bg border border-border-main rounded-xl p-4 overflow-y-auto">
          <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); void submit() }}>
            <h3 className="text-sm font-bold text-text-primary">{editing ? 'Sửa phiếu' : 'Thêm phiếu thu/chi'}</h3>
            <Field label="Loại phiếu">
              <select value={form.entryType} onChange={(event) => setForm({ ...form, entryType: event.target.value as CashBookEntryPayload['entryType'] })} className={inputClass}>
                <option value="income">Phiếu thu</option>
                <option value="expense">Phiếu chi</option>
              </select>
            </Field>
            <Field label="Nội dung"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Số tiền"><input type="number" min="0" step="1000" value={String(form.amount ?? 0)} onChange={(event) => setForm({ ...form, amount: event.target.value })} className={inputClass} /></Field>
              <Field label="Phương thức">
                <select value={form.paymentMethod || 'cash'} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} className={inputClass}>
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                  <option value="card">Thẻ</option>
                </select>
              </Field>
            </div>
            <Field label="Ghi chú"><textarea value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${inputClass} h-24 resize-none py-2`} /></Field>
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

const Metric: React.FC<{ label: string; value: string; tone: 'income' | 'expense' | 'balance' }> = ({ label, value, tone }) => (
  <div className="h-10 px-3 rounded-lg bg-subtle-bg border border-border-subtle flex flex-col justify-center">
    <span className="text-[10px] uppercase font-semibold text-text-tertiary">{label}</span>
    <strong className={`text-sm font-mono ${tone === 'expense' ? 'text-status-offline' : tone === 'income' ? 'text-status-online-text' : 'text-text-primary'}`}>{value}</strong>
  </div>
)

const TypePill: React.FC<{ type: string }> = ({ type }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${type === 'income' ? 'bg-status-online-bg text-status-online-text border-status-online-border' : 'bg-status-offline-bg text-status-offline border-status-offline-border'}`}>
    {type === 'income' ? 'Thu' : 'Chi'}
  </span>
)

const inputClass = 'w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand'

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-xs font-semibold text-text-secondary">
    <span>{label}</span>
    {children}
  </label>
)

function paymentLabel(value?: string | null): string {
  if (value === 'cash') return 'Tiền mặt'
  if (value === 'transfer') return 'Chuyển khoản'
  if (value === 'card') return 'Thẻ'
  return 'Khác'
}

function formatDate(value?: string): string {
  if (!value) return ''
  return new Date(value).toLocaleString('vi-VN')
}

export default CashBookPage

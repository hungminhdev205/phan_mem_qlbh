import React, { useCallback, useEffect, useState } from 'react'
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
  createStaffEmployee,
  deleteStaffEmployee,
  getStaffEmployees,
  getStaffPermissions,
  getStaffRoles,
  type RecordStatus,
  type StaffEmployee,
  type StaffEmployeePayload,
  type StaffPermission,
  type StaffRole,
  updateStaffEmployee
} from './catalog.api'

type ActiveTab = 'employees' | 'roles' | 'permissions'

interface StaffAdminPageProps {
  onClose: () => void
  initialTab?: ActiveTab
}

const emptyForm: StaffEmployeePayload = {
  employeeCode: '',
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  positionName: '',
  roleUuid: '',
  status: 'active'
}

const statusLabel: Record<RecordStatus, string> = {
  active: 'Đang làm',
  inactive: 'Tạm ngưng',
  deleted: 'Đã nghỉ'
}

export const StaffAdminPage: React.FC<StaffAdminPageProps> = ({ onClose, initialTab }) => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'employees')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [employees, setEmployees] = useState<StaffEmployee[]>([])
  const [roles, setRoles] = useState<StaffRole[]>([])
  const [permissions, setPermissions] = useState<StaffPermission[]>([])
  const [editing, setEditing] = useState<StaffEmployee | null>(null)
  const [form, setForm] = useState<StaffEmployeePayload>(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const [employeeRows, roleRows, permissionRows] = await Promise.all([
        getStaffEmployees(token),
        getStaffRoles(token),
        getStaffPermissions(token)
      ])
      setEmployees(employeeRows)
      setRoles(roleRows)
      setPermissions(permissionRows)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được dữ liệu nhân viên'
      toast.error(message, { title: 'Lỗi dữ liệu' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetForm = (): void => {
    setEditing(null)
    setForm(emptyForm)
  }

  const submit = async (): Promise<void> => {
    if (!token) return
    const payload = { ...form, roleUuid: form.roleUuid || null }
    try {
      if (editing) {
        await updateStaffEmployee(token, editing.uuid, payload)
        toast.success('Đã cập nhật nhân viên.')
      } else {
        await createStaffEmployee(token, payload)
        toast.success('Đã thêm nhân viên. Mật khẩu mặc định là 123456 nếu bỏ trống.')
      }
      resetForm()
      await loadData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không lưu được nhân viên'
      toast.error(message, { title: 'Lỗi lưu dữ liệu' })
    }
  }

  const startEdit = (employee: StaffEmployee): void => {
    setActiveTab('employees')
    setEditing(employee)
    setForm({
      employeeCode: employee.employeeCode,
      username: employee.username,
      password: '',
      fullName: employee.fullName,
      email: employee.email || '',
      phone: employee.phone || '',
      positionName: employee.positionName || '',
      roleUuid: employee.role?.uuid || '',
      status: employee.status
    })
  }

  const remove = async (employee: StaffEmployee): Promise<void> => {
    if (!token) return
    await deleteStaffEmployee(token, employee.uuid)
    toast.info('Đã ngưng dùng nhân viên.')
    await loadData()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg overflow-hidden animate-toast-in">
      <header className="h-12 bg-card-bg border-b border-border-main px-5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-brand uppercase">Quản trị</span>
          <span className="text-text-tertiary text-xs">•</span>
          <h2 className="text-sm font-bold text-text-primary">Nhân viên & phân quyền</h2>
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
            { id: 'employees' as const, label: 'Nhân viên' },
            { id: 'roles' as const, label: 'Vai trò' },
            { id: 'permissions' as const, label: 'Quyền' }
          ].map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${activeTab === tab.id ? 'bg-brand text-text-inverse' : 'text-text-secondary hover:bg-subtle-bg hover:text-text-primary'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[1fr_350px] gap-4 overflow-hidden">
        <section className="bg-card-bg border border-border-main rounded-xl overflow-hidden flex flex-col min-w-0">
          {activeTab === 'employees' ? (
            <EmployeeTable rows={employees} isLoading={isLoading} onEdit={startEdit} onDelete={remove} />
          ) : activeTab === 'roles' ? (
            <RoleTable rows={roles} isLoading={isLoading} />
          ) : (
            <PermissionTable rows={permissions} isLoading={isLoading} />
          )}
        </section>

        <aside className="bg-card-bg border border-border-main rounded-xl p-4 overflow-y-auto">
          <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); void submit() }}>
            <h3 className="text-sm font-bold text-text-primary">{editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h3>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Mã NV"><input value={form.employeeCode} onChange={(event) => setForm({ ...form, employeeCode: event.target.value })} className={inputClass} /></Field>
              <Field label="Chức vụ"><input value={form.positionName || ''} onChange={(event) => setForm({ ...form, positionName: event.target.value })} className={inputClass} /></Field>
            </div>
            <Field label="Họ tên"><input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className={inputClass} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tên đăng nhập"><input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className={inputClass} /></Field>
              <Field label="Mật khẩu"><input type="password" value={form.password || ''} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={editing ? 'Để trống nếu không đổi' : 'Mặc định 123456'} className={inputClass} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Email"><input value={form.email || ''} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} /></Field>
              <Field label="SĐT"><input value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass} /></Field>
            </div>
            <Field label="Vai trò"><select value={form.roleUuid || ''} onChange={(event) => setForm({ ...form, roleUuid: event.target.value })} className={inputClass}><option value="">Chưa gán</option>{roles.map((role) => <option key={role.uuid} value={role.uuid}>{role.name}</option>)}</select></Field>
            <Field label="Trạng thái"><select value={form.status || 'active'} onChange={(event) => setForm({ ...form, status: event.target.value as RecordStatus })} className={inputClass}><option value="active">Đang làm</option><option value="inactive">Tạm ngưng</option></select></Field>
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

const EmployeeTable: React.FC<{ rows: StaffEmployee[]; isLoading: boolean; onEdit: (row: StaffEmployee) => void; onDelete: (row: StaffEmployee) => Promise<void> }> = ({ rows, isLoading, onEdit, onDelete }) => (
  <TableShell columns={['Mã NV', 'Nhân viên', 'Tài khoản', 'Chức vụ', 'Vai trò', 'Trạng thái', '']} isLoading={isLoading} emptyText="Danh sách nhân viên">
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.employeeCode}</td>
        <td className="py-3 px-4"><div className="font-semibold text-text-primary">{row.fullName}</div><div className="text-[11px] text-text-tertiary">{row.phone || row.email || ''}</div></td>
        <td className="py-3 px-4 font-mono text-text-secondary">{row.username}</td>
        <td className="py-3 px-4 text-text-secondary">{row.positionName || '-'}</td>
        <td className="py-3 px-4 text-text-secondary">{row.role?.name || '-'}</td>
        <td className="py-3 px-4"><StatusPill status={row.status} /></td>
        <td className="py-2 px-4 text-right"><RowActions onEdit={() => onEdit(row)} onDelete={() => void onDelete(row)} /></td>
      </tr>
    ))}
  </TableShell>
)

const RoleTable: React.FC<{ rows: StaffRole[]; isLoading: boolean }> = ({ rows, isLoading }) => (
  <TableShell columns={['Mã vai trò', 'Tên vai trò', 'Mô tả', 'Trạng thái']} isLoading={isLoading} emptyText="Danh sách vai trò">
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
        <td className="py-3 px-4 font-semibold text-text-primary">{row.name}</td>
        <td className="py-3 px-4 text-text-secondary">{row.description || '-'}</td>
        <td className="py-3 px-4"><StatusPill status={row.status} /></td>
      </tr>
    ))}
  </TableShell>
)

const PermissionTable: React.FC<{ rows: StaffPermission[]; isLoading: boolean }> = ({ rows, isLoading }) => (
  <TableShell columns={['Mã quyền', 'Tên quyền', 'Phạm vi', 'Mô tả']} isLoading={isLoading} emptyText="Danh sách quyền chức năng">
    {rows.map((row) => (
      <tr key={row.uuid} className="hover:bg-subtle-bg/70">
        <td className="py-3 px-4 font-mono font-bold text-brand">{row.code}</td>
        <td className="py-3 px-4 font-semibold text-text-primary">{row.name}</td>
        <td className="py-3 px-4 text-text-secondary">{row.scope || '-'}</td>
        <td className="py-3 px-4 text-text-secondary">{row.description || '-'}</td>
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

const RowActions: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-1">
    <button type="button" onClick={onEdit} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-brand hover:bg-subtle-bg flex items-center justify-center" title="Sửa"><EditRegular className="text-sm" /></button>
    <button type="button" onClick={onDelete} className="h-7 w-7 rounded-lg border border-border-main text-text-secondary hover:text-status-offline hover:bg-status-offline-bg flex items-center justify-center" title="Ngưng dùng"><DeleteRegular className="text-sm" /></button>
  </div>
)

const StatusPill: React.FC<{ status: RecordStatus }> = ({ status }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status === 'active' ? 'bg-status-online-bg text-status-online-text border-status-online-border' : 'bg-status-checking-bg text-status-checking-text border-status-checking-border'}`}>
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

export default StaffAdminPage

import React, { useCallback, useEffect, useState } from 'react'
import {
  DismissRegular,
  SaveRegular,
  BuildingShopRegular,
  ArrowClockwiseRegular,
  PhoneRegular,
  LocationRegular,
  DocumentTextRegular
} from '@fluentui/react-icons'
import { toast } from '@renderer/components/toast'
import { useAuth } from '../auth/libs/useAuth'
import {
  getCompanies,
  updateCompany,
  createCompany,
  type CompanyPayload
} from './catalog.api'

interface CompanySettingsPageProps {
  onClose: () => void
}

const emptyForm: CompanyPayload = {
  name: 'DNTN KINH DOANH VÀNG BẠC KIM NGÂN',
  address: '56 Hàng Bạc, Q. Hoàn Kiếm, TP. Hà Nội',
  phone: '0386 884 915',
  email: 'kimngan@gmail.com',
  taxCode: '038688491522',
  status: 'active'
}

export const CompanySettingsPage: React.FC<CompanySettingsPageProps> = ({ onClose }) => {
  const { token } = useAuth()
  const [form, setForm] = useState<CompanyPayload>(emptyForm)
  const [companyUuid, setCompanyUuid] = useState<string | null>(null)
  const [receiptFooter, setReceiptFooter] = useState(
    'Cảm ơn quý khách! Vàng đã mua vui lòng giữ hóa đơn để đổi trả trong 3 ngày.'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    try {
      const companies = await getCompanies(token)
      if (companies.length > 0) {
        const c = companies[0]
        setCompanyUuid(c.uuid)
        setForm({
          name: c.name || emptyForm.name,
          address: c.address || emptyForm.address,
          phone: c.phone || emptyForm.phone,
          email: c.email || emptyForm.email,
          taxCode: c.taxCode || emptyForm.taxCode,
          status: c.status || 'active'
        })
      }
      const savedFooter = localStorage.getItem('qlbh_receipt_footer')
      if (savedFooter) setReceiptFooter(savedFooter)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không tải được thông tin tiệm vàng'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token) return
    if (!form.name.trim() || !form.taxCode.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên tiệm vàng và mã số thuế.')
      return
    }

    setIsSaving(true)
    try {
      if (companyUuid) {
        await updateCompany(token, companyUuid, form)
      } else {
        const created = await createCompany(token, form)
        setCompanyUuid(created.uuid)
      }
      localStorage.setItem('qlbh_receipt_footer', receiptFooter)
      toast.success('Đã lưu thông tin tiệm vàng thành công!')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Lỗi lưu thông tin tiệm vàng'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg select-none overflow-hidden animate-toast-in">
      {/* 1. Header */}
      <header className="h-12 bg-card-bg border-b border-border-main px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            <BuildingShopRegular className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-brand uppercase">Hệ thống</span>
              <span className="text-text-tertiary text-xs">•</span>
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                Thông tin tiệm vàng & Cấu hình cửa hàng
              </h2>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Thông tin hiển thị trên tiêu đề phần mềm, mẫu tem và hóa đơn bán lẻ
            </p>
          </div>
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
            title="Đóng trang"
          >
            <DismissRegular className="text-base" />
          </button>
        </div>
      </header>

      {/* 2. Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Box 1: Xem trước biển hiệu tiệm vàng */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200">
                DOANH NGHIỆP KIM HOÀN
              </span>
              <h1 className="text-xl font-black mt-1 leading-tight tracking-wide uppercase">
                {form.name || 'TÊN TIỆM VÀNG'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-amber-100">
                <span className="flex items-center gap-1">
                  <LocationRegular className="text-sm" />
                  {form.address || 'Chưa cập nhật địa chỉ'}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <PhoneRegular className="text-sm" />
                  {form.phone || 'Chưa có SĐT'}
                </span>
                <span className="font-mono">MST: {form.taxCode || '---'}</span>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl text-amber-200 shrink-0">
              POS
            </div>
          </div>

          {/* Box 2: Form nhập liệu thông tin */}
          <div className="bg-card-bg rounded-xl border border-border-main p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide border-b border-border-main pb-2">
              Hồ sơ pháp nhân & Liên hệ
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                <span>Tên tiệm vàng / Tên doanh nghiệp:</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: DNTN KINH DOANH VÀNG BẠC KIM NGÂN"
                className="w-full h-10 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs font-bold text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                  <span>Mã số thuế (MST):</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.taxCode}
                  onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
                  placeholder="Mã số thuế doanh nghiệp..."
                  className="w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                  <span>Số điện thoại / Hotline tiệm:</span>
                </label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0386 884 915..."
                  className="w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Email liên hệ:</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="lienhe@tiemvang.vn..."
                  className="w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Địa chỉ tiệm:</label>
                <input
                  type="text"
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Địa chỉ quầy giao dịch..."
                  className="w-full h-9 px-3 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            {/* Ghi chú chân trang in hóa đơn */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                <DocumentTextRegular className="text-sm" />
                <span>Lời chào / Ghi chú chân trang in hóa đơn:</span>
              </label>
              <textarea
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-subtle-bg border border-border-main rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand resize-none"
              />
            </div>
          </div>

          {/* Nút Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-border-main text-xs font-semibold text-text-secondary hover:bg-subtle-bg cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-brand text-text-inverse text-xs font-bold hover:bg-brand-hover shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <SaveRegular className="text-base" />
              <span>{isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI CỬA HÀNG'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanySettingsPage

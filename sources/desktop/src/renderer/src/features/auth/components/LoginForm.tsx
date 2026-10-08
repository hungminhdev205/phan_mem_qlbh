import React, { useState } from 'react'
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons'
import { useAuth } from '../libs/useAuth'

export const LoginForm: React.FC = () => {
  const { login, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    setIsSubmitting(true)
    await login({ username: username.trim(), password }, remember)
    setIsSubmitting(false)
  }

  const isFormFilled = username.trim().length > 0 && password.trim().length > 0

  return (
    <div className="w-full max-w-[440px] bg-card-bg rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-border-subtle select-none">
      {/* Logo & Tiêu đề */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          Đăng nhập vào cửa hàng của bạn
        </h2>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="mb-4 p-3 bg-status-offline-bg border border-status-offline-border rounded-lg text-xs text-status-offline-text leading-relaxed font-medium text-left">
          {error}
        </div>
      )}

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Trường Tên đăng nhập / Số điện thoại */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Tên đăng nhập / Số điện thoại
          </label>
          <input
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập hoặc số điện thoại"
            className="w-full h-10 px-3.5 bg-card-bg border border-input-border hover:border-input-border-hover focus:border-brand rounded-lg text-sm text-text-primary placeholder:text-text-tertiary transition-colors outline-none"
          />
        </div>

        {/* Trường Mật khẩu */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">Mật khẩu</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full h-10 px-3.5 pr-10 bg-card-bg border border-input-border hover:border-input-border-hover focus:border-brand rounded-lg text-sm text-text-primary placeholder:text-text-tertiary transition-colors outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 text-text-tertiary hover:text-text-secondary cursor-pointer p-1 rounded transition-colors flex items-center"
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? (
                <EyeOffRegular className="text-base" />
              ) : (
                <EyeRegular className="text-base" />
              )}
            </button>
          </div>
        </div>

        {/* Hàng Ghi nhớ đăng nhập & Quên mật khẩu */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-text-secondary hover:text-text-primary transition-colors">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-input-border text-brand focus:outline-none cursor-pointer"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            className="text-xs text-brand hover:text-brand-hover hover:underline cursor-pointer font-medium"
            onClick={() => {}}
          >
            Quên mật khẩu
          </button>
        </div>

        {/* Nút Đăng nhập phong cách Sapo */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-10 px-4 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isFormFilled
                ? 'bg-brand hover:bg-brand-hover active:bg-brand-active text-text-inverse shadow-2xs'
                : 'bg-btn-disabled-bg hover:bg-btn-disabled-hover text-btn-disabled-text'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

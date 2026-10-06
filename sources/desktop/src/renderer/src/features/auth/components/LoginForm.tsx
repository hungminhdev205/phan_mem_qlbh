import { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

type LoginFormProps = {
  error: string
  isSubmitting: boolean
  password: string
  remember: boolean
  username: string
  onPasswordChange: (value: string) => void
  onRememberChange: (value: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onUsernameChange: (value: string) => void
}

export function LoginForm({
  error,
  isSubmitting,
  password,
  remember,
  username,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onUsernameChange
}: LoginFormProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <main
      className="grid min-h-[680px] min-w-[920px] select-none place-items-center bg-app-bg p-10 font-sans text-app-text"
      style={{
        background:
          'linear-gradient(135deg, var(--app-color-login-glow-cool), transparent 42%), linear-gradient(315deg, var(--app-color-login-glow-warm), transparent 36%), var(--app-color-bg)'
      }}
    >
      <section className="w-[calc(100vw-48px)] max-w-[420px] rounded-lg border border-app-border bg-app-surface p-8 shadow-[var(--app-shadow-panel)]">
        <div className="mb-[30px] flex items-center gap-4">
          <img className="h-14 w-14 object-contain" src="/src/assets/app/logo.png" alt="Logo" />
          <div>
            <p className="mb-1.5 text-xs font-bold tracking-normal text-app-muted uppercase">
              {t('appName')}
            </p>
            <h1 className="mb-0 text-[32px] leading-[1.1] font-bold">{t('auth.title')}</h1>
          </div>
        </div>

        <form className="grid gap-[18px]" onSubmit={onSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-app-label">
            {t('auth.username')}
            <input
              className="h-11 w-full rounded-lg border border-app-input-border bg-app-surface px-3 text-app-text outline-none focus:border-app-primary focus:shadow-[0_0_0_3px_var(--app-color-primary-ring)]"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-app-label">
            {t('auth.password')}
            <input
              className="h-11 w-full rounded-lg border border-app-input-border bg-app-surface px-3 text-app-text outline-none focus:border-app-primary focus:shadow-[0_0_0_3px_var(--app-color-primary-ring)]"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <label className="flex items-center gap-2.5 font-semibold text-app-label">
            <input
              className="h-[18px] w-[18px] accent-app-primary"
              checked={remember}
              onChange={(event) => onRememberChange(event.target.checked)}
              type="checkbox"
            />
            <span>{t('auth.rememberMe')}</span>
          </label>

          {error ? (
            <p className="m-0 rounded-lg border border-app-danger-border bg-app-danger-bg px-3 py-2.5 text-sm text-app-danger">
              {error}
            </p>
          ) : null}

          <button
            className="min-h-[42px] cursor-pointer rounded-lg border-0 bg-app-primary px-[18px] font-bold text-white disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
      </section>
    </main>
  )
}

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getDisplayValue } from '@renderer/libs/object'
import { AccountProfile } from '../auth/actions/types'

type OverviewPageProps = {
  error: string
  isLoadingProfile: boolean
  profile: AccountProfile | null
  onLogout: () => void
}

function OverviewPage({
  error,
  isLoadingProfile,
  profile,
  onLogout
}: OverviewPageProps): React.JSX.Element {
  const { t } = useTranslation()

  const displayName = useMemo(
    () =>
      getDisplayValue(profile, [
        'profile.fullName',
        'account.username',
        'fullName',
        'name',
        'employeeName',
        'username'
      ]),
    [profile]
  )
  const roleName = useMemo(
    () => getDisplayValue(profile, ['role.name', 'roleName', 'role', 'positionName', 'position']),
    [profile]
  )
  const email = useMemo(
    () => getDisplayValue(profile, ['profile.email', 'email', 'mail']),
    [profile]
  )

  return (
    <main className="min-h-[680px] min-w-[920px] select-none bg-app-dashboard-bg p-10 font-sans text-app-text">
      <section className="mb-7 flex items-center justify-between gap-6">
        <div>
          <p className="mb-1.5 text-xs font-bold tracking-normal text-app-muted uppercase">
            {t('appName')}
          </p>
          <h1 className="mb-0 text-[32px] leading-[1.1] font-bold">{t('auth.dashboard')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="min-h-[42px] cursor-pointer rounded-lg border border-app-input-border bg-app-surface px-[18px] font-bold text-app-label disabled:cursor-wait disabled:opacity-70"
            type="button"
            onClick={onLogout}
          >
            {t('auth.logout')}
          </button>
        </div>
      </section>

      {error ? (
        <p className="m-0 rounded-lg border border-app-danger-border bg-app-danger-bg px-3 py-2.5 text-sm text-app-danger">
          {error}
        </p>
      ) : null}

      <section className="mb-[18px] grid grid-cols-2 gap-[18px]">
        <article className="min-h-[150px] rounded-lg border border-app-border bg-app-surface p-6">
          <span className="mb-1.5 text-xs font-bold tracking-normal text-app-muted uppercase">
            {t('auth.account')}
          </span>
          {isLoadingProfile ? (
            <p className="mt-0 text-app-muted">{t('auth.loadingAccount')}</p>
          ) : (
            <>
              <h2 className="mt-0 mb-2.5 text-[22px] font-bold">
                {displayName || t('auth.userFallback')}
              </h2>
              <p className="mt-0 mb-2">{roleName || t('auth.noRole')}</p>
              <p className="mt-0 mb-2 text-app-muted">{email || t('auth.emailFallback')}</p>
            </>
          )}
        </article>

        <article className="min-h-[150px] rounded-lg border border-app-border bg-app-surface p-6">
          <span className="mb-1.5 text-xs font-bold tracking-normal text-app-muted uppercase">
            {t('auth.apiStatus')}
          </span>
          <h2 className="mt-0 mb-2.5 text-[22px] font-bold">{t('auth.connected')}</h2>
          <p className="mt-0 mb-2 text-app-muted">{t('auth.serverDataHint')}</p>
        </article>
      </section>

      <section className="rounded-lg border border-app-border bg-app-surface p-6">
        <div>
          <span className="mb-1.5 text-xs font-bold tracking-normal text-app-muted uppercase">
            {t('auth.getMeData')}
          </span>
          <h2 className="mt-0 mb-2.5 text-[22px] font-bold">{t('auth.profileTitle')}</h2>
        </div>
        <pre className="mt-[18px] max-h-[360px] select-text overflow-auto rounded-lg bg-app-code-bg p-[18px] text-[13px] leading-[1.6] text-app-code-text">
          {profile ? JSON.stringify(profile, null, 2) : '{}'}
        </pre>
      </section>
    </main>
  )
}

export default OverviewPage

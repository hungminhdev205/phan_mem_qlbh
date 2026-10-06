import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getMe, login } from './actions/auth.api'
import {
  clearSavedCredentials,
  clearToken,
  getSavedCredentials,
  getToken,
  saveCredentials,
  saveToken
} from './actions/auth.storage'
import { AccountProfile } from './actions/types'
import { LoginForm } from './components/LoginForm'
import OverviewPage from '../overview/page'

function AuthPage(): React.JSX.Element {
  const { t } = useTranslation()
  const [token, setToken] = useState(() => getToken())
  const savedCredentials = getSavedCredentials()
  const [username, setUsername] = useState(() => savedCredentials?.username ?? '')
  const [password, setPassword] = useState(() => savedCredentials?.password ?? '')
  const [remember, setRemember] = useState(() => savedCredentials?.remember ?? false)
  const [profile, setProfile] = useState<AccountProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skipAutoLogin, setSkipAutoLogin] = useState(false)
  const [error, setError] = useState('')

  const language = 'vi'
  const isLoadingProfile = Boolean(token && !profile)

  useEffect(() => {
    if (!token) {
      return
    }

    let ignore = false

    getMe(token, language)
      .then((data) => {
        if (!ignore) {
          setProfile(data)
        }
      })
      .catch((exception: Error) => {
        if (!ignore) {
          clearToken()
          setToken('')
          setProfile(null)
          setError(exception.message)
        }
      })

    return () => {
      ignore = true
    }
  }, [language, token])

  useEffect(() => {
    if (token || skipAutoLogin || !remember || !username || !password) {
      return
    }

    let ignore = false

    login({ username, password }, language)
      .then((nextToken) => {
        if (!ignore) {
          saveToken(nextToken)
          setToken(nextToken)
        }
      })
      .catch((exception: Error) => {
        if (!ignore) {
          clearToken()
          setError(exception.message)
        }
      })

    return () => {
      ignore = true
    }
  }, [language, password, remember, skipAutoLogin, token, username])

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const nextToken = await login({ username: username.trim(), password }, language)
      saveToken(nextToken)
      setSkipAutoLogin(false)
      if (remember) {
        saveCredentials({ username: username.trim(), password, remember })
      } else {
        clearSavedCredentials()
      }
      setProfile(null)
      setToken(nextToken)
      setPassword(remember ? password : '')
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : t('errors.loginFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleLogout(): void {
    clearToken()
    setToken('')
    setProfile(null)
    setSkipAutoLogin(true)
    setError('')
  }

  if (token) {
    return (
      <OverviewPage
        error={error}
        isLoadingProfile={isLoadingProfile}
        profile={profile}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <LoginForm
      error={error}
      isSubmitting={isSubmitting}
      password={password}
      remember={remember}
      username={username}
      onPasswordChange={setPassword}
      onRememberChange={setRemember}
      onSubmit={handleLogin}
      onUsernameChange={setUsername}
    />
  )
}

export default AuthPage

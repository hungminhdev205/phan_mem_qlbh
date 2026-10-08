import React from 'react'
import { LoginForm } from './components/LoginForm'
import { TitleBar } from '@renderer/components/window/TitleBar'

export const AuthPage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-app-bg select-none relative overflow-hidden">
      <TitleBar />

      <div className="flex-1 flex items-center justify-center p-6 -mt-6">
        <LoginForm />
      </div>
    </div>
  )
}

export default AuthPage

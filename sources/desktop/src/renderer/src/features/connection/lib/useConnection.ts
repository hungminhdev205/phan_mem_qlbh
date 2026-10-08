import { useContext } from 'react'
import { ConnectionContext } from './context'
import type { ConnectionState } from '../types'

export function useConnection(): ConnectionState {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider')
  }
  return context
}

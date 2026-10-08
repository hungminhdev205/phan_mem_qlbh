import { ElectronAPI } from '@electron-toolkit/preload'

export interface AppApi {
  minimize: () => void
  maximize: () => void
  close: () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppApi
  }
}

import React from 'react'
import { TitleBar, TitleBarProps } from '../window/TitleBar'

export const AppTitleBar: React.FC<TitleBarProps> = (props) => {
  return <TitleBar {...props} />
}

export default AppTitleBar

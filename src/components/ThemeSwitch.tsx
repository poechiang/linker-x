import { theme } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from '../hooks/useApp'

const { useToken } = theme

export default () => {
  const app = useApp()
  const [mouseInSwitcher, setMouseInSwitcher] = useState(false)
  const [checked, setChecked] = useState(app.theme === 'dark')
  const { token } = useToken()

  const toggleSwitchCheck = () => {
    setChecked(!checked)
    const currentTheme = !checked ? 'dark' : 'light'
    window.api?.theme.toggle(currentTheme)
  }

  const switchClassNames = ['switch-wrap']

  if (checked) {
    switchClassNames.push('checked')
  }

  const switcherStyle = {
    backgroundColor: checked
      ? token.colorPrimaryBg
      : mouseInSwitcher
      ? token.colorPrimaryBgHover
      : token.colorBgContainer,
    color: checked ? token.colorPrimaryActive : token.colorTextBase,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: token.colorBorder,
  }

  const themeUpdater = useCallback(({ theme }) => {
    setChecked(theme === 'dark')
  }, [])
  useEffect(() => {
    window.listeners.onThemeUpdated(themeUpdater)
    return () => {
      window.listeners.offThemeUpdated(themeUpdater)
    }
  }, [])
  return (
    <div className="theme-switch-wrap">
      <span
        className={switchClassNames.join(' ')}
        onMouseEnter={() => setMouseInSwitcher(true)}
        onMouseLeave={() => setMouseInSwitcher(false)}
        onClick={toggleSwitchCheck}
        style={switcherStyle}
      ></span>
    </div>
  )
}

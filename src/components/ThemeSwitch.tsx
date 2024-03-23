import { useApp } from '@hooks/useApp'
import { GlobalToken, theme } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

const { useToken } = theme

const backgroundColor = props => {
  if (props.disabled) {
    return props.checked ? '#96c480 !important' : '#bfbfbf !important'
  }
  return props.checked
    ? props.token?.colorPrimaryBg
    : props.token.colorBgContainer
}
const ThemeSwitchWrapper = styled.div<{
  token?: GlobalToken
  checked?: boolean
  size?: number
  disabled?: boolean
}>`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${backgroundColor};
  border-radius: ${props => (props.size ?? 26) / 2}px;
  position: relative;
  color: ${props =>
    props.checked
      ? props.token?.colorPrimaryActive
      : props.token?.colorTextBase};
  display: block;
  border: 1px solid ${props => props.token?.colorBorderSecondary};
  height: ${props => props?.size ?? 26}px;
  width: ${props => (props?.size ?? 26) * 2}px;

  box-shadow: ${props => (props.disabled ? 'none' : 'unset')};
  &:hover {
    background-color: ${props => props.token?.colorPrimaryBgHover};
  }
  &:before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    border-radius: 50%;
    transition: left 0.2s 0.1s ease-in-out;

    width: ${props => (props?.size ?? 26) - 6}px;
    height: ${props => (props?.size ?? 26) - 6}px;
    top: 2px;
    left: ${props => (props.checked ? (props.size ?? 26) + 2 : 2)}px;

    transition: all 0.4s;
    background: ${props =>
      props.checked
        ? 'transparent'
        : 'linear-gradient(40deg, #ff0080, #ff8c00 70%)'};

    box-shadow: ${props =>
      props.checked
        ? 'inset -3px -3px 5px -2px #8983f7,inset -4px -4px 0px 0px #a3daff'
        : '0 0 5px #ff0080'};
    filter: ${props =>
      props.disabled
        ? 'grayscale(1)'
        : props.checked
        ? 'drop-shadow(0 0 2px #8983f7)'
        : 'none'};
  }
`
export default () => {
  const app = useApp()
  const [checked, setChecked] = useState(app.theme === 'dark')
  const { token } = useToken()

  const toggleSwitchCheck = () => {
    setChecked(!checked)
    const currentTheme = !checked ? 'dark' : 'light'
    window.api?.theme.toggle({ theme: currentTheme })
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
    <>
      <ThemeSwitchWrapper
        token={token}
        size={26}
        checked={checked}
        onClick={toggleSwitchCheck}
      />
    </>
  )
}

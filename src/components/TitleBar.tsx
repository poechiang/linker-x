import { MoreOutlined } from '@ant-design/icons'
import { ReactComponent as EnUs } from '@assets/images/en-us.svg?react'
import { ReactComponent as SystemThemeLocked } from '@assets/images/system-theme-locked.svg?react'
import { ReactComponent as SystemThemeUnlock } from '@assets/images/system-theme-unlock.svg?react'
import { ReactComponent as ZhCn } from '@assets/images/zh-cn.svg?react'
import appThemes, { ThemeColor } from '@assets/themes'
import { useApp } from '@hooks/useApp'
import { Button, Divider, Dropdown, GlobalToken, MenuProps, theme } from 'antd'
import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import {
  cloneElement,
  CSSProperties,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import ThemeSwitch from './ThemeSwitch'

declare type MenuItems = MenuProps['items']

const TitleBarButton = styled(Button)<{ height?: string }>`
  padding: 0;
  font-size: 16px;
  width: 32px;
`

const CustomDropdownPanel = styled.div<{ token?: GlobalToken }>`
  background-color: ${props => props.token?.colorBgElevated};
  box-shadow: ${props => props.token?.boxShadowSecondary};
  border-radius: ${props => props.token?.borderRadiusLG}px;
`

const localeMenuItems = [
  {
    key: 'zhCN',
    label: '简体中文',
  },
  {
    key: 'enUS',
    label: 'English',
  },
]
const menuItemConverter = (m: any) => ({
  ...m,
  children: m.children ? (m.children || []).map(menuItemConverter) : null,
})

const localeDropMenuItems = localeMenuItems.map(menuItemConverter)

export type TitleBarProps = Record<string, any> & {
  divider?: boolean
  children?: any
  style?: CSSProperties
}
export default ({ children, divider, style }: TitleBarProps) => {
  const app = useApp()
  const { token } = theme.useToken()
  const [flowSystemTheme, setFlowSystemTheme] = useState(false)
  const [currentColoring, setCurrentColoring] = useState(app.coloring)
  const [menuItems, setMenuItems] = useState<MenuItems>([])

  const { t } = useTranslation()

  const menuItemsConverter = useCallback(
    ([k, v]: any) => ({
      key: k,
      label: (
        <div className="app-head-dropdown-item theme">
          <span
            className={'bullet'}
            style={{
              backgroundColor: v[app.theme || 'light']?.token.colorPrimary,
            }}
          ></span>
          {t(`header.menu.${k}`)}
        </div>
      ),
    }),
    [app]
  )

  const { i18n } = useTranslation()
  const [selectedKey, setSelectedKey] = useState('zhCN')
  const menuClickHandler = useCallback<MenuClickEventHandler>(
    async e => {
      i18n.changeLanguage(e.key)
      setSelectedKey(e.key)
    },
    [i18n]
  )
  const themeMenuClickHandler = useCallback<MenuClickEventHandler>(
    e => {
      setCurrentColoring(e.key as ThemeColor)
      app.config({ coloring: e.key as ThemeColor })
      window.api?.theme.toggle({ coloring: e.key as ThemeColor })
    },
    [app]
  )

  useEffect(() => {
    setMenuItems(
      (Object.entries(appThemes) || []).map(m => menuItemsConverter(m))
    )
  }, [menuItemsConverter, t])

  const themeUpdater = useCallback(({ source }) => {
    setFlowSystemTheme(source === 'system')
  }, [])
  useEffect(() => {
    window.listeners.onThemeUpdated(themeUpdater)
    return () => {
      window.listeners.offThemeUpdated(themeUpdater)
    }
  }, [])

  return (
    <div style={style}>
      <div
        className="flexable --cross-center"
        style={{
          height: 48,
          paddingInline: 16,
        }}
      >
        {children}
        <span className="flex-auto"></span>

        <Dropdown
          className="non-draggable"
          placement="bottomRight"
          arrow
          menu={{
            items: localeDropMenuItems,
            selectedKeys: [selectedKey],
            onClick: menuClickHandler,
          }}
        >
          <TitleBarButton
            type="text"
            style={{ color: app.currentToken?.colorPrimary }}
          >
            {selectedKey === 'zhCN' ? (
              <ZhCn className="anticon" />
            ) : (
              <EnUs className="anticon" />
            )}
          </TitleBarButton>
        </Dropdown>
        <Dropdown
          className="non-draggable"
          placement="bottomRight"
          arrow
          menu={{
            items: menuItems,
            selectedKeys: [currentColoring!],
            onClick: themeMenuClickHandler,
          }}
          dropdownRender={menu => (
            <CustomDropdownPanel className="non-draggable" token={token}>
              <div
                className="flexable --main-center pv-4 ph-16"
                style={{ width: 200 }}
              >
                <span className="flex-auto" style={{ lineHeight: '26px' }}>
                  {t('深浅主题')}
                  {token.borderRadiusLG}
                </span>
                <ThemeSwitch />
              </div>

              <Divider style={{ margin: 0 }} />
              {cloneElement(menu as React.ReactElement, {
                style: { boxShadow: 'none' },
              })}
            </CustomDropdownPanel>
          )}
        >
          <TitleBarButton
            type="text"
            style={{ color: app.currentToken?.colorPrimary }}
            onClick={() => {
              window.api?.theme.toggle({ theme: 'system' })
            }}
          >
            {flowSystemTheme ? (
              <SystemThemeLocked className="anticon" />
            ) : (
              <SystemThemeUnlock className="anticon" />
            )}
          </TitleBarButton>
        </Dropdown>
        <TitleBarButton type="text" className="non-draggable ml-8">
          <MoreOutlined />
        </TitleBarButton>
      </div>
      {divider ? <Divider style={{ marginTop: 0 }} /> : null}
    </div>
  )
}

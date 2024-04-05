import { MoreOutlined } from '@ant-design/icons'
import {
  EnUsOutline,
  RssOutline,
  SystemThemeLockedFill,
  SystemThemeUnlockFill,
  ZhCnOutline,
} from '@assets/icons'
import appThemes, { ThemeColor } from '@assets/themes'
import { useApp } from '@hooks/useApp'
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  GlobalToken,
  MenuProps,
  theme,
} from 'antd'
import { random } from 'lodash'
import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import { cloneElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { StyledFlexableRow } from './styled-components/StyledFlexableRow'
import ThemeSwitch from './ThemeSwitch'

declare type MenuItems = MenuProps['items']

export const TitleBarButton = styled(Button)<{
  token?: GlobalToken
  height?: string
  checked?: boolean
}>`
  padding: 0;
  font-size: 16px;
  width: 32px;
  pointer-events: auto;
  background-color: ${props =>
    props.checked ? props.token?.colorBgTextActive : 'transparent'};
  color: ${props => props.token?.colorText};
  .icon {
    display: inline-flex;
    align-items: center;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
`

const CustomDropdownPanel = styled.div<{ token?: GlobalToken }>`
  background-color: ${props => props.token?.colorBgElevated};
  box-shadow: ${props => props.token?.boxShadowSecondary};
  border-radius: ${props => props.token?.borderRadiusLG}px;
`
const StyledBadge = styled(Badge)`
  font-size: 16px;
  .lnk-badge-count {
    min-width: 12px;
    font-size: 10px;
    border-radius: 6px;
    height: 12px;
    line-height: 12px;
    padding: 0 2px;
  }
`
const StyledTitleBar = styled(StyledFlexableRow)<
  TitleBarProps & { token?: GlobalToken }
>`
  display: flex;
  align-items: center;
  pointer-events: none;
  padding-inline: 16px;
  border-bottom: ${props =>
    props?.divider !== false ? '1px solid ' + props.token?.colorSplit : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100021;
  width: 100%;
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

export type TitleBarProps = FCChildrenProps & {
  divider?: boolean
  avoidMargin?: number
  moreHolding?: boolean
  onMoreButtonClick?: () => void
}
export default ({
  children,
  divider,
  style,
  moreHolding,
  ...props
}: TitleBarProps) => {
  const app = useApp()
  const { token } = theme.useToken()
  const { i18n } = useTranslation()

  const [followSystemTheme, setFollowSystemTheme] = useState(false)
  const [currentColoring, setCurrentColoring] = useState<string[]>([
    app.coloring!,
  ])
  const [menuItems, setMenuItems] = useState<MenuItems>([])

  const [selectedKey, setSelectedKey] = useState('zhCN')
  const [rss, setRss] = useState<any>([])
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

  const handleLocaleMenuClick = useCallback<MenuClickEventHandler>(
    async e => {
      i18n.changeLanguage(e.key)
      setSelectedKey(e.key)
    },
    [i18n]
  )
  const handleThemeMenuClick = useCallback<MenuClickEventHandler>(
    e => {
      setCurrentColoring([e.key])

      app.config({ coloring: e.key as ThemeColor })
      window.store.set('coloring', e.key as ThemeColor)
    },
    [app]
  )

  useEffect(() => {
    setMenuItems(
      (Object.entries(appThemes) || []).map(m => menuItemsConverter(m))
    )
  }, [menuItemsConverter, t])

  const themeUpdater = useCallback(({ followSystem }) => {
    setFollowSystemTheme(followSystem)
  }, [])
  useEffect(() => {
    setFollowSystemTheme(window.store.get('followSystem'))
    window.listeners.onThemeUpdated(themeUpdater)
    return () => {
      window.listeners.offThemeUpdated(themeUpdater)
    }
  }, [])

  const handleClick = useCallback(() => {
    setRss([...rss, { id: random() }])
  }, [rss])
  return (
    <StyledTitleBar
      height="48px"
      className="title-bar-wrapper"
      {...{ style, divider, token }}
    >
      <div
        style={{
          transition: 'all .3s ease-in-out',
          paddingLeft: props?.avoidMargin ?? 0,
        }}
      ></div>
      {children}
      <span className="flex-auto"></span>

      <TitleBarButton
        className="non-draggable ml-8"
        type="text"
        onClick={handleClick}
      >
        <StyledBadge count={rss.length}>
          <RssOutline />
        </StyledBadge>
      </TitleBarButton>
      <Dropdown
        className="non-draggable ml-8"
        placement="bottomRight"
        arrow
        menu={{
          items: menuItems,
          selectedKeys: currentColoring,
          onClick: handleThemeMenuClick,
        }}
        dropdownRender={menu => (
          <CustomDropdownPanel className="non-draggable" token={token}>
            <div
              className="flexable --main-center pv-4 ph-16"
              style={{ width: 200 }}
            >
              <span className="flex-auto" style={{ lineHeight: '26px' }}>
                {t('深浅主题')}
              </span>
              <ThemeSwitch onCheckChange={() => setFollowSystemTheme(false)} />
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
          style={{ color: token?.colorPrimary }}
          onClick={() => {
            window.store.set('followSystem', true)
            setFollowSystemTheme(true)
          }}
        >
          {followSystemTheme ? (
            <SystemThemeLockedFill />
          ) : (
            <SystemThemeUnlockFill />
          )}
        </TitleBarButton>
      </Dropdown>
      <Dropdown
        className="non-draggable ml-8"
        placement="bottomRight"
        arrow
        menu={{
          items: localeDropMenuItems,
          selectedKeys: [selectedKey],
          onClick: handleLocaleMenuClick,
        }}
      >
        <TitleBarButton type="text" token={token}>
          {selectedKey === 'zhCN' ? <ZhCnOutline /> : <EnUsOutline />}
        </TitleBarButton>
      </Dropdown>
      <TitleBarButton
        type="text"
        className="non-draggable ml-8"
        token={token}
        checked={moreHolding}
        onClick={props.onMoreButtonClick}
      >
        <MoreOutlined />
      </TitleBarButton>
    </StyledTitleBar>
  )
}

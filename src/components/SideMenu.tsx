import {
  AppOutline,
  DevToolsOutline,
  MobileOutline,
  SettingsOutline,
  UpdateCheckOutline,
} from '@assets/icons'
import {
  Avatar,
  ConfigProvider,
  GlobalToken,
  Menu,
  MenuProps,
  theme,
} from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { settingMenus, sideMenus } from '../routers'

type MenuItem = MenuProps['items']

const extraMenuItemsData: MenuItem = [
  {
    label: 'Navigation One',
    title: '',
    key: 'app',
    icon: <AppOutline />,
  },
  {
    label: 'Navigation Two',
    title: '',
    key: 'mobile',
    icon: <MobileOutline />,
  },
  {
    key: 'settings',
    icon: <SettingsOutline className="icon" />,
    children: [
      {
        type: 'divider',
        key: 'settings:split1',
      },
      {
        label: '开发者工具',
        title: '',
        key: 'settings:devtools',
        icon: <DevToolsOutline />,
      },
      {
        label: '检查更新',
        title: '',
        key: 'settings:update-check',
        icon: <UpdateCheckOutline />,
      },
    ],
  },
]
const VibrancyMenu = styled(Menu)<{ token?: GlobalToken }>`
  background-color: transparent;
  border-color: transparent !important;
  .lnk-menu-item,
  .lnk-menu-submenu > .lnk-menu-submenu-title {
    padding: 0;
    text-align: center;
    margin-inline: 8px;
    width: calc(100% - 16px);
    color: ${props => props.token?.colorTextSecondary};
    & > .anticon,
    & > .lnk-menu-item-icon {
      display: inline-block;
      font-size: 24px;
      vertical-align: middle;
      line-height: 0;
    }
  }
  .lnk-menu-item {
    &-selected {
      background-color: transparent;
      color: ${props => props.token?.colorText};
      &:before {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background-color: ${props => props.token?.colorPrimary};
        border-radius: 3px;
        top: 50%;
        left: 0;
        transform: translate(0, -3px);
      }
    }
    &:hover {
      background-color: ${props => props.token?.colorBgTextHover}!important;
    }
  }
  &.lnk-menu-inline-collapsed {
    .lnk-menu-item,
    .lnk-menu-submenu > .lnk-menu-submenu-title {
      .lnk-menu-title-content {
        display: none;
      }
    }
  }
`
/** SideMenu */
export default () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // from routes
  const [routerMenuItems] = useState<MenuItem>(sideMenus)
  const [extraMenuItems, setExtraMenuItems] =
    useState<MenuItem>(extraMenuItemsData)

  const handleRouteMenuItemClick: MenuProps['onClick'] = e => {
    navigate(e.key)
  }

  const handleExtraMenuItemClick: MenuProps['onClick'] = e => {
    if (e.key === 'settings:devtools') {
      window.api?.openDevTools()
    } else if (e.key === 'settings:update-check') {
      const settingsMenuItem = extraMenuItems?.find(
        item => item?.key === 'settings'
      )
      if (settingsMenuItem) {
        ;(settingsMenuItem as any).icon = (
          <SettingsOutline className="icon rotate" />
        )

        setExtraMenuItems([...extraMenuItems!])
        setTimeout(() => {
          ;(settingsMenuItem as any).icon = <SettingsOutline className="icon" />

          setExtraMenuItems(extraMenuItems)
        }, 10000)
      }
    } else if (e.key?.startsWith('/')) {
      navigate(e.key)
    }
  }

  // Listen the change of router
  useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location])
  useEffect(() => {
    const settingsMenuItem = extraMenuItems?.find(
      item => item?.key === 'settings'
    )

    if (settingsMenuItem) {
      ;(settingsMenuItem as any).children.unshift(...settingMenus)
    }

    setExtraMenuItems([...extraMenuItems!])
  }, [])

  return (
    <div className="flexable --column --cross-center full-parent">
      <Avatar
        shape="square"
        size={48}
        src={'me.jpeg'}
        style={{ marginBlock: 8 }}
      />

      <VibrancyMenu
        className="non-draggable"
        onClick={handleRouteMenuItemClick}
        mode="inline"
        selectedKeys={selectedKeys}
        items={routerMenuItems}
        token={token}
        inlineCollapsed={true}
        style={{ width: 64 }}
      />
      <span className="flex-auto"></span>

      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorSplit: token.colorSplit,
            },
          },
        }}
      >
        <VibrancyMenu
          className="non-draggable"
          onClick={handleExtraMenuItemClick}
          mode="inline"
          items={extraMenuItems}
          token={token}
          inlineCollapsed={true}
          selectable={false}
          style={{ width: 64 }}
        />
      </ConfigProvider>
    </div>
  )
}

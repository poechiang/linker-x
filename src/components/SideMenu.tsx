import { sideMenuItems } from '@/routers/navMenu'
import {
  AppOutline,
  MobileOutline,
  ReadmeOutline,
  SettingsOutline,
} from '@assets/icons'
import { Avatar, GlobalToken, Menu, MenuProps, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

type MenuItem = MenuProps['items']

const extraMenuItems: MenuItem = [
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
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingsOutline />,
    children: [
      {
        key: '/readme',
        title: '',
        label: '自述',
        icon: <ReadmeOutline />,
      },
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            title: '',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            title: '',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            title: '',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            title: '',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
]
const VibrancyMenu = styled(Menu)<{ token?: GlobalToken }>`
  background-color: transparent;
  .lnk-menu-item,
  .lnk-menu-submenu > .lnk-menu-submenu-title {
    padding: 0;
    text-align: center;
    margin-inline: 8px;
    width: calc(100% - 16px);
    & > .anticon,
    & > .lnk-menu-item-icon {
      display: inline-block;
      font-size: 24px;
      vertical-align: middle;
      line-height: 0;
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
  const [routerMenuItems] = useState<MenuItem>(sideMenuItems)

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key)
  }

  // Listen the change of router
  useEffect(() => {
    console.log('location', location)
    setSelectedKeys([location.pathname])
  }, [location])

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
        onClick={onClick}
        mode="inline"
        selectedKeys={selectedKeys}
        items={routerMenuItems}
        token={token}
        inlineCollapsed={true}
        style={{ width: 70 }}
      />
      <span className="flex-auto"></span>

      <VibrancyMenu
        className="non-draggable"
        onClick={onClick}
        mode="inline"
        items={extraMenuItems}
        token={token}
        inlineCollapsed={true}
        style={{ width: 70 }}
      />
    </div>
  )
}

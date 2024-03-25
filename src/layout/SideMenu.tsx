import routes from '@/routers'
import { GlobalToken, Menu, MenuProps, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

type MenuItem = Required<MenuProps>['items'][number]

// from routes
const menuItems: MenuItem[] = routes
  ?.filter(item => !item?.meta?.hidden)
  .map(
    ({ path, meta }) =>
      ({
        ...meta,
        key: path,
      } as MenuItem)
  )

const VibrancyMenu = styled(Menu)<{ token?: GlobalToken }>`
  background-color: transparent;
  .ant-menu-item {
    padding: 0;
    text-align: center;
    &:hover {
      background-color: ${props => props.token?.Menu?.colorItemBgHover};
    }
    &:active {
      background-color: transparent !important;
    }
    & > .anticon {
      display: inline-block;
      font-size: 24px;
      vertical-align: middle;
      line-height: 0;
    }
    &-selected {
      background-color: transparent;
      color: ${props => props.token?.colorPrimary};
    }
    &-active {
      color: ${props => props.token?.Menu?.colorItemBgActive};
    }
  }
  &.ant-menu-inline-collapsed .ant-menu-item .ant-menu-title-content {
    display: none;
  }
`
/** SideMenu */
export default () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key)
  }

  // Listen the change of router
  useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location])

  return (
    <VibrancyMenu
      className="non-draggable"
      onClick={onClick}
      mode="inline"
      selectedKeys={selectedKeys}
      items={menuItems}
      theme="dark"
      token={token}
      inlineCollapsed={true}
      style={{ width: 70 }}
    />
  )
}

import routes from '@/routers'
import { useApp } from '@hooks/useApp'
import { ConfigProvider, GlobalToken, Menu, MenuProps, theme } from 'antd'
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
  .con-com-menu-item {
    padding: 0;
    text-align: center;
    margin-inline: 8px;
    width: calc(100% - 16px);
    & > .anticon {
      display: inline-block;
      font-size: 16px;
      vertical-align: middle;
      line-height: 0;
    }
  }
  &.con-com-menu-inline-collapsed
    .con-com-menu-item
    .con-com-menu-title-content {
    display: none;
  }
`
/** SideMenu */
export default () => {
  const navigate = useNavigate()
  const location = useLocation()
  const app = useApp()
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
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            colorItemBgSelected:
              app.theme === 'dark' ? '#ffffff1a' : '#0000001a',
            colorItemTextSelected: token.colorPrimary,
          },
        },
      }}
    >
      <VibrancyMenu
        className="non-draggable"
        onClick={onClick}
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        theme={app.theme}
        token={token}
        inlineCollapsed={true}
        style={{ width: 70 }}
      />
    </ConfigProvider>
  )
}

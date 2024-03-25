import { MoreOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import appThemes from '@assets/themes'
import {
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Image,
  Input,
  List,
  MenuProps,
  theme,
  Typography,
} from 'antd'
import * as fns from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { cloneElement, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import ThemeSwitch from '~/src/components/ThemeSwitch'
import mockData from './mockData.json'

import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import { ReactComponent as SystemThemeLocked } from '~/src/assets/images/system-theme-locked.svg?react'
import { ReactComponent as SystemThemeUnlock } from '~/src/assets/images/system-theme-unlock.svg?react'
import { ThemeColor } from '~/src/assets/themes'
import { useApp } from '~/src/hooks/useApp'
declare type MenuItems = MenuProps['items']

const { Title } = Typography
const FlexableRow = styled.div<{ height?: string }>`
  display: flex;
  align-items: stretch;
  height: ${props => props.height};
  .flex-auto {
    flex: auto;
  }
`
const TitleBarButton = styled(Button)<{ height?: string }>`
  padding: 0;
  font-size: 16px;
  width: 32px;
`
const contactList = mockData.map(({ records, name }) => {
  const recordHistory = (records || []).map(r => {
    const lines: string[] = r?.content.split('\n')
    const seconds = Date.now() / 1000 - r?.timestamp
    let sendTime
    if (seconds < 60) {
      sendTime = `${seconds}秒前`
    } else {
      sendTime = fns.formatDistanceToNow(r?.timestamp * 1000, { locale: zhCN })
    }
    return {
      ...r,
      sendTime,
      content: lines,
    }
  })
  const { sendTime, content, type } = recordHistory[0]
  return {
    sendTime,
    name,
    recordHistory,
    avatar: `https://picsum.photos/200?random=${(
      Math.random() * 100000
    ).toFixed()}`,
    content: `${type === 'to' ? '我' : name}:${content[content.length - 1]}`,
  }
})
export default () => {
  const { token } = theme.useToken()

  const [menuItems, setMenuItems] = useState<MenuItems>([])
  const [flowSystemTheme, setFlowSystemTheme] = useState(false)

  const app = useApp()
  const themeMenuClickHandler = useCallback<MenuClickEventHandler>(
    e => {
      app.config({ coloring: e.key as ThemeColor })
    },
    [app]
  )
  const [currentContact, setCurrentContact] = useState(
    contactList?.[0]?.name ?? ''
  )

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  }

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
          {`header.menu.${k}`}
        </div>
      ),
    }),
    [app]
  )
  useEffect(() => {
    setMenuItems(
      (Object.entries(appThemes) || []).map(m => menuItemsConverter(m))
    )
  }, [menuItemsConverter])

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
    <FlexableRow height="100%">
      <div
        className="flexable --column full-parent"
        style={{ backgroundColor: token.colorBgContainer, width: 294 }}
      >
        <div
          className="flexable non-draggable"
          style={{ paddingInline: 16, paddingBlock: 8 }}
        >
          <Input
            className="flex-auto mr-8"
            placeholder="搜索"
            prefix={<UserOutlined />}
          />
          <Button>
            <UserAddOutlined />
          </Button>
        </div>
        <ConfigProvider
          theme={{
            token: { colorSplit: 'transparent' },
          }}
        >
          <List
            className="flex-auto non-draggable"
            itemLayout="horizontal"
            dataSource={contactList}
            style={{ overflowY: 'auto', height: 0 }}
            renderItem={item => (
              <List.Item
                className={
                  currentContact === item.name ? 'active flexable' : 'flexable'
                }
                style={{
                  paddingInline: 16,
                  backgroundColor:
                    currentContact === item.name
                      ? token.colorFillSecondary
                      : 'transparent',
                }}
                onClick={() => {
                  setCurrentContact(item.name)
                }}
              >
                <div className="mr-8" style={{ display: 'inline-flex' }}>
                  <Image
                    style={{ borderRadius: 4 }}
                    width={36}
                    src={item.avatar}
                  />
                </div>
                <div className="flex-auto" style={{ width: 0 }}>
                  <div className="flexable">
                    <span className="flex-auto ellipsis">{item.name}</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: '#737373',
                      }}
                    >
                      {item.sendTime}
                    </span>
                  </div>
                  <p
                    className="ellipsis"
                    style={{
                      width: '100%',
                      color: '#737373',
                    }}
                  >
                    {item.content}
                  </p>
                </div>
              </List.Item>
            )}
          />
        </ConfigProvider>
      </div>
      <div
        className="flex-auto flexable --column"
        style={{ backgroundColor: token.colorBgContainer }}
      >
        <div
          className="flexable --cross-center"
          style={{
            height: 48,
            paddingInline: 16,
          }}
        >
          <Title
            level={5}
            style={{
              marginBottom: 0,
            }}
          >
            {currentContact}
          </Title>
          <span className="flex-auto"></span>

          <Dropdown
            className="non-draggable"
            placement="bottomRight"
            arrow
            menu={{
              items: menuItems,
              selectedKeys: [app.coloring!],
              onClick: themeMenuClickHandler,
            }}
            dropdownRender={menu => (
              <div className="non-draggable" style={contentStyle}>
                <div
                  className="flexable --main-center pv-4 ph-16"
                  style={{ width: 200 }}
                >
                  <span className="flex-auto" style={{ lineHeight: '26px' }}>
                    深浅主题
                  </span>
                  <ThemeSwitch />
                </div>

                <Divider style={{ margin: 0 }} />
                {cloneElement(menu as React.ReactElement, {
                  style: { boxShadow: 'none' },
                })}
              </div>
            )}
          >
            <TitleBarButton
              type="text"
              style={{ color: app.currentToken?.colorPrimary }}
              onClick={() => {
                window.api?.theme.toggle('system')
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
        <Divider style={{ marginTop: 0 }} />
        <div className="non-draggable flex-auto">
          <List className="record-wrap">
            <List.Item></List.Item>
          </List>
        </div>
      </div>
    </FlexableRow>
  )
}

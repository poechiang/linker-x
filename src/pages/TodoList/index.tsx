import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { TodoOutline } from '@assets/icons'
import TitleBar from '@components/TitleBar'
import {
  Button,
  ConfigProvider,
  Image,
  Input,
  List,
  theme,
  Typography,
} from 'antd'
import * as fns from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { FC, useState } from 'react'
import styled from 'styled-components'
import mockData from '../ChatRecords/mockData.json'

const { Title } = Typography

const FlexableRow = styled.div<{ height?: string }>`
  display: flex;
  align-items: stretch;
  height: ${props => props.height};
  .flex-auto {
    flex: auto;
  }
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

const Todo: FC = () => {
  const { token } = theme.useToken()

  const [currentContact, setCurrentContact] = useState(
    contactList?.[0]?.name ?? ''
  )

  return (
    <FlexableRow
      height="100%"
      style={{ backgroundColor: token.colorBgContainer }}
    >
      <div
        className="flexable --column full-parent"
        style={{ backgroundColor: token.colorBgElevated, width: 294 }}
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
            token: {
              colorSplit: 'transparent',
            },
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
        <TitleBar>
          <Title
            level={5}
            style={{
              marginBottom: 0,
            }}
          >
            {currentContact}
          </Title>
        </TitleBar>
        <div className="non-draggable flex-auto">
          <List className="record-wrap">
            <List.Item></List.Item>
          </List>
        </div>
      </div>
    </FlexableRow>
  )
}

export const meta = {
  title: '待办事项',
  name: 'Todo',
  icon: <TodoOutline />,
  element: <Todo />,
}
export default Todo

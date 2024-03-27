import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import {
  ChatOutline,
  FavoriteMulti,
  FemaleOfflineMulti,
  FemaleOnlineMulti,
  MaleOfflineMulti,
  MaleOnlineMulti,
} from '@assets/icons'
import ExtraDrawer from '@components/ExtraDrawer'
import { StyledFlexableRow } from '@components/StyleComponnets'
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
import { random } from 'lodash'
import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import mockData from './mockData.json'

const { Title } = Typography

const contactList: IContact[] = mockData.map(({ records, name }) => {
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
    type,
    recordHistory,
    avatar: `https://picsum.photos/200?random=${(
      Math.random() * 100000
    ).toFixed()}`,
    content: content[content.length - 1],
    gender: ['female', 'male'][random(0, 1, false)],
    state: ['offline', 'online'][random(0, 1, false)],
    favorited: [true, false][random(0, 1, false)],
  }
}) as any
const ChartRecord: FC = () => {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const [currentContact, setCurrentContact] = useState(contactList?.[0])
  const [profilePanelVisible, setProfilePanelVisible] = useState(true)
  const [profilePanelExpanded, setProfilePanelExpanded] = useState(false)
  const closeProfilePanel = useCallback(() => setProfilePanelVisible(false), [])
  const handleMoreButtonClick = useCallback(
    () => setProfilePanelVisible(true),
    []
  )

  const handleProfilePanelExpandedChange = useCallback(
    (pinned: boolean) => setProfilePanelExpanded(pinned),
    []
  )
  return (
    <StyledFlexableRow
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
                  currentContact.name === item.name
                    ? 'active flexable'
                    : 'flexable'
                }
                style={{
                  paddingInline: 16,
                  backgroundColor:
                    currentContact.name === item.name
                      ? token.colorFillSecondary
                      : 'transparent',
                }}
                onClick={() => {
                  setCurrentContact(item)
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
                    ></span>
                  </div>
                  <p
                    className="ellipsis"
                    style={{
                      width: '100%',
                      color: '#737373',
                    }}
                  >
                    {item.type === 'to' ? t('我') : item.name}:{item.content}
                  </p>
                </div>
              </List.Item>
            )}
          />
        </ConfigProvider>
      </div>
      <div
        className="flex-auto flexable --column"
        style={{
          backgroundColor: token.colorBgContainer,
          position: 'relative',
        }}
      >
        <TitleBar
          avoidMargin={profilePanelVisible && profilePanelExpanded ? 128 : 0}
          moreHolding={profilePanelVisible}
          onMoreButtonClick={handleMoreButtonClick}
        >
          <Title
            level={5}
            style={{
              marginBottom: 0,
            }}
          >
            {currentContact.name}
          </Title>
        </TitleBar>
        <div className="non-draggable flex-auto">
          <List className="record-wrap">
            <List.Item></List.Item>
          </List>
        </div>
        <ExtraDrawer
          expanded={profilePanelExpanded}
          visible={profilePanelVisible}
          onClose={closeProfilePanel}
          onExpandedChange={handleProfilePanelExpandedChange}
        >
          <article className="profile-panel">
            <header className="flexable">
              <Image
                src={currentContact.avatar}
                width={64}
                height={64}
                preview={false}
                style={{ borderRadius: 4 }}
              />
              <div className="flex-auto ml-16">
                <div className="flexable --cross-center">
                  <Title
                    level={4}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 0,
                    }}
                  >
                    {currentContact.name}
                  </Title>
                  <span className="ml-8" style={{ fontSize: 20 }}>
                    {currentContact.gender ? (
                      currentContact.gender === 'male' ? (
                        currentContact.state === 'online' ? (
                          <MaleOnlineMulti />
                        ) : (
                          <MaleOfflineMulti />
                        )
                      ) : currentContact.state === 'online' ? (
                        <FemaleOnlineMulti />
                      ) : (
                        <FemaleOfflineMulti />
                      )
                    ) : null}
                  </span>
                  <span className="ml-8" style={{ fontSize: 20 }}>
                    {currentContact.favorited ? <FavoriteMulti /> : null}
                  </span>
                </div>
              </div>
            </header>
          </article>
        </ExtraDrawer>
      </div>
    </StyledFlexableRow>
  )
}

export const routeMeta = {
  title: '聊天记录',
  name: 'Chat',
  index: true,
  icon: <ChatOutline />,
  element: <ChartRecord />,
}
export default ChartRecord

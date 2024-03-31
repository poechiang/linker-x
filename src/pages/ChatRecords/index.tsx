import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import {
  CallToOutline,
  ChatOutline,
  EmojiOutline,
  FavoriteMulti,
  FemaleOfflineMulti,
  FemaleOnlineMulti,
  FolderOutline,
  MaleOfflineMulti,
  MaleOnlineMulti,
  ScreenShotOutline,
  VedioOutline,
} from '@assets/icons'
import ExtraDrawer from '@components/ExtraDrawer'
import TitleBar from '@components/TitleBar'
import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  GlobalToken,
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
import styled from 'styled-components'
import { StyledFlexableColumn } from '~/src/components/styled-components'
import { StyledFlexableRow } from '~/src/components/styled-components/StyledFlexableRow'
import mockData from './mockData.json'

const { Title } = Typography
const { TextArea } = Input

const StyledChatToolButton = styled(Button)`
  &.lnk-btn-sm {
    font-size: 16px;
    &:not(:first-of-type) {
      margin-left: 4px;
    }
  }
`
const StyledChatRecordList = styled.div<{ token: GlobalToken }>`
  background-color: ${({ token }) => token.colorBgLayout};
  overflow-y: auto;
  -webkit-app-region: no-drag;
  .lnk-list-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 12px 14px;
    .lnk-avatar {
      margin: 0 4px;
    }
    .chat-record-bubble {
      font-size: 14px;
      line-height: 1.3;
      font-weight: 400;
      background-color: ${props => props.token.colorBgElevated};
      border-radius: 6px;
      position: relative;
      margin-left: 10px;
      padding: 12px 10px;
      position: relative;
      width: 60%;
      filter: drop-shadow(rgba(0, 0, 0, 0.05) 0px 0px 2px);
      &:before {
        content: '';
        position: absolute;
        background-color: inherit;
        width: 10px;
        height: 10px;
        top: 10px;
        left: -5px;
        transform: rotate(45deg);
      }
      p {
      }
    }
    &.reverse {
      flex-direction: row-reverse;

      .chat-record-bubble {
        color: #000000;
        background-color: #59b269;
        margin: 0;
        margin-right: 10px;
        &:before {
          left: auto;
          right: -5px;
        }
        p {
        }
      }
    }
  }
`
const contactList: IContact[] = mockData.map(({ records, name }) => {
  const recordHistory: any[] = (records || []).map(r => {
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
    recordHistory: recordHistory.reverse(),
    avatar: `https://picsum.photos/200?random=${(
      Math.random() * 100000
    ).toFixed()}`,
    content: content.join(''),
    gender: ['female', 'male'][random(0, 1, false)],
    state: ['offline', 'online'][random(0, 1, false)],
    favorited: [true, false][random(0, 1, false)],
  }
}) as any

const ChartRecord: FC = () => {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const [currentContact, setCurrentContact] = useState(contactList?.[0])
  const [profilePanelVisible, setProfilePanelVisible] = useState(false)
  const [profilePanelExpanded, setProfilePanelExpanded] = useState(false)
  const [msg, setMsg] = useState('')
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
      className="page-frame"
      height="100%"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <StyledFlexableColumn
        className="contact-list page-side"
        style={{
          backgroundColor: token.colorBgContainer,
          width: 294,
          minWidth: 294,
        }}
      >
        <div
          className="search-bar flexable non-draggable"
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
      </StyledFlexableColumn>

      <StyledFlexableRow
        className="page-bd flex-auto"
        style={{
          position: 'relative',
        }}
      >
        <TitleBar
          avoidMargin={profilePanelVisible && profilePanelExpanded ? 128 : 0}
          moreHolding={profilePanelVisible}
          onMoreButtonClick={handleMoreButtonClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100021,
            width: '100%',
          }}
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
        <StyledFlexableColumn className="flex-auto" style={{ width: 0 }}>
          <ConfigProvider
            theme={{
              token: {
                colorSplit: 'transparent',
              },
            }}
          >
            <StyledChatRecordList
              className="record-wrap flex-auto mt-48"
              token={token}
            >
              {currentContact.recordHistory?.map((r, i) => (
                <List.Item className={r.type === 'to' ? 'reverse' : ''} key={i}>
                  <Avatar
                    shape="square"
                    src={r.type === 'from' ? currentContact.avatar : 'me.jpeg'}
                  />
                  <div className="chat-record-bubble">
                    {r.content.map((l, x) => (
                      <p key={x}>{l}</p>
                    ))}
                  </div>
                </List.Item>
              ))}
            </StyledChatRecordList>
          </ConfigProvider>
          <Divider style={{ marginTop: 0, marginBottom: 4 }} />
          <StyledFlexableRow className="chat-tools non-draggable mh-4">
            <StyledChatToolButton size="small" type="text">
              <EmojiOutline />
            </StyledChatToolButton>
            <StyledChatToolButton size="small" type="text">
              <FolderOutline />
            </StyledChatToolButton>
            <StyledChatToolButton size="small" type="text">
              <ScreenShotOutline />
            </StyledChatToolButton>
            <span className="flex-auto"></span>
            <StyledChatToolButton size="small" type="text">
              <CallToOutline />
            </StyledChatToolButton>
            <StyledChatToolButton size="small" type="text">
              <VedioOutline />
            </StyledChatToolButton>
          </StyledFlexableRow>
          <ConfigProvider
            theme={{
              token: {
                boxShadowSecondary: 'none',
              },
              components: {
                Input: {
                  colorBgContainer: 'transparent',
                  borderRadius: 0,
                  colorPrimaryHover: 'transparent',
                },
              },
            }}
          >
            <TextArea
              className=" non-draggable"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              autoSize={{ minRows: 5, maxRows: 10 }}
              style={{ boxShadow: 'none' }}
            />
          </ConfigProvider>
        </StyledFlexableColumn>
        <ExtraDrawer
          expanded={profilePanelExpanded}
          visible={profilePanelVisible}
          onClose={closeProfilePanel}
          onExpandedChange={handleProfilePanelExpandedChange}
          width="50%"
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
                <div>
                  {t('昵称')}:{currentContact.nickName}
                </div>
                <div>
                  {t('领刻')}:{currentContact.userId}
                </div>
              </div>
            </header>
          </article>
        </ExtraDrawer>
      </StyledFlexableRow>
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

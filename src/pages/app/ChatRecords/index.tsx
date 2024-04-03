import {
  CallToOutline,
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
import { FC, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import SideList from '~/src/components/SideList'
import { StyledFlexableColumn } from '~/src/components/styled-components'
import { StyledFlexableRow } from '~/src/components/styled-components/StyledFlexableRow'
import { nextTick } from '~/src/libs/nextTick'
import ContactItem from './common/ContactItem'
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
  height: 0;
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
  const { timestamp, content, type } = recordHistory[0]

  return {
    timestamp,
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
  const [recordHistory, setRecordHistory] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const lastRecordRef = useRef<HTMLParagraphElement>(null)
  const textAreaRef = useRef<any>(null)
  const scollBottom = useCallback(() => {
    lastRecordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [lastRecordRef])
  const closeProfilePanel = useCallback(() => setProfilePanelVisible(false), [])
  const handleMoreButtonClick = useCallback(
    () => setProfilePanelVisible(true),
    []
  )

  const handleProfilePanelExpandedChange = useCallback(
    (pinned: boolean) => setProfilePanelExpanded(pinned),
    []
  )
  const handlePressEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.metaKey) {
        const textArea = textAreaRef.current?.resizableTextArea?.textArea
        const { selectionStart, selectionEnd } = textArea
        const newMsg = msg.split('')

        newMsg.splice(selectionStart, selectionEnd - selectionStart, '\n')

        setMsg(newMsg.join(''))
        nextTick(() => {
          textArea.selectionStart = selectionStart + 1
          textArea.selectionEnd = selectionStart + 1
        })
        return
      }

      if (!e.altKey && !e.metaKey && !e.shiftKey) {
        recordHistory?.push({
          timestamp: Date.now(),
          content: msg.split('\n'),
          type: 'to',
        })
        setRecordHistory([...recordHistory])
        setMsg('')
        nextTick(scollBottom)
      }
    },
    [msg, recordHistory]
  )
  return (
    <StyledFlexableRow
      className="page-frame"
      height="100%"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <SideList
        className="contact-list page-side"
        width={294}
        dataSource={contactList}
        renderItem={(item: any) => (
          <ContactItem
            selected={item.name === currentContact?.name}
            data={item}
            latestMsg={{
              timestamp: item.timestamp * 1000,
              content: item.content,
            }}
            onClick={() => {
              setCurrentContact(item)
              setRecordHistory(item.recordHistory ?? [])
            }}
          />
        )}
      />

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
              {recordHistory?.map((r, iR) => (
                <List.Item
                  className={r.type === 'to' ? 'reverse' : ''}
                  key={iR}
                >
                  <Avatar
                    shape="square"
                    src={r.type === 'from' ? currentContact.avatar : 'me.jpeg'}
                  />
                  <div className="chat-record-bubble selectable">
                    {r.content.map((l, iL) => (
                      <p key={iL}>{l}</p>
                    ))}
                  </div>
                </List.Item>
              ))}
              <List.Item>
                <p ref={lastRecordRef}></p>
              </List.Item>
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
              ref={textAreaRef}
              onChange={e => setMsg(e.target.value)}
              autoSize={{ minRows: 5, maxRows: 10 }}
              style={{ boxShadow: 'none' }}
              onPressEnter={handlePressEnter}
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

export default ChartRecord

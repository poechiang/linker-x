import { Avatar, GlobalToken, List, theme } from 'antd'
import { FC, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import * as fns from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'

export type ContactItemProps = FCProps & {
  data?: IContact
  latestMsg?: {
    timestamp?: number
    content?: string
  }
  selected?: boolean
  token?: GlobalToken
  onClick?: (item: MouseEvent) => void
}
const StyledContactItem = styled(List.Item)<ContactItemProps>`
  display: flex;
  padding: 12px 16px !important;
  background-color: ${props =>
    props.selected ? props.token?.colorFillSecondary : 'transparent'};
  .lnk-avatar {
    margin-right: 8px;
    display: inline-flex;
    borderradius: 4px;
  }
  .time,
  .msg {
    font-size: 12px;
    color: #737373;
  }
`
const ContactItem: FC<ContactItemProps> = ({ data, latestMsg, ...props }) => {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  return (
    <StyledContactItem {...{ ...props, token }}>
      <Avatar shape="square" size={36} src={data?.avatar} />

      <div className="flex-auto" style={{ width: 0 }}>
        <div className="flexable">
          <span className="flex-auto ellipsis">{data?.name}</span>
          <span className="time">
            {fns.formatDistanceToNow(latestMsg?.timestamp ?? 0, {
              locale: zhCN,
            })}
          </span>
        </div>
        <p className="msg ellipsis">
          {data?.type === 'to' ? t('我') : data?.name}:{latestMsg?.content}
        </p>
      </div>
    </StyledContactItem>
  )
}

export default ContactItem

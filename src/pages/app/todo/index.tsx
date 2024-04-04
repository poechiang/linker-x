import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import TitleBar from '@components/TitleBar'
import { Button, Input, List, theme, Typography } from 'antd'
import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import { TodoOutline } from '~/src/assets/icons'
import { StyledFlexableRow } from '~/src/components/styled-components/StyledFlexableRow'

const { Title } = Typography

const Todo: FC = () => {
  const { token } = theme.useToken()
  const { t } = useTranslation()

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
            {'currentContact'}
          </Title>
        </TitleBar>
        <div className="non-draggable flex-auto">
          <List className="record-wrap">
            <List.Item></List.Item>
          </List>
        </div>
      </div>
    </StyledFlexableRow>
  )
}

export const menu = {
  label: '待办事项',
  icon: <TodoOutline />,
}
export default Todo

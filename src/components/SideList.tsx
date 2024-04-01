import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Input, List, theme } from 'antd'
import { FC, ReactNode } from 'react'
import { StyledFlexableColumn } from '~/src/components/styled-components'

export type SideListProps = FCProps & {
  width?: number
  dataSource: any[]
  renderItem?: <T>(item: T, index: number) => ReactNode
}
const SideList: FC<SideListProps> = props => {
  const { token } = theme.useToken()

  return (
    <StyledFlexableColumn
      style={{
        backgroundColor: token.colorBgContainer,
        width: props.width,
        minWidth: props.width,
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
          dataSource={props.dataSource}
          style={{ overflowY: 'auto', height: 0 }}
          renderItem={props.renderItem}
        />
      </ConfigProvider>
    </StyledFlexableColumn>
  )
}

export default SideList

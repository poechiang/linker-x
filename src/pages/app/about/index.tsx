import { ReadmeOutline } from '@assets/icons'
import TitleBar from '@components/TitleBar'
import { Avatar, Divider, Space, Typography } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'

const { Title, Paragraph, Text } = Typography

const Div = styled.div`
  display: flex;
  align-items: center;
`

const CodeBlock = styled.pre`
  color: #cccccc !important;
  background: #282c34 !important;
`

const Readme: FC = () => (
  <>
    <TitleBar
      divider={false}
      style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
    ></TitleBar>
    <div className="m-20" style={{ height: 'calc(100% - 40px)' }}>
      <Typography className="non-draggable flexable --column full-parent">
        <Title>🎉 Linker X</Title>
        <Paragraph>
          <Space size="middle">
            <Div>
              <Avatar
                src={<img src="/electron-logo.svg" alt="avatar" />}
                size="small"
              />
              <Text strong>Electron</Text>
            </Div>
            <Div>
              <Avatar
                src={<img src="/vite-logo.svg" alt="avatar" />}
                size="small"
              />
              <Text strong>Vite</Text>
            </Div>
            <Div>
              <Avatar
                src={<img src="/react-logo.svg" alt="avatar" />}
                size="small"
              />
              <Text strong>React</Text>
            </Div>
          </Space>
        </Paragraph>
        <Divider />
        <div className="flex-auto" style={{ height: 0, overflowY: 'auto' }}>
          <Title level={2}>🚀 Feature</Title>
          <Paragraph>
            <ul className="ls-circle">
              <li>Develop by react and build by vite.</li>
              <li>Format code style by prettier and eslint.</li>
              <li>Configured electron-builder and husky and commitlint.</li>
            </ul>
          </Paragraph>
          <Title level={2}>📖 Usage</Title>
          <Title level={3}>Dev</Title>
          <Paragraph>
            Install
            <CodeBlock>yarn</CodeBlock>
            Start
            <CodeBlock>yarn dev</CodeBlock>
          </Paragraph>
          <Title level={4}>Package</Title>
          <CodeBlock>yarn build:[platform]</CodeBlock>
          <Paragraph></Paragraph>
        </div>
      </Typography>
    </div>
  </>
)

export const menu = {
  label: '关于...',
  name: 'About',
  icon: <ReadmeOutline />,
  type: 'settings',
}
export default Readme

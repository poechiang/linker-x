import { GlobalToken, theme, Typography } from 'antd'
import { FC } from 'react'
import { useRouteError } from 'react-router-dom'
import styled from 'styled-components'
import TitleBar from './TitleBar'

const { Title, Paragraph, Text, Link } = Typography
const StyledContainer = styled.div<{ token?: GlobalToken }>`
  height: 100vh;
  width: 100%;
  padding: 24px;
  .lnk-typography {
    h1 {
      color: ${props => props.token?.colorError};
    }
    .flex-auto {
      position: relative;
      height: 0;
      margin: 0;
      pre {
        background-color: ${props => props.token?.colorBgContainer};
        overflow-y: auto;
        margin: 0;
        height: 100%;
        padding: 1em;
        .scrollable-y {
          height: 100%;
        }
      }
      .lnk-typography-copy {
        position: absolute;
        top: 0.4em;
        right: 0.6em;
      }
    }
  }
`
const ErrorBoundary: FC = () => {
  const { token } = theme.useToken()

  let error = useRouteError() as Error
  console.log(error)
  return (
    <>
      <TitleBar divider={false} />
      <StyledContainer token={token}>
        <Typography className="flexable --column full-parent">
          <Title> 😱 DUANG ❗️❗️❗️</Title>

          <Paragraph className="non-draggable">
            <blockquote>
              🙅🙅‍♀️🙅‍♂️{' '}
              <Text code copyable>
                {error.message}
              </Text>
            </blockquote>
          </Paragraph>
          <Paragraph className="non-draggable selectable flex-auto" copyable>
            <pre>
              <div className="scrollable-y">{error?.stack}</div>
            </pre>
          </Paragraph>
        </Typography>
      </StyledContainer>
    </>
  )
}

export default ErrorBoundary

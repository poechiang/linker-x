import '@assets/styles/index.less'
import AppProvider from '@components/AppProvider'
import { Watermark } from 'antd'
// import PageFrame from '@pages/PageFrame'
import useMessage from 'antd/es/message/useMessage'
import useModal from 'antd/es/modal/useModal'
import useNotification from 'antd/es/notification/useNotification'
import { useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import styled from 'styled-components'
import { routers } from './routers'
const StyledWatermark = styled(Watermark)`
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  pointer-events: none;
`
export default () => {
  const [_1, messageHolder] = useMessage()
  const [_2, notificationHolder] = useNotification()
  const [_3, modalHolder] = useModal()
  const router = createHashRouter(routers)
  const [appName] = useState(window.store.get('app.name') ?? 'Linker X')
  const [appVersion] = useState(window.store.get('app.version') ?? '0.0.0')

  return (
    <AppProvider
      theme={window.store.get('theme')}
      coloring={window.store.get('coloring')}
    >
      {messageHolder}
      {notificationHolder}
      {modalHolder}
      {process.env.NODE_ENV === 'production' ? (
        <StyledWatermark
          content={`${appName}  v${appVersion}`}
          font={{ color: 'rgba(0,0,0,0.07)' }}
          rotate={-40}
          gap={[50, 60]}
          offset={[-70, -40]}
        />
      ) : null}
      <RouterProvider router={router} />
      {/* <BrowserRouter>
        <PageFrame />
      </BrowserRouter> */}
    </AppProvider>
  )
}

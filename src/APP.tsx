import '@assets/styles/index.less'
import AppProvider from '@components/AppProvider'
// import PageFrame from '@pages/PageFrame'
import useMessage from 'antd/es/message/useMessage'
import useModal from 'antd/es/modal/useModal'
import useNotification from 'antd/es/notification/useNotification'
import {
  /*BrowserRouter*/ createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { routers } from './routers'
export default () => {
  const [_1, messageHolder] = useMessage()
  const [_2, notificationHolder] = useNotification()
  const [_3, modalHolder] = useModal()
  const router = createBrowserRouter(routers)
  return (
    <AppProvider
      theme={window.store.get('theme')}
      coloring={window.store.get('coloring')}
    >
      {messageHolder}
      {notificationHolder}
      {modalHolder}
      <RouterProvider router={router} />
      {/* <BrowserRouter>
        <PageFrame />
      </BrowserRouter> */}
    </AppProvider>
  )
}

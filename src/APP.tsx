import '@assets/styles/index.less'
import AppProvider from '@components/AppProvider'
import AppFrame from '@pages/app'
import useMessage from 'antd/es/message/useMessage'
import useModal from 'antd/es/modal/useModal'
import useNotification from 'antd/es/notification/useNotification'
import { BrowserRouter } from 'react-router-dom'
export default () => {
  const [_1, messageHolder] = useMessage()
  const [_2, notificationHolder] = useNotification()
  const [_3, modalHolder] = useModal()
  return (
    <AppProvider
      theme={window.store.get('theme')}
      coloring={window.store.get('coloring')}
    >
      {messageHolder}
      {notificationHolder}
      {modalHolder}

      <BrowserRouter>
        <AppFrame />
      </BrowserRouter>
    </AppProvider>
  )
}

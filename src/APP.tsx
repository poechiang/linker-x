import '@assets/styles/index.less'
import useMessage from 'antd/es/message/useMessage'
import useModal from 'antd/es/modal/useModal'
import useNotification from 'antd/es/notification/useNotification'
import { HashRouter } from 'react-router-dom'
import AppProvider from './components/AppProvider'
import AppFrame from './layout/AppFrame'
export default (props: any) => {
  const [_1, messageHolder] = useMessage()
  const [_2, notificationHolder] = useNotification()
  const [_3, modalHolder] = useModal()
  return (
    <AppProvider {...props}>
      {messageHolder}
      {notificationHolder}
      {modalHolder}

      <HashRouter>
        <AppFrame />
      </HashRouter>
    </AppProvider>
  )
}

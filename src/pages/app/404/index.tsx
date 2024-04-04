import TitleBar from '@components/TitleBar'
import { Button, Result } from 'antd'
import { FC } from 'react'

const Readme: FC = () => (
  <>
    <TitleBar
      divider={false}
      style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
    ></TitleBar>
    <div className="m-20" style={{ height: 'calc(100% - 40px)' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  </>
)

export default Readme

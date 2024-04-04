import { withTags } from '@jeffchi/logger'
import { Outlet } from 'react-router-dom'
const { log } = withTags('appframe')
export default () => (
  <div className="flex-auto">
    <Outlet />
  </div>
)

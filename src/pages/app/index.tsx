import SideMenu from '@components/SideMenu'
import { Outlet } from 'react-router-dom'
export default () => (
  <>
    <div className="pt-28">
      <SideMenu />
    </div>
    <div className="flex-auto">
      <Outlet />
    </div>
  </>
)

import SideMenu from '@components/SideMenu'
import { StyledFlexableRow } from '@components/styled-components'
import { useApp } from '@hooks/useApp'
import { withTags } from '@jeffchi/logger'
import { routeLoader } from '@routers/index'
import { Spin } from 'antd'
import { Suspense, useCallback, useEffect } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
const { log } = withTags('appframe')
export default () => {
  const app = useApp()
  const themeUpdater = useCallback(
    ({ theme, coloring }) => {
      log('themeUpdater', theme, coloring)

      app.config({ theme, coloring })
    },
    [app]
  )
  useEffect(() => {
    window.listeners.onThemeUpdated(themeUpdater)
    return () => {
      window.listeners.offThemeUpdated(themeUpdater)
    }
  }, [])
  return (
    <>
      <div className="pt-28">
        <SideMenu />
      </div>
      <div className="flex-auto">
        <Suspense
          fallback={
            <StyledFlexableRow
              height="100vh"
              vertical="center"
              horizontal="center"
            >
              <Spin size="large" tip="Loading..." />
            </StyledFlexableRow>
          }
        >
          {useRoutes(routeLoader() as RouteObject[])}
        </Suspense>
      </div>
    </>
  )
}

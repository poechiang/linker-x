import routes from '@/routers'
import SideMenu from '@components/SideMenu'
import { useApp } from '@hooks/useApp'
import { Spin } from 'antd'
import { Suspense, useCallback, useEffect } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

export default () => {
  const app = useApp()
  const themeUpdater = useCallback(
    ({ theme, coloring }) => {
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
            <div className="flexable --main-center --cross-center full-height">
              <Spin size="large" tip="Loading..." />
            </div>
          }
        >
          {useRoutes(routes as RouteObject[])}
        </Suspense>
      </div>
    </>
  )
}

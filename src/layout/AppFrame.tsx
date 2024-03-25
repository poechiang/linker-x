import routes from '@/routers'
import { Spin } from 'antd'
import { Suspense, useCallback, useEffect } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import SideMenu from './SideMenu'

export default () => {
  const app = useApp()
  const themeUpdater = useCallback(({ theme }) => {
    app.config({ theme })
  }, [])
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

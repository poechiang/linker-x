import { ReadOutlined, TeamOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import { type RouteObject } from 'react-router-dom'
import Contact from '../pages/Contact'

type AppRouteObject = RouteObject & {
  children?: AppRouteObject[]
  meta?: {
    name?: string
    label?: string
    icon?: React.ReactNode
    hidden?: boolean | false
  }
}

const ReadMe = lazy(() => import('@pages/README'))

const routes: AppRouteObject[] = [
  {
    index: true,
    path: '/',
    element: <Contact />,
    meta: {
      name: 'Contact',
      label: '联系人',
      icon: <TeamOutlined />,
    },
  },
  {
    path: '/readme',
    element: <ReadMe />,
    meta: {
      name: 'ReadMe',
      label: '自述',
      icon: <ReadOutlined />,
    },
  },
]

export default routes

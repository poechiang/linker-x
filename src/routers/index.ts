import ErrorBoundary from '@components/ErrorBoundary'
import { withTags } from '@jeffchi/logger'
import { createElement, lazy } from 'react'
import { Navigate } from 'react-router-dom'
const { log } = withTags('router')

const pages = import.meta.glob(['@pages/**/index.tsx'], {
  eager: true,
}) as Record<string, PageMeta>

const routes = Object.entries(pages).map(([file, m]) => {
  const path = file.replace(/^\/src\/pages/, '').replace(/\/index\.tsx$/, '')
  const paths = path
    .split('/')
    .map(
      f =>
        f.replace(/[A-Z]/g, (l, i) => (i ? '-' : '') + l.toLowerCase()) || '/'
    )

  const Page = m.lazy ? lazy(() => import(/* @vite-ignore */ file)) : m.default

  return { file, paths, path, element: createElement(Page), menu: m?.menu }
})
const routerBuilder = (list, r) => {
  const [path, ...paths] = r.paths
  let currentNode = list.find(x => x.path === path)

  if (!currentNode) {
    currentNode = { path }
    list.push(currentNode)
  }

  if (paths.length) {
    currentNode.children = routerBuilder(currentNode?.children ?? [], {
      ...r,
      paths,
    })
  } else {
    // currentNode.ErrorBoundary = ErrorBoundary
    currentNode.errorElement = createElement(ErrorBoundary)
    currentNode.element = r.element
  }

  return list
}

const menuBuilder = (list, r) => {
  if (!r.menu) {
    return list
  }
  return [
    ...list,
    {
      key: r.path,
      ...r.menu,
    },
  ]
}

const routers = routes.reduce(routerBuilder, [])

routers[0].children.unshift({
  index: true,
  element: createElement(Navigate, {
    replace: true,
    to: '/app/chats',
  }),
})

log('routers:', routers)

const menus = routes.reduce(menuBuilder, [])

const sideMenus = menus
  .filter(m => !m.type || m.type === 'side')
  .map(({ type, ...m }) => m)

const settingMenus = menus
  .filter(m => m.type === 'settings')
  .map(({ type, ...m }) => m)
export { routers, sideMenus, settingMenus }

import { createElement, lazy } from 'react'
import { Navigate } from 'react-router-dom'

const routers: PageRouter[] = []

export const routeLoader = (idnex: string, replace?: boolean) => {
  if (routers.length === 0) {
    const pages = import.meta.glob(
      ['@pages/**/index.tsx', '!@pages/**/common/**/index.tsx'],
      {
        eager: true,
        import: 'default',
      }
    ) as Record<string, PageMeta>

    const routes = Object.entries(pages).map(([file]) => {
      const paths = file
        .replace(/\/src\/pages\/(.+)\/index\.tsx$/, '$1')
        .split('/')
        .map(f =>
          f.replace(/[A-Z]/g, (l, i) => (i ? '-' : '') + l.toLowerCase())
        )
      const Page = lazy(() => import(/* @vite-ignore */ file))
      return {
        paths: paths.map((p, i) => `${!i ? '/' : ''}${p}`),
        path: paths.join('/'),
        element: createElement(Page),
      }
    })

    const build = (list, r) => {
      const path = r?.paths.shift()
      const currentNode = list.find(x => x.path === path)

      if (r?.paths.length) {
        const children = build(currentNode?.children ?? [], r)
        if (currentNode) {
          currentNode.path = `${path}/*`
        } else {
          list.push({ path: `${path}/*`, children })
        }
      } else if (currentNode) {
        currentNode.element = r.element //route.element
      } else {
        list.push({ path, element: r.element })
      }

      return list
    }
    routers.push(
      {
        path: '',
        element: createElement(Navigate, {
          replace: true,
          to: '/app/chat-records',
        }),
      },
      ...routes.reduce(build, [])
    )
  }
  return routers
}

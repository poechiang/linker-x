import { createElement, lazy } from 'react'
import { Navigate } from 'react-router-dom'

const routers: PageRouter[] = []
export default () => {
  if (routers.length === 0) {
    let indexRouter
    const pageMetas = import.meta.glob(
      ['@pages/**/*.tsx', '@pages/**/index.ts'],
      {
        eager: true,
        import: 'routeMeta',
      }
    ) as Record<string, PageMeta>
    const pages = Object.entries(pageMetas).map(([file, meta]) => {
      if (!meta) return null
      const path = file
        .replace('/src/pages/', '/')
        .replace(/(\/index)?.ts(x?)$/, '')
        .split('/')
        .map(f =>
          f.replace(/[A-Z]/g, (l, i) => (i ? '-' : '') + l.toLowerCase())
        )
        .join('/')
      if (meta.index) {
        indexRouter = {
          path: '/',
          element: createElement(Navigate, {
            to: path,
          }),
          menu: false,
        }
      }

      return {
        path,

        element: meta.lazy
          ? lazy(() => import(/* @vite-ignore */ file))
          : meta.element,
        ...meta,
      }
    })
    routers.push(...[indexRouter, ...pages].filter(Boolean))
  }
  return routers
}

import { toUnder } from '@libs/toUnder'
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
        import: 'meta',
      }
    ) as Record<string, PageMeta>
    console.log(pageMetas, Object.entries(pageMetas))
    const pages = Object.entries(pageMetas).map(([file, meta]) => {
      const path = file
        .replace('/src/pages/', '/')
        .replace(/(\/index)?.ts(x?)$/, '')
        .split('/')
        .map(toUnder)
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
        element: meta.lazy ? lazy(() => import(file)) : meta.element,
        ...meta,
      }
    })
    routers.push(...[indexRouter, ...pages].filter(Boolean))
  }
  return routers
}

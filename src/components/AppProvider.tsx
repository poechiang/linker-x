import type { ThemeColor, ThemeKey } from '@assets/themes'
import themeMapInst from '@assets/themes'
import { withTags } from '@jeffchi/logger'
import { hyphen } from '@poech/camel-hump-under'
import { ConfigProvider } from 'antd'
import { AliasToken } from 'antd/es/theme/internal'
import zhCN from 'antd/locale/zh_CN'
import { debounce } from 'lodash'
import { createContext, useEffect, useState } from 'react'

const { log } = withTags('AppProvider')
export declare interface IAppContextData {
  coloring?: ThemeColor
  theme?: ThemeKey
}
export declare interface IAppContext extends IAppContextData {
  config: (value: IAppContextData) => void
}

/**
 * 当前主题变量写入 :root css variable
 * @param param0
 */
export const updateThemeVariable = debounce((token: Partial<AliasToken>) => {
  // todo
  const rootElement = document.querySelector(':root') as HTMLHtmlElement

  Object.entries(token || {}).forEach(([k, v]) => {
    rootElement.style.setProperty(`--${hyphen(k)}`, v?.toString() || '')
  })
}, 100)

export const AppContext = createContext<IAppContext>(null!)

export default ({ children, ...props }) => {
  const [theme, setTheme] = useState<ThemeKey>()
  const [coloring, setColoring] = useState<ThemeColor>()
  const config = (value: IAppContextData) => {
    let needUpdate = false
    const result: any = {}
    if (!theme || (value.theme && value.theme !== theme)) {
      result.theme = value.theme || theme || 'light'
      setTheme(value.theme || theme || 'light')
      needUpdate = true
    } else {
      result.theme = value.theme || theme
    }

    if (!coloring || (value.coloring && value.coloring !== coloring)) {
      result.coloring = value.coloring || coloring || 'polar'
      setColoring(value.coloring || coloring || 'polar')
      needUpdate = true
    } else {
      result.coloring = value.coloring || coloring
    }
    if (needUpdate) {
      log('config', needUpdate, theme, coloring, value)
      const { token } = themeMapInst[result.coloring][result.theme]

      updateThemeVariable(token)
    }
  }

  useEffect(() => {
    config(props)
  }, [])
  return (
    <AppContext.Provider value={{ ...props, config }}>
      <ConfigProvider
        prefixCls="lnk"
        theme={themeMapInst[coloring || 'polar'][theme || 'light']}
        locale={zhCN}
      >
        {children}
      </ConfigProvider>
    </AppContext.Provider>
  )
}

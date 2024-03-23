import type { ThemeColor, ThemeKey } from '@assets/themes'
import themeMapInst from '@assets/themes'
import { ConfigProvider } from 'antd'
import { AliasToken } from 'antd/es/theme/internal'
import zhCN from 'antd/locale/zh_CN'
import { debounce } from 'lodash'
import { createContext, useEffect, useState } from 'react'
export declare interface IAppContextData {
  coloring?: ThemeColor
  theme?: ThemeKey
  currentToken?: Partial<AliasToken>
}
export declare interface IAppContext extends IAppContextData {
  config: (value: IAppContextData) => void
}

export const toUnder = (name: string) => {
  if (typeof name !== 'string' || !name?.length) {
    throw Error('无效的参数,参数类型无效,或为空')
  }
  return name.replace(/[A-Z]/g, (l, i) => (i ? '-' : '') + l.toLowerCase())
}
/**
 * 当前主题变量写入 :root css variable
 * @param param0
 */
const updateThemeVariable = debounce((token: Partial<AliasToken>) => {
  // todo
  const rootElement = document.querySelector(':root') as HTMLHtmlElement

  Object.entries(token || {}).forEach(([k, v]) => {
    rootElement.style.setProperty(`--${toUnder(k)}`, v?.toString() || '')
  })
}, 100)

export const AppContext = createContext<IAppContext>(null!)

export default ({ children, ...props }) => {
  // const [themeMapInst, setThemeMapInst] = useState<any>(null)
  const [theme, setTheme] = useState<ThemeKey>()
  const [coloring, setColoring] = useState<ThemeColor>()
  const [currentToken, setCurrentToken] = useState<Partial<AliasToken>>()

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
      const token = themeMapInst[result.coloring][result.theme].token
      setCurrentToken(token)
      updateThemeVariable(token)
    }
  }

  useEffect(() => {
    config(props)
  }, [])
  return (
    <AppContext.Provider value={{ ...props, config, currentToken }}>
      <ConfigProvider
        prefixCls="con-com"
        theme={themeMapInst[coloring || 'polar'][theme || 'dark']}
        locale={zhCN}
      >
        {children}
      </ConfigProvider>
    </AppContext.Provider>
  )
}

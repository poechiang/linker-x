/// <reference types="@electron-toolkit/preload/dist"/>

declare interface Window {
  electron?: ElectronAPI

  api?: {
    store: any
    theme: any
    winReady: (...args: []) => any
  }
  listeners: Record<string, (callback?) => any | void>
}

// type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
declare interface PageMeta {
  index?: boolean
  label?: string
  title?: string
  icon?: React.ReactNode
  lazy?: boolean
  element?: React.ReactNode
}
declare interface PageRouter extends PageMeta {
  path: string
  menu?: boolean
}

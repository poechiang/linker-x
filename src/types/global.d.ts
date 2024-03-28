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

declare type FCProps = {
  classes?: Record<string, boolean>
  style?: React.CSSProperties
}
declare type FCChildrenProps = FCProps & {
  children?: React.ReactNode
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

declare interface IContact {
  userId?: string
  sendTime?: string
  name?: string
  nickName?: string
  type?: string
  recordHistory?: stirng[]
  avatar?: string
  content?: string | string[]
  state?: 'offline' | 'online'
  gender?: 'female' | 'male'
  favorited?: boolean
}

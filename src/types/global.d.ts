/// <reference types="@electron-toolkit/preload/dist"/>

declare interface IpcRenderer {
  on(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): this
  once(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): this
  removeAllListeners(channel: string): this
  removeListener(channel: string, listener: (...args: any[]) => void): this
  send(channel: string, ...args: any[]): void
  invoke(channel: string, ...args: any[]): Promise<any>
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void
  sendSync(channel: string, ...args: any[]): any
  sendTo(webContentsId: number, channel: string, ...args: any[]): void
  sendToHost(channel: string, ...args: any[]): void
}

declare interface IpcRendererEvent extends Event {
  sender: IpcRenderer
  senderId: number
}

declare interface NodeProcess {
  readonly platform: string
  readonly versions: {
    [key: string]: string | undefined
  }
  readonly env: {
    [key: string]: string | undefined
  }
}

declare interface WebFrame {
  insertCSS(css: string): string
  setZoomFactor(factor: number): void
  setZoomLevel(level: number): void
}
declare interface Window {
  electron?: ElectronAPI

  store: any
  api: {
    ipcRenderer: IpcRenderer
    webFrame: WebFrame
    process: NodeProcess
    openFile?: (filePath: string) => Promise<any>
    openExternal?: (url: string) => Promise<any>
    openDevTools: () => Promise<any>
    closeDevTools?: () => Promise<any>
  }
  listeners: Record<string, (callback?) => any | void>
}

declare type FCProps = {
  className?: string
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
  default?: any
  menu?: any
}
declare interface PageRouter extends PageMeta {
  path?: string
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

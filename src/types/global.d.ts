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

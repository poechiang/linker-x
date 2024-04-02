import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

const store = {
  get(key: string) {
    return ipcRenderer.sendSync('store:read', key)
  },
  set(property: string, val) {
    ipcRenderer.send('store:write', property, val)
  },
}

const api = {
  ...electronAPI,
  openDevTools: () => ipcRenderer.invoke('win:devtools'),
}
const listeners = {
  onThemeUpdated: callback =>
    ipcRenderer.on('theme:updated', (_, ...args) => {
      return callback(...args)
    }),
  offThemeUpdated: callback => ipcRenderer.off('theme:updated', callback),
}
// expose to renderer if context isolation is enableUse otherwise to BOM global
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('store', store)
    contextBridge.exposeInMainWorld('listeners', listeners)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
  window.store = store
  window.listeners = listeners
}

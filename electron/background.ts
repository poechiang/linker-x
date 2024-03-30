import { electronApp, is } from '@electron-toolkit/utils'
import { withTags } from '@jeffchi/logger'
import dotenvFlow from 'dotenv-flow'
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import { join, resolve } from 'path'

const nodeEnvMap = {
  development: 'dev',
  production: 'prod',
  test: 'test',
}

dotenvFlow.config({
  node_env: nodeEnvMap[process.env.NODE_ENV || 'development'],
})

const preload = join(__dirname, './preload.js')
const indexHtml = join(__dirname, './index.html')

let mainWindow: BrowserWindow
const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 1020,
    height: 670,
    minWidth: 820,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'sidebar',
    icon: resolve('build/icon.ico'),

    webPreferences: {
      preload,
      devTools: true,
      sandbox: false,
    },
  })

  win.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)

    return { action: 'deny' }
  })

  const url = process.env.VITE_DEV_SERVER_URL
  if (is.dev && url) {
    win.loadURL(url)
  } else {
    win.loadFile(indexHtml)
  }
  mainWindow = win
}

app.whenReady().then(() => {
  createWindow()

  electronApp.setAppUserModelId('com.electron.linker-x')
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// F12 to open or close DevTools in development
// and ignore CommandOrControl + R in production.
// app.on('browser-window-created', (_, window) => {
//   optimizer.watchWindowShortcuts(window, {
//     escToCloseWindow: false,
//     zoom: false,
//   })
// })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
const storeCache: Record<string, string> = {
  theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
  source: nativeTheme.themeSource,
  coloring: 'polar',
}

const { log } = withTags('store')
ipcMain.on('electron-store-get', (e, key: string) => {
  log(`get ${key}`, storeCache[key])
  e.returnValue = storeCache[key]
})
ipcMain.on('electron-store-set', (e, key: string, value: any) => {
  log(`set ${key}`, value)
  if (key === 'theme' && value) {
    nativeTheme.themeSource = value
    if (value === 'system') {
      value = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    }
  }
  storeCache[key] = value
})
ipcMain.handle('win:devtools', () => {
  mainWindow?.webContents.openDevTools()
})

nativeTheme.on('updated', e => {
  mainWindow?.webContents.send('theme:updated', {
    theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    coloring: storeCache.coloring || 'polar',
    source: nativeTheme.themeSource,
  })
})

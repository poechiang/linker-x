import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import dotenvFlow from 'dotenv-flow'
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import { resolve } from 'path'

const nodeEnvMap = {
  development: 'dev',
  production: 'prod',
  test: 'test',
}

dotenvFlow.config({
  node_env: nodeEnvMap[process.env.NODE_ENV || 'development'],
})
let mainWindow: BrowserWindow
const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 700,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'sidebar',
    icon: resolve('build/icon.ico'),

    webPreferences: {
      preload: resolve('./dist-electron/preload.js'),
      devTools: true, //is.dev,
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
    win.loadFile(resolve(process.env.INDEX || 'dist-electron/index.html'))
  }
  mainWindow = win
}

app.whenReady().then(() => {
  createWindow()
  mainWindow.webContents.openDevTools()
  electronApp.setAppUserModelId('com.electron.linker-x')
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// F12 to open or close DevTools in development
// and ignore CommandOrControl + R in production.
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window, {
    escToCloseWindow: false,
    zoom: false,
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
let cache: Record<string, string> = {}
// theme toggle
ipcMain.on('theme:toggle', (_, { coloring, theme }) => {
  theme && (nativeTheme.themeSource = theme)
  coloring && (cache.coloring = coloring)
})

ipcMain.handle('win:ready', () => ({
  theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
  coloring: cache.coloring || 'polar',
}))

nativeTheme.on('updated', e => {
  mainWindow?.webContents.send('theme:updated', {
    theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    coloring: cache.coloring || 'polar',
    source: nativeTheme.themeSource,
  })
})

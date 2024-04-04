import { electronApp, is } from '@electron-toolkit/utils'
import { withTags } from '@jeffchi/logger'
import { format } from 'date-fns'
import dotenvFlow from 'dotenv-flow'
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import Store from 'electron-store'
import { debounce } from 'lodash'
import { join, resolve } from 'path'

const store = new Store({
  defaults: {
    theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    followSystem: nativeTheme.themeSource === 'system',
    coloring: 'polar',
  },
})

dotenvFlow.config({
  node_env: {
    development: 'dev',
    production: 'prod',
    test: 'test',
  }[process.env.NODE_ENV || 'development'],
})

const preload = join(__dirname, './preload.js')
const indexHtml = join(__dirname, './index.html')

let mainWindow: BrowserWindow
const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 1120,
    height: 670,
    minWidth: 1000,
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

  log('init store theme:', store.get('theme'))
  nativeTheme.themeSource = store.get('theme') as 'dark' | 'light' | 'system'
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

console.log(process.env['HOME'])
const { log } = withTags('store', {
  output: join(
    process.env['HOME']!,
    'Library',
    'Application Support',
    'Linker-X',
    `logs/${format(Date.now(), 'yyyy-MM-dd')}.log`
  ),
})
ipcMain.on('store:read', (e, key: string) => {
  const value = store.get(key)
  log(`get ${key}`, value)
  e.returnValue = value
})
ipcMain.on('store:write', (e, key: string, value: any) => {
  log(`set ${key}`, value)
  if (key === 'theme' && value) {
    nativeTheme.themeSource = value
    if (value === 'system') {
      value = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    }
  }
  store.set(key, value)
})

const storeChangeHandler = debounce(() => {
  mainWindow?.webContents.send('theme:updated', {
    theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    coloring: store.get<string>('coloring'),
    followSystem: nativeTheme.themeSource === 'system',
  })
}, 100)
store.onDidChange('theme', storeChangeHandler)
store.onDidChange('followSystem', storeChangeHandler)

ipcMain.handle('win:devtools', () => {
  mainWindow?.webContents.openDevTools()
})

nativeTheme.on('updated', () => {
  store.set('theme', nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  store.set('followSystem', nativeTheme.themeSource === 'system')
})

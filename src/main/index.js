'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9090`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    webPreferences: { webSecurity: false },
    useContentSize: true,
    resizable: false,
    height: 600,
    width: 540
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // register channel listener
  // set client valid
  ipcMain.on('SET_CLIENT_VALID', (event, payload) => {
    const { data, uuid } = payload
    const { valid = false } = data
    if (valid) {
      mainWindow.setResizable(true)
      mainWindow.setMinimumSize(1024, 768)
      mainWindow.setSize(1024, 768)
      mainWindow.center()
    } else {
      mainWindow.setResizable(false)
      mainWindow.setMinimumSize(540, 600)
      mainWindow.setSize(540, 600)
      mainWindow.center()
    }
    event.sender.send(`SET_CLIENT_VALID_SUCCESS_${uuid}`)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

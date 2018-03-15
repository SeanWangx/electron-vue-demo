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
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    resizable: true,
    height: 600,
    useContentSize: true,
    width: 800
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // register channel listener
  ipcMain.on('TEST_CHANNEL', (event, payload) => {
    mainWindow.setSize(800, 600)
    mainWindow.setMinimumSize(800, 600)
    mainWindow.setResizable(true)
    const { data, uuid } = payload
    event.sender.send(`TEST_CHANNEL_SUCCESS_${uuid}`, data)
  })

  // LOGIN
  ipcMain.on('LOGIN', (event, payload) => {
    // mainWindow.setResizable(true)
    // mainWindow.setMinimumSize(800, 600)
    // mainWindow.setSize(800, 600)
    // mainWindow.center()
    const { data, uuid } = payload
    event.sender.send(`LOGIN_SUCCESS_${uuid}`, data)
  })
  // LOGOUT
  ipcMain.on('LOGOUT', (event, payload) => {
    // mainWindow.setResizable(false)
    // mainWindow.setMinimumSize(350, 500)
    // mainWindow.setSize(350, 500)
    // mainWindow.center()
    const { data, uuid } = payload
    event.sender.send(`LOGOUT_SUCCESS_${uuid}`, data)
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

'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import request from 'request'
import fs from 'fs'

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
    fullscreenable: true,
    maximizable: true,
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
      mainWindow.setMinimumSize(1024, 768)
      mainWindow.setSize(1024, 768)
      mainWindow.setResizable(true)
      mainWindow.center()
    } else {
      mainWindow.setMinimumSize(540, 600)
      mainWindow.setSize(540, 600)
      mainWindow.setResizable(false)
      mainWindow.center()
    }
    event.sender.send(`SET_CLIENT_VALID_SUCCESS_${uuid}`)
  })
  // download file
  ipcMain.on('DOWNLOAD_FILE', (evt, payload) => {
    const { filePath, fileURI } = payload
    let stream = fs.createWriteStream(filePath)
    request(fileURI).on('error', (err) => {
      evt.sender.send('DOWNLOAD_FILE_REPLY', {
        fn: 'error',
        message: filePath
      })
    }).pipe(stream).on('close', () => {
      evt.sender.send('DOWNLOAD_FILE_REPLY', {
        fn: 'success',
        message: filePath
      })
    })
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

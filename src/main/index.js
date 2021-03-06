'use strict'

import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import fs from 'fs'
import download from '../API/download'

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
    const { filePath } = payload
    download(payload, () => {
      // success
      evt.sender.send('DOWNLOAD_FILE_REPLY', {
        fn: 'success',
        message: filePath
      })
    }, (err) => {
      evt.sender.send('DOWNLOAD_FILE_REPLY', {
        fn: 'error',
        message: filePath,
        err
      })
    })
  })
  // directory exist
  ipcMain.on('DIR_EXISTS', (evt, payload) => {
    const { downloadPath } = payload
    let _exists = downloadPath === '' ? true : (
      !!downloadPath === true ? fs.existsSync(downloadPath) : false
    )
    evt.sender.send('DIR_EXISTS_REPLY', {
      exists: _exists,
      downloadPath
    })
  })

  let template = [
    {
      label: 'Application',
      submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() } }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
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

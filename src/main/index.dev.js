/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Set environment for development
process.env.NODE_ENV = 'development'
const { app, ipcMain } = require('electron')
// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })

  ipcMain.on('async-msg', (event, arg) => {
    setTimeout(() => {
      event.sender.send('async-msg-reply', `[reply] - ${arg} - ${new Date().getTime()}`)
    }, 3000)
  })
})

// Require `main` process to boot app
require('./index')

import fs from 'fs'
import url from 'url'
import http from 'http'

function download (payload, success, fail) {
  let { filePath, fileURI } = payload
  fileURI = encodeURI(fileURI)
  let options = {
    host: url.parse(fileURI).host,
    path: url.parse(fileURI).pathname
  }
  let file = fs.createWriteStream(filePath)
  http.get(options, function (res) {
    res.on('data', function (data) {
      file.write(data)
    }).on('end', function () {
      file.end()
      success()
    }).on('error', function (err) {
      file.end()
      fail(err)
    })
  })
}

export default download

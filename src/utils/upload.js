/**
 * 对腾讯云上传文件进行封装
 */

export default {
  handleImageAdded: function(options, callback) {
    let Bucket = 'chat'
    let Appid = '1252042681'
    let Region = 'ap-shanghai'
    let prefix = 'http://' + Bucket + '-' + Appid + '.cos.' + Region + '.myqcloud.com/'
    
    let method = (options.Method || 'get').toLowerCase()
    let key = options.Key || ''
    console.log(options)
    let pathname = key.indexOf('/') === 0 ? key : '/' + key
    let url = 'http://127.0.0.1:5000/auth'
    let xhr = new XMLHttpRequest()
    let data = {
      method: method,
      pathname: pathname,
    }
    xhr.open('POST', url, true)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onload = function (e) {
      if (e.target.responseText === 'action deny') {
        alert('action deny')
      } else {
        console.log(e.target)
        callback(e.target.responseText)
      }
    }
    xhr.send(JSON.stringify(data))
  },

  uploadHandle: function(file, callback) {
    // An example of using FormData
    // NOTE: Your key could be different such as:
    // let formData = new FormData()
    // formData.append('image', file)

    let Bucket = 'chat'
    let Appid = '1252042681'
    let Region = 'ap-shanghai'
    let prefix = 'http://' + Bucket + '-' + Appid + '.cos.' + Region + '.myqcloud.com/'
    if (!file.name) {
      file = file.file
    }
    let key = '' + file.name

    console.log(file, key)

    this.handleImageAdded({Method: 'PUT', Key: key}, function(auth) {
      console.log(auth)

      let url = prefix + key
      console.log(url)
      let xhr = new XMLHttpRequest()
      xhr.open('PUT', url, true)
      xhr.setRequestHeader('Authorization', auth)
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 206) {
          let ETag = xhr.getResponseHeader('etag')
          console.log(xhr, xhr.responseURL, ETag)
          let url = xhr.responseURL // Get url from response
          callback(null, url)
        } else {
          console.log('文件 ' + key + ' 上传失败，状态码：' + xhr.status)
          callback(' 上传失败，状态码：' + xhr.status)
        }
      }
      xhr.onerror = function () {
        console.log('文件 ' + key + ' 上传失败，请检查是否没配置 CORS 跨域规则')
        callback('上传失败，请检查是否没配置 CORS 跨域规则')
      }
      xhr.send(file)
    })
  }
}
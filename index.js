/* jslint browser: false */
'use strict'

const url = require('url')

// ============================================================================
// Helpers

// Returns a copy of the object
function copy (object, dest) {
  return Object.keys(object).reduce((o, key) => {
    o[key] = object[key]
    return o
  }, dest || {})
}

// Content types we parse as JSON
const contentTypes = {
  'application/json': true
}

// Checks if the given content type is one we accept
// Note: NodeJS makes HTTP headers lower case by default
function inContentTypes (type) {
  type += ''
  return Object.keys(contentTypes).some(ct => type.includes(ct) && contentTypes[ct])
}

// Returns HTTP response callback
const response = (function () {
  const CT = 'content-type'

  function data (o, d) {
    if (undefined === o.body) {
      o.body = ''
    }
    o.body += d
  }

  function end (o, callback, res) {
    // Parse accepted content types as JSON
    if (!inContentTypes(res.headers[CT])) {
      throw new Error(`Conten type ${res.headers[CT]}` +
                      `failed the check against ${JSON.stringify(contentTypes)}`)
    }
    let data = {body: JSON.parse(o.body), res: res}
    callback(data)
  }

  return function (callback, res) {
    let o = {
      body: undefined
    }

    res.setEncoding('utf8')
            .on('data', data.bind(undefined, o))
            .on('end', end.bind(undefined, o, callback, res))
  }
}())

// Returns a HTTP method
function method (opt, path, data, callback) {
    // Check permutation of arguments
  if (typeof path === 'function') {
    callback = path
    path = undefined
    data = undefined
  } else if (typeof data === 'function') {
    callback = data
    if (typeof path === 'string') {
      data = undefined
    } else {
      data = path
      path = undefined
    }
  }

  // Add path if any
  if (path) {
    opt = copy(opt)
    opt.path += path
  }

  const res = response.bind(undefined, callback)
  const req = this.http.request(opt, res)

  req.on('error', e => { throw e })

  if (typeof data === 'object' && data !== null) {
    req.write(JSON.stringify(data))
  }

  req.end()
}

// ============================================================================
//

function Remote (uri, opt) {
  const parsed = url.parse(uri)
  opt = copy({
    host: parsed.host,
    path: parsed.path
  }, opt)
  opt.headers = opt.headers || {}
  opt.headers['Content-Type'] = 'application/json'

  switch (parsed.protocol) {
    case 'https:':
      if (!module.exports.https) {
        module.exports.https = require('https')
      }
      this.http = module.exports.https
      break
    case 'http:':
      if (!module.exports.http) {
        module.exports.http = require('http')
      }
      this.http = module.exports.http
      break
    default:
      throw new Error('Not supported protocol: ' + parsed.protocol)
  }

  // Constructors of HTTP methods
  // this.post = method.bind(this, copy(opt, {method: 'POST'}))
  // this.get = method.bind(this, copy(opt, {method: 'GET'}))
  // this.put = method.bind(this, copy(opt, {method: 'PUT'}))
  // this.del = method.bind(this, copy(opt, {method: 'DELETE'}))
  // this.patch = method.bind(this, copy(opt, {method: 'PATCH'}))
  this.get = function (path, data) {
    return new Promise((resolve) => {
      return method.bind(this, copy(opt, {method: 'GET'}))(path, data, resolve)
    })
  }
}

// ============================================================================
// Module exports
module.exports = function (uri, opt) {
  return new Remote(uri, opt)
}

module.exports.contentTypes = contentTypes

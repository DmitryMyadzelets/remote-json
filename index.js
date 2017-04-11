/*jslint browser: false*/
'use strict';

var url = require('url');


// ============================================================================
// Helpers


// Returns a copy of the object
function copy(object, dest) {
    return Object.keys(object).reduce(function (o, key) {
        o[key] = object[key];
        return o;
    }, dest || {});
}


// HTTP response callback
function response(cb, res) {
    var body;

    function data(d) {
        if (undefined === body) {
            body = '';
        }
        body += d;
    }

    function end() {
        // Parse body as JSON if necessary
        const type = '' + res.headers['content-type'];
        const isJSON = type.includes('application/json');
        if (isJSON) {
            try {
                body = JSON.parse(body);
            } catch (err) {
                cb(err);
            }
        }
        cb(null, res, body);
        body = null;
    }

    res.setEncoding('utf8').on('data', data).on('end', end);
}


// Template for REST methods
function method(opt, data, cb, path) {
    if ('function' === typeof data) {
        cb = data;
        data = undefined;
    }
    // Add path if any
    if (path) {
        opt = copy(opt);
        opt.path += path;
    }
    const req = this.http.request(opt, response.bind(this, cb));
    req.on('error', cb);
    if (undefined !== data) {
        req.write(JSON.stringify(data));
    }
    req.end();
    return this;
}


// ============================================================================
//
function Remote(http, uri, opt) {
    this.http = http;

    const parsed = url.parse(uri);
    this.options = {
        get: copy({
            host: parsed.host,
            path: parsed.path,
            headers: {
                'Content-Type': 'application/json'
            }
        }, opt)
    };
    this.options.post = copy(this.options.get, {method: 'POST'});
    this.options.put = copy(this.options.get, {method: 'PUT'});
    this.options.patch = copy(this.options.get, {method: 'PATCH'});
    this.options.del = copy(this.options.get, {method: 'DELETE'});
}


Remote.prototype.get = function (data, cb, path) {
    return method.call(this, this.options.get, data, cb, path);
};

Remote.prototype.post = function (data, cb, path) {
    return method.call(this, this.options.post, data, cb, path);
};

Remote.prototype.put = function (data, cb, path) {
    return method.call(this, this.options.put, data, cb, path);
};

Remote.prototype.patch = function (data, cb, path) {
    return method.call(this, this.options.patch, data, cb, path);
};

Remote.prototype.del = function (data, cb, path) {
    return method.call(this, this.options.del, data, cb, path);
};


// ============================================================================
// Module exports
exports.remote = function (http, uri) {
    return new Remote(http, uri);
};

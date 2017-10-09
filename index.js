/*jslint browser: false*/
'use strict';

const url = require('url');


// ============================================================================
// Helpers

// Returns a copy of the object
function copy(object, dest) {
    return Object.keys(object).reduce(function (o, key) {
        o[key] = object[key];
        return o;
    }, dest || {});
}


// Content types we parse as JSON
const contentTypes = {
    'application/json': true
};


// Checks if the given content type is one we accept
// Note: NodeJS makes HTTP headers lower case by default
function inContentTypes(type) {
    type += '';
    return Object.keys(contentTypes).some(function (ct) {
        return type.includes(ct);
    });
}


// Returns HTTP response callback
const response = (function () {
    const CT = 'content-type';

    function data(d) {
        if (undefined === this.body) {
            this.body = '';
        }
        this.body += d;
    }

    function end(callback, res) {
        // Parse accepted content types as JSON
        if (inContentTypes(res.headers[CT])) {
            try {
                this.body = JSON.parse(this.body);
            } catch (err) {
                callback(err);
            }
        }
        callback(null, res, this.body);
        this.body = null;
    }

    return function (callback, res) {
        const o = {
            body: undefined
        };

        res.setEncoding('utf8')
            .on('data', data.bind(o))
            .on('end', end.bind(o, callback, res));
    };
}());


// Returns a HTTP method
function method(opt, path, callback) {
    if ('function' === typeof path) {
        callback = path;
        path = undefined;
    }

    // Add path if any
    if (path) {
        opt = copy(opt);
        opt.path += path;
    }

    const res = response.bind(this, callback);
    const self = this;
    var req;

    function request(data) {
        req = self.http.request(opt, res);
        req.on('error', callback);
        if (undefined !== data) {
            req.write(JSON.stringify(data));
        }
        req.end();
        return request;
    }
    return request;
}

// ============================================================================
//
function Remote(http, uri, opt) {
    this.http = http;

    const parsed = url.parse(uri);
    opt = copy({
        host: parsed.host,
        path: parsed.path
    }, opt);
    opt.headers = opt.headers || {};
    opt.headers['Content-Type'] = 'application/json';

    // Constructors of HTTP methods
    this.post = method.bind(this, copy(opt, {method: 'POST'}));
    this.get = method.bind(this, copy(opt, {method: 'GET'}));
    this.put = method.bind(this, copy(opt, {method: 'PUT'}));
    this.del = method.bind(this, copy(opt, {method: 'DELETE'}));
    this.patch = method.bind(this, copy(opt, {method: 'PATCH'}));
}

// ============================================================================
// Module exports
module.exports = function (http, uri, opt) {
    return new Remote(http, uri, opt);
};

module.exports.contentTypes = contentTypes;
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
        return type.includes(ct) && contentTypes[ct];
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
        if (!inContentTypes(res.headers[CT])) {
            callback(new Error('Content type \"'
                    + res.headers[CT]
                    + '\" failed the check against '
                    + JSON.stringify(contentTypes)), res, this.body);
        }
        try {
            this.body = JSON.parse(this.body);
        } catch (err) {
            callback(err, res, this.body);
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
function method(opt, path, data, callback) {
    // Check permutation of arguments
    if ('function' === typeof path) {
        callback = path;
        path = undefined;
        data = undefined;
    } else if ('function' === typeof data) {
        callback = data;
        if ('string' === typeof path) {
            data = undefined;
        } else {
            data = path;
            path = undefined;
        }
    }

    // Add path if any
    if (path) {
        opt = copy(opt);
        opt.path += path;
    }

    const res = response.bind(this, callback);
    const req = this.http.request(opt, res);

    req.on('error', callback);

    if ('object' === typeof data && data !== null) {
        req.write(JSON.stringify(data));
    }

    req.end();
}

// ============================================================================
//

function Remote(uri, opt) {
    const parsed = url.parse(uri);
    opt = copy({
        host: parsed.host,
        path: parsed.path
    }, opt);
    opt.headers = opt.headers || {};
    opt.headers['Content-Type'] = 'application/json';

    // Set required protocol (http is default)
    if ('https' === parsed.protocol) {
        if (!module.exports.https) {
            module.exports.https = require('https');
        }
        this.http = module.exports.https;
    } else {
        if (!module.exports.http) {
            module.exports.http = require('http');
        }
        this.http = module.exports.http;
    }

    // Constructors of HTTP methods
    this.post = method.bind(this, copy(opt, {method: 'POST'}));
    this.get = method.bind(this, copy(opt, {method: 'GET'}));
    this.put = method.bind(this, copy(opt, {method: 'PUT'}));
    this.del = method.bind(this, copy(opt, {method: 'DELETE'}));
    this.patch = method.bind(this, copy(opt, {method: 'PATCH'}));
}

// ============================================================================
// Module exports
module.exports = function (uri, opt) {
    return new Remote(uri, opt);
};

module.exports.contentTypes = contentTypes;

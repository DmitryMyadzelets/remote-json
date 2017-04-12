/*jslint browser: false*/
'use strict';

const http = require('http');
const https = require('https');
const assert = (function () {
    var cnt = 0;
    return function () {
        require('assert').apply(this, arguments);
        cnt += 1;
        console.log('passed ' + cnt);
    };
}());

// Ignore HTTPS warnings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


console.log('Expected ' + 25 + ' tests passed');


const remote = require('../').remote;
const json = remote(https, 'https://jsonplaceholder.typicode.com/posts');


json.get(function (err, res, body) {
    assert(!err);
    assert(200 === res.statusCode);
    assert(body instanceof Array);
})();

json.post(function (err, res, body) {
    assert(!err);
    assert(201 === res.statusCode);
    assert(true === body.ok);
})({ok: true});

json.put('/1', function (err, res, body) {
    assert(!err);
    assert(200 === res.statusCode);
    assert(true === body.ok);
    assert(1 === body.id);
})({ok: true});

json.patch('/2', function (err, res, body) {
    assert(!err);
    assert(200 === res.statusCode);
    assert(true === body.ok);
    assert('string' === typeof body.title);
    assert(2 === body.id);
})({ok: true});

json.del('/3', function (err, res, body) {
    assert(!err);
    assert(200 === res.statusCode);
    assert(!!body);
})();


// Some additional tests
(function () {

    remote(https, 'https://wrong.address').get(function (err) {
        assert(err instanceof Error);
    })();

    remote(http, 'http://echo.jsontest.com/key/value/one/two').get(function (err, res, body) {
        assert(!err);
        assert(200 === res.statusCode);
        assert('object' === typeof body);
    })();

    remote(http, 'http://validate.jsontest.com/?json=%7B%22key%22:%22value%22').get(function (err, res, body) {
        assert(!err);
        assert(200 === res.statusCode);
        assert('This error came from the org.json reference parser.' === body.error_info);
    })();

}());

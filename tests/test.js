/* jslint browser: false */
'use strict'

const assert = (function () {
  var cnt = 0
  return function () {
    require('assert').apply(this, arguments)
    cnt += 1
    console.log('passed ' + cnt)
  }
}())

// Ignore HTTPS warnings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

console.log('Expected ' + 26 + ' tests passed')

const remote = require('../')
const json = remote('https://jsonplaceholder.typicode.com/posts')

// Called when an unexpected error is catched
const expectNoError = err => {
  console.log(err)
}

json.get()
  .then(({body, res}) => {
    assert(res.statusCode === 200)
    assert(body instanceof Array)
  })
  .catch(expectNoError)

// json.get(function (err, res, body) {
//     assert(!err);
//     assert(200 === res.statusCode);
//     assert(body instanceof Array);
// });

// json.post({ok: true}, function (err, res, body) {
//     assert(!err);
//     assert(201 === res.statusCode);
//     assert(true === body.ok);
// });

// json.put('/1', {ok: true}, function (err, res, body) {
//     assert(!err);
//     assert(200 === res.statusCode);
//     assert(true === body.ok);
//     assert(1 === body.id);
// });

// json.patch('/2', {ok: true}, function (err, res, body) {
//     assert(!err);
//     assert(200 === res.statusCode);
//     assert(true === body.ok);
//     assert('string' === typeof body.title);
//     assert(2 === body.id);
// });

// json.del('/3', function (err, res, body) {
//     assert(!err);
//     assert(200 === res.statusCode);
//     assert(!!body);
// });

// // Some additional tests
// (function () {

//     remote('https://wrong.address').get(function (err) {
//         assert(err instanceof Error);
//     });

//     remote('http://echo.jsontest.com/key/value/one/two').get(function (err, res, body) {
//         assert(!err);
//         assert(200 === res.statusCode);
//         assert('object' === typeof body);
//     });

//     remote('http://validate.jsontest.com/?json=%7B%22key%22:%22value%22').get(function (err, res, body) {
//         assert(!err);
//         assert(200 === res.statusCode);
//         assert('This error came from the org.json reference parser.' === body.error_info);
//     });

//     // Check the protocol should be valid
//     try {
//         remote('ftp://wrong.protocol.com');
//     } catch (e) {
//         assert(e.message === 'Not supported protocol: ftp:');
//     }

// }());

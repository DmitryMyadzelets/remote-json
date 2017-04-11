# remote-json

Node.js HTTP/HTTPS client for JSON APIs. Supports `GET`, `PUT`, `POST` and `PATCH` methods.

    npm install('remote-json')

## Usage

```javascript
var http = require('http');
var json = require('remote-json');

json.remote(http, 'http://echo.jsontest.com/key/value/name/Bob')
    .get(function (err, res, body) {
        console.log(res.statusCode); // 200
        console.log(body); // {"name": "Bob", "key": "value"}
    });
```

## API

### remote(http, url[, opt])
Returns a new instance of `Remote` object with JSON API's methods.

- `http` - Should be either `http` or `https` Node.js modules.
- `url` - A full URL string.
- `opt` - A HTTP options object.

### Remote.get([object,] callback[, path])

- `object` - Optional. If given, will be send as JSON with request.
- `callback` - Callback function.
- `path` - Optional. A path which will be added to the URL.

If `path` is present, then `object` is required. E.g the following requests are valid:

```javascript
remote(http, 'http://json.api')
    .get(callback)
    .get({id: 123}, callback)
    .get({id: 123}, callback, '/users'); // GET 'http://json.api/users'
```

### Remote.[post, put, del, patch]
The parameters for these methods are similar to the ones of the `.get` method.

## HTTP options
The options are created for each method. For example:

```javascript
var remote = require('json-remote').remote;
var obj = remote(http, `http://echo.jsontest.com/key/value/name/Bob`);
console.log(obj.options.put);
// {
//     method: 'PUT',
//     host: 'echo.jsontest.com',
//     path: '/key/value/name/Bob',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }
```
You can modify them. Remember, that if you can set options for all methods in the constructor `remote(http, url , opt)`.

## Tests

    npm test

Tests use online services: 

- https://jsonplaceholder.typicode.com
- http://echo.jsontest.com

They may be down for the momemnt you test this module.

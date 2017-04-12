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
    })();
```

## API

### remote(http, url[, opt])
Returns a new instance of `Remote` object with JSON API's methods.

- `http` - Should be either `http` or `https` Node.js modules.
- `url` - A full URL string.
- `opt` - A HTTP options object.

### Remote.get([path,] callback)
Returns a function for `GET` method.

- `path` - Optional. A path which will be added to the URL.
- `callback` - Callback function.

You can than invoke the method immediately or, if used many times, assign to a variable:
```javascript
remote(http, 'http://json.api').get(callback)();
// or
var get = remote(http, 'http://json.api').get(callback);
get();
```
Many paths at one remote:
```javascript
var remote = remote(http, 'http://json.api');
remote.get('/users', callbackUsers)();
remote.get('/books', callbackBooks)();
```
Send data on request:
```javascript
var get = remote.get('/users', callback);
get({id: 123});
get({id: 456})({id: 78});
```

### Remote.[post, put, del, patch]
Usage for these methods is similar to the one of the `.get` method.

### HTTP options

Pass it to the constructor:
```javascript
remote(http, 'http://json.api', {
    headers: {
        Cookie: 'Your cookie'
    }
});
```

## Tests

    npm test

Tests use online services: 

- https://jsonplaceholder.typicode.com
- http://echo.jsontest.com

They may be down for the momemnt you test this module.

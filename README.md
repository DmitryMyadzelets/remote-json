# remote-json

Node.js HTTP/HTTPS client for JSON APIs. Supports `GET`, `PUT`, `POST`, `DELETE` and `PATCH` methods.

    npm install('remote-json')

## Usage

```javascript
var remote = require('remote-json');

remote('http://echo.jsontest.com/key/value/name/Bob')
    .get(function (err, res, body) {
        console.log(res.statusCode); // 200
        console.log(body); // {"name": "Bob", "key": "value"}
    });
```

## API

### remote(url[, opt])
Returns a new instance of `Remote` object with JSON API's methods.

- `url` - A full URL string.
- `opt` - A HTTP options object.

### Remote.get([path,][data,] callback)
Returns a function for `GET` method.

- `path` - Optional. A path which will be added to the URL.
- `data` - Optional. A data wich will be send with request.
- `callback` - Callback function.

Many paths at one remote:
```javascript
var remote = remote('http://json.api');
remote.get('/users', callbackUsers);
remote.get('/books', callbackBooks);
```
Send data on request:
```javascript
remote.get('/users', {id: 123}, callback);
remote.get('/users', {id: 78}, callback);
```

### Remote.[post, put, del, patch]
Usage for these methods is equal to the one of the `.get` method.

## HTTP options

Pass it to the constructor:
```javascript
remote('http://json.api', {
    headers: {
        Cookie: 'Your cookie'
    }
});
```

## Redirects

This client doesn't follow redirects. Use the [`follow-redirects`](https://www.npmjs.com/package/follow-redirects) module for this:

```javascript
redirect.http = require('follow-redirects').http;
redirect.https = require('follow-redirects').https;
```

## Tests

    npm test

The tests use online services:

- https://jsonplaceholder.typicode.com
- http://echo.jsontest.com

They may be down for the momemnt you test this module.

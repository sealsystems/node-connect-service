# @sealsystems/connect-service

[![CircleCI](https://circleci.com/gh/sealsystems/seal-connect-service.svg?style=svg)](https://circleci.com/gh/sealsystems/seal-connect-service)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/d7djlcycod4jhj4i?svg=true)](https://ci.appveyor.com/project/Plossys/seal-connect-service)

Connects to a service with given host name and port number.

## Installation

```bash
$ npm install @sealsystems/connect-service
```

## Quick start

First you need to add a reference to @sealsystems/connect-service within your application.

```javascript
const connectService = require('@sealsystems/connect-service');
```

**Please note:** A connection to consul must already exist before you can use the module.

To create a HTTP/HTTPS connection to an instance of a service (e.g. `myService`), use:

```javascript
const client = await connectService({
  service: 'myService',
  path: '/job'
}, {
  name: 'hostname',
  port: 3000
});

client.on('response', (response) => {
  console.log(`Response status: ${response.statusCode}`);
});

client.write('Hello service!');
client.end();
```

The first parameter is an `options` object that can contain the following properties:

| property  | type            | description                        |
|-----------|-----------------|------------------------------------|
| service   | required string | Name of the service to access      |
| headers   | optional object | Additional HTTP/HTTPS headers      |
| method    | optional string | HTTP/HTTPS method, default `POST`  |
| path      | optional string | URL-path to access, default `/`    |

Here is an example of a more complete `options` object:

```javascript
const options = {
  headers: {
    'content-type': 'application/json'
  },
  method: 'POST',
  path: '/url/path',
  service: 'myService'
};
```

Second parameter is the host name and port number. Example:

```javascript
const host = {
  name: 'hostname',
  port: 3000
};
```

The return value `client` contains a [http.ClientRequest](https://nodejs.org/api/http.html#http_class_http_clientrequest) object for further use.

## HTTP and HTTPS

The protocol used for a connection depends on the target (local or remote) and the value of the environment variable TLS_UNPROTECTED. The TLS certificates provided by `seal-tlscert` will be used for HTTPS connections. It is not possible to override the chosen protocol.

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```bash
$ bot
```

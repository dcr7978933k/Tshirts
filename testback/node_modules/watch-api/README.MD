# watch-api
## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install watch-api
```

## API

```js
const logger = require('watch-api')
```
### Middleware Monitoring

With the latest version, you can monitor individual middleware latency. Just use the logger middleware again to indicate the middleware end.

```js
const  express  =  require('express');
const  helmet  =  require('helmet');
const  compression  =  require('compression');
const  logger  =  require('watch-api');

const  app  =  express();

app.use(logger); // place at top to get accurate response time
app.use(helmet());
app.use(logger); // calculates the time spent in helmet middleware
app.use(compression());
app.use(logger); // calculates the time spent in compression middleware
```

## Example

A simple example using `watch-api` to log api response time and status.

```js
const express = require('express');
const logger = require('watch-api');

const app = express();

app.use(logger); //place at top to get accurate response time

app.get('/foo', function (req, res, next) {
  res.send('Have a good day!');
});

app.get('/bar', function (req, res, next) {
  res.send('Have a good night!')
});

app.listen(3070,()=>{});
```
## Console Output
![console output](console_example_1.0.2.png)

## License

[MIT](LICENSE)
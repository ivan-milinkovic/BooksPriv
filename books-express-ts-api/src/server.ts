import serverConfig from './config';
import express from 'express';
import logger from 'morgan';
// import http from 'http';
import { Request, Response, NextFunction } from 'express';
import { books } from './data';
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');

var app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req: Request, res: Response) => {
  res.send('root');
});

app.get('/books', async (req: Request, res: Response) => {
  res.send(books);
});

app.use(function (req: Request, res: Response, next: NextFunction) {
  const err = createError(404);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.end();
});

app.listen(serverConfig.port, (err?: Error) => {
  err && console.error(`error: ${err}`);
  console.log(`Listegning on port: ${serverConfig.port}`);
});

/*
app.set('port', serverConfig.port);
var server = http.createServer(app);

server.on('error', function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(serverConfig.port + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(serverConfig.port + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', function onListening() {
  console.log('Listening on ' + serverConfig.port);
});

server.listen(serverConfig.port);
*/

import serverConfig from './config';
import express from 'express';
import logger from 'morgan';
// import http from 'http';
import { Request, Response, NextFunction } from 'express';
import { adultGenres, authors, books, childrenGenres } from './data';
import { Genres } from './model';
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
const rootPath = path.join(__dirname, '../');

var app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(rootPath, '/public')));

app.get('/', async (req: Request, res: Response) => {
  res.send('root');
});

app.get('/authors', async (req: Request, res: Response) => {
  res.send(authors);
});

app.get('/genres', async (req: Request, res: Response) => {
  res.status(200);
  const genres: Genres = {
    children: childrenGenres,
    adult: adultGenres,
  };
  res.send(genres);
});

app.get('/books', async (req: Request, res: Response) => {
  res.status(200);
  res.send(books);
});

app.get('/books/:bookId', async (req: Request, res: Response) => {
  console.log(req.params);
  const { bookId } = req.params;
  const bookIdNum = Number(bookId);
  if (Number.isNaN(bookIdNum)) {
    res.status(400);
    res.end();
    return;
  }
  const book = books.find((b) => b.id === bookIdNum);
  if (!bookId) {
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.send(book);
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
  console.log(`Listening on port: ${serverConfig.port}`);
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

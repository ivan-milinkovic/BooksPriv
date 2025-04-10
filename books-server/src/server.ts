import serverConfig from './config';
import express from 'express';
import logger from 'morgan';
// import http from 'http';
import { Request, Response, NextFunction } from 'express';
import {
  adminUser,
  adultGenres,
  authors,
  books,
  childrenGenres,
  guestUserInfo,
} from './data';
import { BooksResponse, BooksSession, Cursor, Genres, UserInfo } from './model';
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

app.post('/login', async (req: Request, res: Response) => {
  if (
    req.body.email !== adminUser.email ||
    req.body.password !== adminUser.password
  ) {
    res.status(401);
    res.end();
    return;
  }
  const booksSession: BooksSession = { email: adminUser.email };
  const sessionString = JSON.stringify(booksSession);
  res.cookie(serverConfig.sessionCookieName, sessionString, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.end();
});

app.get('/logout', async (req: Request, res: Response) => {
  res.clearCookie(serverConfig.sessionCookieName);
  res.status(200);
  res.end();
});

app.get('/whoami', async (req: Request, res: Response) => {
  const sessionString = req.cookies[serverConfig.sessionCookieName];
  if (!sessionString) {
    res.send(guestUserInfo);
    return;
  }
  const booksSession: BooksSession = JSON.parse(sessionString);
  if (!booksSession) {
    res.send(guestUserInfo);
    return;
  }
  const userInfo: UserInfo = {
    email: booksSession.email,
    isGuest: false,
  };
  res.send(userInfo);
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

app.get('/bookspage', async (req: Request, res: Response) => {
  const pageIndex = Number(req.query.pageIndex);
  const pageSize = Number(req.query.pageSize);
  if (Number.isNaN(pageIndex) || Number.isNaN(pageSize)) {
    res.status(400);
    res.end();
    return;
  }

  const start = pageIndex * pageSize;
  const resBooks = books.slice(start, start + pageSize);

  const booksResponse: BooksResponse = {
    pageIndex: pageIndex,
    pageSize: resBooks.length,
    books: resBooks,
  };

  res.status(200);
  res.send(booksResponse);
});

app.get('/bookspage-cursor', async (req: Request, res: Response) => {
  let nextCursor: Cursor;
  if (req.query.cursor) {
    const inEncodedJsonCursor = req.query.cursor as string;
    const inJsonCursor = decodeURIComponent(inEncodedJsonCursor);
    const inCursor = JSON.parse(inJsonCursor) as Cursor;
    console.log('query cursor: ', inCursor);

    const dir = req.query.dir;
    const step = dir === 'prev' ? -1 : 1;

    nextCursor = {
      pageIndex: inCursor.pageIndex + step,
      pageSize: inCursor.pageSize,
    };
  } else {
    nextCursor = {
      pageIndex: 0,
      pageSize: 10,
    };
  }

  const json = JSON.stringify(nextCursor);
  const enc = encodeURIComponent(json);

  res.status(200);
  res.send(enc);
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

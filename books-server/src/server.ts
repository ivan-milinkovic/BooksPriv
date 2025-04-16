import { serverConfig, rootPath, sessionCookieName } from './config';
import express from 'express';
import logger from 'morgan';

import { Request, Response, NextFunction } from 'express';
import {
  addAuthor,
  adminUser,
  adultGenres,
  authors,
  childrenGenres,
  guestUserInfo,
} from './data';
import { Author, BooksSession, Genres, UserInfo } from './model';
import path from 'node:path';
import { tryGetSession } from './sessionUtil';
import booksRouter from './routes/booksRoute';

var createError = require('http-errors');
var cookieParser = require('cookie-parser');

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
  res.cookie(sessionCookieName, sessionString, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.end();
});

app.get('/logout', async (req: Request, res: Response) => {
  res.clearCookie(sessionCookieName);
  res.status(200);
  res.end();
});

app.use('/books', booksRouter);

app.get('/whoami', async (req: Request, res: Response) => {
  const booksSession = tryGetSession(req, res);
  if (booksSession) {
    const userInfo: UserInfo = {
      email: booksSession.email,
      isGuest: false,
    };
    res.send(userInfo);
  } else {
    res.send(guestUserInfo);
  }
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

export type AddAuthorDto = {
  id: number;
  name: string;
  bio: string;
  dateOfBirth: Date;
};

app.post('/authors', async (req: Request, res: Response) => {
  const body = req.body;
  const newAuthor: Author = {
    id: authors.length,
    name: body.name,
    bio: body.bio,
    dateOfBirth: new Date(body.dateOfBirth),
  };
  if (tryGetSession(req, res) === null) {
    res.status(401);
    res.end();
    return;
  }
  addAuthor(newAuthor);
  res.status(200);
  res.send(newAuthor);
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

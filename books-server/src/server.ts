import express from 'express';
import logger from 'morgan';
import path from 'node:path';
import booksRouter from './routes/booksRouter';
import authRouter from './routes/authRouter';
import { serverConfig, rootPath, sessionCookieName } from './config';
import { Request, Response, NextFunction } from 'express';
import { addAuthor, authors } from './data';
import { Author, Genres } from './model';
import { tryGetSession } from './sessionUtil';
import genresRouter from './routes/genresRouter';

var createError = require('http-errors');
var cookieParser = require('cookie-parser');

var app = express();

// middleware
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(rootPath, '/public')));

// endpoints
app.use('/', authRouter);
app.use('/', booksRouter);
app.use('/', genresRouter);

app.get('/authors', async (req: Request, res: Response) => {
  res.send(authors);
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

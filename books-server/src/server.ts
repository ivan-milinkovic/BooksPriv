import express from 'express';
import logger from 'morgan';
import path from 'node:path';
import booksRouter from './routes/booksRouter';
import authRouter from './routes/authRouter';
import genresRouter from './routes/genresRouter';
import authorsRouter from './routes/authorsRouter';
import { serverConfig, rootPath } from './config';
import { Request, Response, NextFunction } from 'express';

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
app.use('/', authorsRouter);
app.use('/', genresRouter);

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

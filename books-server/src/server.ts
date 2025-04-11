import serverConfig from './config';
import express from 'express';
import logger from 'morgan';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import {
  adminUser,
  adultGenres,
  authors,
  books,
  childrenGenres,
  guestUserInfo,
  setBooks,
} from './data';
import {
  Book,
  BooksResponse,
  BooksSession,
  Cursor,
  Genres,
  UserInfo,
} from './model';
var createError = require('http-errors');
// var path = require('path');
import path from 'node:path';
var cookieParser = require('cookie-parser');
const rootPath = path.join(__dirname, '../');

const multerBookImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rootPath + '/public/images');
  },
  filename: function (req, file, cb) {
    const suffixStr = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const suffix = encodeURIComponent(suffixStr);
    const name = file.fieldname + '-' + suffix;
    const ext = path.extname(file.originalname);
    let filename = name;
    if (ext) filename += ext;
    cb(null, filename);
  },
});
const multerUploadBookImage = multer({ storage: multerBookImageStorage });

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

type CreateBookDto = {
  title: string;
  isbn: string;
  price: string;
  quantity: string;
  publishDate: Date;
  pageCount: number;
  genres: string; // comma separated genre ids, id = genre name
  authors: string; // comma separated  author ids
  forChildren: boolean;
  description: string;
};

app.post(
  '/books',
  multerUploadBookImage.single('image'),
  async (req: Request, res: Response) => {
    const inputs = req.body as CreateBookDto;
    const genres = inputs.genres.split(',').map((e) => e.trim());
    const authorIds = inputs.authors.split(',').map((e) => Number(e.trim()));
    let bookAuthors = authors.filter((a) => authorIds.includes(a.id));

    const newBook: Book = {
      id: books[books.length - 1].id + 1,
      title: inputs.title,
      isbn: inputs.isbn,
      price: Number(inputs.price),
      quantity: Number(inputs.quantity),
      publishDate: new Date(inputs.publishDate),
      pageCount: inputs.pageCount,
      genres: genres,
      authors: bookAuthors,
      forChildren: inputs.forChildren,
      image: req.file ? '/public/images/' + req.file.filename : null,
      description: inputs.description,
    };

    setBooks([...books, newBook]);

    // console.log(req.body);
    // console.log(req.file);

    res.end();
  },
);

/*
{
  fieldname: 'image',
  originalname: 'book-1283865_640.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: <Buffer ff d8 ff e0 00 10 4a  ... 47883 more bytes>,
  size: 47933
}
*/

app.delete('/books', async (req: Request, res: Response) => {
  const ids = req.body as number[];
  if (!ids) {
    res.status(400);
    res.end();
    return;
  }
  setBooks(books.filter((b) => !ids.includes(b.id)));
  res.status(200);
  res.end();
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

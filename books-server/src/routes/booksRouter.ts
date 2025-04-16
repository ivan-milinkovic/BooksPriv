import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import checkAuthHandler from '../sessionUtil';
import { authors, books, setBooks } from '../genData';
import { Book, BooksResponse, Cursor } from '../model';
import { rootPath } from '../config';

const booksRouter = express.Router();

// Setup book image upload
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

booksRouter.get('/books', async (req: Request, res: Response) => {
  const pageIndex = Number(req.query.pageIndex);
  const pageSize = Number(req.query.pageSize);
  if (Number.isNaN(pageIndex) || Number.isNaN(pageSize)) {
    res.status(400);
    res.end();
    return;
  }

  const titleFilter = req.query.titleFilter as string;
  const authorsFilter = req.query.authorsFilter as string;
  const genresFilter = req.query.genresFilter as string;

  let resBooks: Book[] = books;

  // Filter by title
  if (titleFilter && titleFilter.length > 0) {
    resBooks = resBooks.filter((b) => b.title.includes(titleFilter));
  }

  // Filter by authors
  if (authorsFilter && authorsFilter.length > 0) {
    resBooks = resBooks.filter((b) => {
      for (const a of b.authors) {
        if (a.name.includes(authorsFilter)) return true;
      }
      return false;
    });
  }

  // Filter by genres
  if (genresFilter && genresFilter.length > 0) {
    const filterGenres = genresFilter.split(',');

    // OR filter
    /* resBooks = resBooks.filter((b) => {
      for (const g of b.genres) {
        if (filterGenres.includes(g)) return true;
      }
      return false;
    }); */

    // AND filter
    resBooks = resBooks.filter((b) => {
      for (const fg of filterGenres) {
        if (!b.genres.includes(fg)) return false;
      }
      return true;
    });
  }

  // Filter by page
  const start = pageIndex * pageSize;
  resBooks = resBooks.slice(start, start + pageSize);

  // Response
  tryApplyImage(resBooks);

  const booksResponse: BooksResponse = {
    pageIndex: pageIndex,
    pageSize: resBooks.length,
    books: resBooks,
  };

  res.status(200);
  res.send(booksResponse);
});

booksRouter.get('/books/:bookId', async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const bookIdNum = Number(bookId);
  if (Number.isNaN(bookIdNum)) {
    res.status(400);
    res.end();
    return;
  }
  const book = books.find((b) => b.id === bookIdNum);
  if (!book) {
    res.status(404);
    res.end();
    return;
  }
  tryApplyImage([book]);
  res.status(200);
  res.send(book);
});

function tryApplyImage(books: Book[]) {
  for (let b of books) {
    if (!b.image) {
      const placeholderNum = Math.random() < 0.5 ? 1 : 2;
      b.image = `/public/images/placeholder${placeholderNum}.jpg`;
    }
  }
}

/* req.file:
{
  fieldname: 'image',
  originalname: 'book-1283865_640.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: <Buffer ff d8 ff e0 00 10 4a  ... 47883 more bytes>,
  size: 47933
}
*/

type CreateBookDto = {
  title: string;
  isbn: string;
  price: string;
  quantity: string;
  publishDate: Date;
  pageCount: string;
  genres: string; // comma separated genre ids, id = genre name
  authors: string; // comma separated  author ids
  forChildren: string;
  description: string;
};

booksRouter.post(
  '/books',
  checkAuthHandler,
  multerUploadBookImage.single('image'),
  async (req: Request, res: Response) => {
    const inputs = req.body as CreateBookDto;
    const genres = inputs.genres.split(',').map((e) => e.trim());
    const authorIds = inputs.authors.split(',').map((e) => Number(e.trim()));
    let bookAuthors = authors.filter((a) => authorIds.includes(a.id));
    const pageCount = Number(inputs.pageCount);
    const forChildren = inputs.forChildren === 'true' ? true : false;

    const newBook: Book = {
      id: books[books.length - 1].id + 1,
      title: inputs.title,
      isbn: inputs.isbn,
      price: Number(inputs.price),
      quantity: Number(inputs.quantity),
      publishDate: new Date(inputs.publishDate),
      pageCount: pageCount,
      genres: genres,
      authors: bookAuthors,
      forChildren: forChildren,
      image: req.file ? '/public/images/' + req.file.filename : null,
      description: inputs.description,
    };

    setBooks([...books, newBook]);

    res.end();
  },
);

booksRouter.put(
  '/books/:bookId',
  checkAuthHandler,
  multerUploadBookImage.single('image'),
  async (req: Request, res: Response) => {
    const { bookId } = req.params;
    const bookIdNum = Number(bookId);
    if (Number.isNaN(bookIdNum)) {
      res.status(404);
      res.end();
      return;
    }

    const book = books.find((b) => b.id === bookIdNum);
    if (!book) {
      res.status(404);
      res.end();
      return;
    }

    const inputs = req.body as CreateBookDto;
    const genres = inputs.genres.split(',').map((e) => e.trim());
    const authorIds = inputs.authors.split(',').map((e) => Number(e.trim()));
    let bookAuthors = authors.filter((a) => authorIds.includes(a.id));
    const pageCount = Number(inputs.pageCount);
    const forChildren = inputs.forChildren === 'true' ? true : false;

    book.title = inputs.title;
    book.isbn = inputs.isbn;
    book.price = Number(inputs.price);
    book.quantity = Number(inputs.quantity);
    book.publishDate = new Date(inputs.publishDate);
    book.pageCount = pageCount;
    book.genres = genres;
    book.authors = bookAuthors;
    book.forChildren = forChildren;
    book.description = inputs.description;

    if (req.file) {
      book.image && tryDeleteImage(book.image);
      book.image = req.file ? '/public/images/' + req.file.filename : null;
    }

    res.status(200);
    res.end();
  },
);

booksRouter.delete(
  '/books',
  checkAuthHandler,
  async (req: Request, res: Response) => {
    const ids = req.body as number[];
    if (!ids) {
      res.status(400);
      res.end();
      return;
    }
    const entities = books.filter((b) => ids.includes(b.id));
    for (const book of entities) {
      book.image && tryDeleteImage(book.image);
    }
    setBooks(books.filter((b) => !ids.includes(b.id)));

    res.status(200);
    res.end();
  },
);

function tryDeleteImage(image: string) {
  if (image.includes('placeholder')) return;
  const imagePath = rootPath + image;
  fs.unlink(imagePath, (err) => {
    if (err) console.error(`Failed to delete image: ${imagePath}`);
  });
}

// An idea, not used
booksRouter.get('/books/page-cursor', async (req: Request, res: Response) => {
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

export default booksRouter;

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import Repo from '../repo';
import checkAuthHandler from '../sessionUtil';
import {
  BookDto,
  BooksResponse,
  CreateBookData,
  CreateBookDto,
  UpdateBookData,
} from '../model';
import { rootPath } from '../config';
import { z } from 'zod';

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

  const titleFilter = req.query.titleFilter as string | undefined;
  const authorsFilter = req.query.authorsFilter as string | undefined;
  const genresFilter = req.query.genresFilter as string | undefined;
  let genresFilterIds: number[] = [];
  if (genresFilter) {
    const genresSplit = genresFilter?.split(',');
    if (genresSplit) {
      for (const gidStr of genresSplit) {
        const n = Number(gidStr);
        if (Number.isNaN(n)) {
          res.status(400);
          res.end();
          return;
        }
        genresFilterIds.push(n);
      }
    }
  }

  console.log(genresFilterIds);

  const bookEntities = await Repo.getBooks2(
    pageIndex,
    pageSize,
    titleFilter,
    authorsFilter,
    genresFilterIds,
  );

  tryApplyImage(bookEntities);

  const booksResponse: BooksResponse = {
    pageIndex: pageIndex,
    pageSize: bookEntities.length,
    books: bookEntities,
  };
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

  const book: BookDto | null = await Repo.getBook(bookIdNum);
  if (!book) {
    res.status(404);
    res.end();
    return;
  }

  tryApplyImage([book]);
  res.send(book);
});

function tryApplyImage(books: BookDto[]) {
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

const createBookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  publishDate: z.date(),
  pageCount: z.number(),
  genreIds: z.array(z.number()),
  authorIds: z.array(z.number()),
  forChildren: z.boolean(),
  description: z.string(),
  image: z.string().nullish(),
});

booksRouter.post(
  '/books',
  checkAuthHandler,
  multerUploadBookImage.single('image'),
  async (req: Request, res: Response) => {
    const inputs = req.body as CreateBookDto;
    const authorIds = inputs.authors.split(',').map((e) => Number(e.trim()));
    const genreIds = inputs.genres.split(',').map((e) => Number(e.trim()));
    const pageCount = Number(inputs.pageCount);
    const forChildren = inputs.forChildren === 'true' ? true : false;

    const newBookData: CreateBookData = {
      title: inputs.title,
      isbn: inputs.isbn,
      price: Number(inputs.price),
      quantity: Number(inputs.quantity),
      publishDate: new Date(inputs.publishDate),
      pageCount: pageCount,
      forChildren: forChildren,
      description: inputs.description,
      authorIds: authorIds,
      genreIds: genreIds,
      image: req.file ? '/public/images/' + req.file.filename : null,
    };

    const zodResult = createBookSchema.safeParse(newBookData);
    if (!zodResult.success) {
      console.log('zod');
      console.log(zodResult.error);
      res.status(400);
      res.end();
      return;
    }

    await Repo.createBook(newBookData);

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

    const book = await Repo.getBook(bookIdNum);
    if (!book) {
      res.status(404);
      res.end();
      return;
    }

    if (req.file) {
      book.image && tryDeleteImage(book.image);
    }

    const inputs = req.body as CreateBookDto;
    const authorIds = inputs.authors.split(',').map((e) => Number(e.trim()));
    const genreIds = inputs.genres.split(',').map((e) => Number(e.trim()));
    const pageCount = Number(inputs.pageCount);
    const forChildren = inputs.forChildren === 'true' ? true : false;

    const bookData: UpdateBookData = {
      id: bookIdNum,
      title: inputs.title,
      isbn: inputs.isbn,
      price: Number(inputs.price),
      quantity: Number(inputs.quantity),
      publishDate: new Date(inputs.publishDate),
      pageCount: pageCount,
      forChildren: forChildren,
      description: inputs.description,
      authorIds: authorIds,
      genreIds: genreIds,
      image: req.file ? '/public/images/' + req.file.filename : null,
    };

    await Repo.updateBook(bookData);

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

    // delete images
    const books = await Repo.getBooksByIds(ids);
    for (const book of books) {
      book.image && tryDeleteImage(book.image);
    }

    await Repo.deleteBooksByIds(ids);

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
/*
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
*/

export default booksRouter;

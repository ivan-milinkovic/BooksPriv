export type Author = {
  id: number;
  name: string;
  bio: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAuthorData = {
  name: string;
  bio: string;
  dateOfBirth: Date;
};

export type Genre = {
  id: number;
  name: string;
  forChildren: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BookDto = {
  id: number;
  isbn: string;
  title: string;
  publishDate: Date;
  price: number;
  quantity: number;
  pageCount: number;
  forChildren: boolean;
  description: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  genres?: Genre[];
  authors?: Author[];
};

export type CreateBookDto = {
  isbn: string;
  title: string;
  price: string;
  quantity: string;
  publishDate: Date;
  pageCount: string;
  genres: string; // comma separated genre ids, id = genre name
  authors: string; // comma separated  author ids
  forChildren: string;
  description: string;
};

export type CreateBookData = {
  isbn: string;
  title: string;
  price: number;
  quantity: number;
  publishDate: Date;
  pageCount: number;
  genreIds: number[];
  authorIds: number[];
  forChildren: boolean;
  description: string;
  image: string | null;
};

export type UpdateBookData = {
  id: number;
  isbn: string;
  title: string;
  price: number;
  quantity: number;
  publishDate: Date;
  pageCount: number;
  genreIds: number[];
  authorIds: number[];
  forChildren: boolean;
  description: string;
  image: string | null;
};

export type BooksResponse = {
  pageIndex: number;
  pageSize: number;
  books: BookDto[];
};

export type Cursor = {
  pageIndex: number;
  pageSize: number;
};

export type BooksSession = {
  email: string;
};

export type User = {
  email: string;
  password: string;
};

export type UserInfo = {
  email: string;
  isGuest: boolean;
};

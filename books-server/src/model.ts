export type Author = {
  id: number;
  name: string;
  bio: string;
  dateOfBirth: Date;
};

export type Genre = string;

export type Genres = {
  children: Genre[];
  adult: Genre[];
};

export type Book = {
  id: number;
  title: string;
  isbn: string;
  price: number;
  quantity: number;
  publishDate: Date;
  pageCount: number;
  genres: Genre[];
  authors: Author[];
  forChildren: boolean;
  image: string | null;
  description: string;
};

export type BooksResponse = {
  pageIndex: number;
  pageSize: number;
  books: Book[];
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

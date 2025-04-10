export type Author = {
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
  publishDate: string;
  pageCount: number;
  genres: Genre[];
  authors: Author[];
  forChildren: boolean;
  image?: string;
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

export type UserInfo = {
  email: string;
  isGuest: boolean;
};

// export class Cursor {
//   public readonly pageIndex: number;
//   public readonly pageSize: number;

//   constructor(pageIndex: number, pageSize: number) {
//     this.pageIndex = pageIndex;
//     this.pageSize = pageSize;
//   }

//   public nextCursor(expectedPageSize: number): Cursor | null {
//     if (this.pageSize < expectedPageSize) return null;
//     return new Cursor(this.pageIndex + 1, expectedPageSize);
//   }

//   public prevCursor(expectedPageSize: number): Cursor | null {
//     if (this.pageIndex == 0) return null;
//     return new Cursor(this.pageIndex - 1, expectedPageSize);
//   }
// }

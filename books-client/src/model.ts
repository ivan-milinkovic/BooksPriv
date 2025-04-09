export type Author = {
  name: string;
  bio: string;
  dateOfBirth: Date;
};

export type Genre = string;

export type Book = {
  id: number;
  title: string;
  isbn: string;
  quantity: number;
  publishDate: Date;
  pageCount: number;
  genres: Genre[];
  authors: Author[];
  forChildren: boolean;
};

export type Author = {
  id: number;
  name: string;
  bio: string;
  dateOfBirth: Date;
};

export type Genre = {
  id: number;
  name: string;
  forChildren: boolean;
};

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

export type UserInfo = {
  email: string;
  isGuest: boolean;
};

export type Cursor = {
  pageIndex: number;
  pageSize: number;
};

export function nextCursor(
  lastCursor: Cursor,
  pageSize: number
): Cursor | null {
  if (lastCursor.pageSize < pageSize) return null;
  return {
    pageIndex: lastCursor.pageIndex + 1,
    pageSize: pageSize,
  };
}

export function prevCursor(
  lastCursor: Cursor,
  pageSize: number
): Cursor | null {
  if (lastCursor.pageIndex == 0) return null;
  return {
    pageIndex: lastCursor.pageIndex - 1,
    pageSize: pageSize,
  };
}

export type FilterInfo = {
  titleFilter: string;
  authorsFilter: string;
  genresFilter: number[];
};

export function makeEmptyFilter() {
  const emptyFilter: FilterInfo = {
    titleFilter: "",
    authorsFilter: "",
    genresFilter: [],
  };
  return emptyFilter;
}

export function queryFromFilter(filter: FilterInfo): string {
  const genresFilter = filter.genresFilter
    .map((gid) => gid.toString())
    .join(",");
  return `titleFilter=${filter.titleFilter.trim()}&authorsFilter=${filter.authorsFilter.trim()}&genresFilter=${genresFilter}`;
}

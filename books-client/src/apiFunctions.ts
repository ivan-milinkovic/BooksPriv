import { apiAxios } from "./axios";
import {
  Author,
  BooksResponse,
  Cursor,
  FilterInfo,
  queryFromFilter,
} from "./model/model";

export async function fetchBooksPage(cursor: Cursor): Promise<BooksResponse> {
  const url = `bookspage?pageIndex=${cursor.pageIndex}&pageSize=${cursor.pageSize}`;
  const res = await apiAxios.get(url);
  const booksRes = res.data as BooksResponse;
  return booksRes;
}

export async function fetchFilteredBooksPage(
  cursor: Cursor,
  filter: FilterInfo
): Promise<BooksResponse> {
  console.log("fetchbooks");
  const filterQuery = queryFromFilter(filter);
  const url = `bookspage?pageIndex=${cursor.pageIndex}&pageSize=${cursor.pageSize}&${filterQuery}`;
  const res = await apiAxios.get(url);
  const booksRes = res.data as BooksResponse;
  return booksRes;
}

export async function postAuthor(author: {
  name: string;
  bio: string;
  dateOfBirth: string;
}): Promise<Author> {
  return await apiAxios({
    method: "post",
    url: "authors",
    data: JSON.stringify(author),
  });
}

export async function postBook(formData: FormData) {
  await apiAxios({
    method: "post",
    url: "books",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  });
}

export async function updateBook(bookId: number, formData: FormData) {
  await apiAxios({
    method: "put",
    url: `books/${bookId}`,
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  });
}

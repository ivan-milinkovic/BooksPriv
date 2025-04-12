import { apiAxios } from "./axios";
import {
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

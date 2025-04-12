import { apiAxios } from "./axios";
import { BooksResponse, Cursor } from "./model/model";

export async function fetchBooksPage(cursor: Cursor): Promise<BooksResponse> {
  // await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  const url = `bookspage?pageIndex=${cursor.pageIndex}&pageSize=${cursor.pageSize}`;
  const res = await apiAxios.get(url);
  const booksRes = res.data as BooksResponse;
  return booksRes;
}

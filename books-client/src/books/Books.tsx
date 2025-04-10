import { useMemo } from "react";
import {
  InfiniteData,
  QueryFunctionContext,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { apiAxios } from "../axios";
import { GetBooksQuery } from "../queryKeys";
import { BooksResponse, Cursor } from "../model";
import { BooksList } from "./BooksList";

const PageSize = 10;
const MaxPages = 3;

const Books = () => {
  const initialCursor: Cursor = {
    pageIndex: 0,
    pageSize: PageSize,
  };

  async function fetchBooks(
    context: QueryFunctionContext<string[], Cursor>
  ): Promise<BooksResponse> {
    const cursor = context.pageParam;
    const url = `bookspage?pageIndex=${cursor.pageIndex}&pageSize=${cursor.pageSize}`;
    const res = await apiAxios.get(url);
    const booksRes = res.data as BooksResponse;
    // await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    return booksRes;
  }

  function nextCursor(lastCursor: Cursor): Cursor | null {
    if (lastCursor.pageSize < PageSize) return null;
    return {
      pageIndex: lastCursor.pageIndex + 1,
      pageSize: PageSize,
    };
  }

  function prevCursor(lastCursor: Cursor): Cursor | null {
    if (lastCursor.pageIndex == 0) return null;
    return {
      pageIndex: lastCursor.pageIndex - 1,
      pageSize: PageSize,
    };
  }

  const booksQuery = useSuspenseInfiniteQuery<
    BooksResponse,
    Error,
    InfiniteData<BooksResponse, Cursor>,
    string[],
    Cursor
  >({
    queryKey: [GetBooksQuery],
    queryFn: fetchBooks,
    initialPageParam: initialCursor,
    getNextPageParam: nextCursor,
    getPreviousPageParam: prevCursor,
    maxPages: MaxPages,
  });

  const data = booksQuery.data;
  if (!data) return <>Error</>; // todo: throw error

  const books = useMemo(() => {
    return data.pages.flatMap((page) => page.books);
  }, [data]);

  return (
    <>
      {booksQuery.hasPreviousPage && (
        <div>
          <button
            disabled={
              !booksQuery.hasPreviousPage || booksQuery.isFetchingPreviousPage
            }
            onClick={() => booksQuery.fetchPreviousPage()}
            className="secondary-button"
          >
            Load Previous
          </button>
        </div>
      )}

      <div>
        <BooksList books={books} />
        {/* {data.pages.map((page) => (
          <React.Fragment key={page.pageIndex}>
            page: {page.pageIndex}, count: {page.pageSize}
            <BooksList books={page.books} />
          </React.Fragment>
        ))} */}
      </div>
      <div className="mb-8">
        <button
          onClick={() => booksQuery.fetchNextPage()}
          disabled={!booksQuery.hasNextPage || booksQuery.isFetchingNextPage}
          className="secondary-button"
        >
          {booksQuery.isFetchingNextPage
            ? "Loading..."
            : booksQuery.hasNextPage
            ? "Load More"
            : "No more books to load"}
        </button>
      </div>
    </>
  );
};

export default Books;

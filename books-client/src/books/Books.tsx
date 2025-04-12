import { useMemo } from "react";
import { GetBooksQuery } from "../queries/queryKeys";
import { BooksList } from "./BooksList";
import { useBooksSuspenseInfiniteQuery } from "../queries/booksQuery";

const PageSize = 10;
const MaxPages = 3;

const Books = () => {
  const booksQuery = useBooksSuspenseInfiniteQuery(
    [GetBooksQuery],
    PageSize,
    MaxPages
  );

  const data = booksQuery.data;
  if (!data) return <>Error</>; // todo: throw error

  const books = useMemo(() => {
    return data.pages.flatMap((page) => page.books); // infinite query stores data per page, so flatten into one array
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
        {/* preview pages */}
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

import { useMemo } from "react";
import { GetBooksQuery } from "../queries/queryKeys";
import { BooksList } from "./BooksList";
import { useBooksSuspenseInfiniteQuery } from "../queries/booksQuery";
import { LoadNextButton, LoadPrevButton } from "../components/LoadButtons";

const PageSize = 10;
const MaxPages = 3;

const Books = () => {
  const booksQuery = useBooksSuspenseInfiniteQuery(
    [GetBooksQuery],
    PageSize,
    MaxPages
  );

  const booksData = booksQuery.data;

  const books = useMemo(() => {
    if (!booksData) return [];
    return booksData.pages.flatMap((page) => page.books); // infinite query stores data per page, so flatten into one array
  }, [booksData]);

  return (
    <>
      <div>
        <LoadPrevButton
          hasMore={booksQuery.hasPreviousPage}
          isFetching={booksQuery.isFetchingPreviousPage}
          handleClick={() => booksQuery.fetchPreviousPage()}
        />
      </div>

      <div>
        <BooksList books={books} />
      </div>

      <div className="mb-8">
        <LoadNextButton
          hasMore={booksQuery.hasNextPage}
          isFetching={booksQuery.isFetchingNextPage}
          handleClick={() => booksQuery.fetchNextPage()}
        />
      </div>
    </>
  );
};

export default Books;

// function visualizePages(booksData: InfiniteData<BooksResponse, Cursor>) {
//   return (
//     <>
//       {booksData.pages.map((page) => (
//         <React.Fragment key={page.pageIndex}>
//           page: {page.pageIndex}, count: {page.pageSize}
//           <BooksList books={page.books} />
//         </React.Fragment>
//       ))}
//     </>
//   );
// }

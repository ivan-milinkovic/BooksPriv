import { useEffect, useMemo, useState } from "react";
import { GetBooksQuery } from "../queries/queryKeys";
import { BooksList } from "./BooksList";
import { useFilteredBooksInfiniteQuery } from "../queries/booksQuery";
import { LoadNextButton, LoadPrevButton } from "../components/LoadButtons";
import Filters from "../components/Filters";
import useDebounce from "../components/useDebounce";
import Loading from "../Loading";
import { FilterInfo, makeEmptyFilter, queryFromFilter } from "../model/model";

const PageSize = 10;
const MaxPages = 3;

const Books = () => {
  const [filter, setFilter] = useState<FilterInfo>(makeEmptyFilter());
  const [debouncedFilter, setDebouncedFilter] = useState(makeEmptyFilter());

  const filterQuery = useMemo(() => {
    return queryFromFilter(debouncedFilter);
  }, [debouncedFilter]);

  const booksQuery = useFilteredBooksInfiniteQuery(
    [GetBooksQuery, filterQuery],
    PageSize,
    MaxPages,
    debouncedFilter
  );

  const booksData = booksQuery.data;

  const books = useMemo(() => {
    if (!booksData) return [];
    return booksData.pages.flatMap((page) => page.books); // infinite query stores data per page, so flatten into one array
  }, [booksData]);

  function handleFiltersUpdate(filterInfo: FilterInfo) {
    setFilter(filterInfo);
  }

  const debouncedFilter0 = useDebounce(filter, 500);

  useEffect(() => {
    setDebouncedFilter(debouncedFilter0);
  }, [debouncedFilter0]);

  return (
    <>
      <div>
        <Filters handleFiltersUpdate={handleFiltersUpdate} />
      </div>

      {booksQuery.isLoading && <Loading />}

      <div>
        <LoadPrevButton
          hasMore={booksQuery.hasPreviousPage}
          isFetching={booksQuery.isFetchingPreviousPage}
          handleClick={() => booksQuery.fetchPreviousPage()}
        />
      </div>

      <div>
        <BooksList
          books={books}
          handleLastElementVisible={() => {
            booksQuery.fetchNextPage();
          }}
        />
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

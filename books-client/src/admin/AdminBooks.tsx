import {
  InfiniteData,
  QueryFunctionContext,
  useMutation,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { BooksResponse, Cursor } from "../model";
import { apiAxios } from "../axios";
import { AdminGetBooksQuery } from "../queryKeys";
import AdminBookList from "./AdminBookList";
import { useMemo, useState } from "react";

const PageSize = 10;
const MaxPages = 3;

const AdminBooks = () => {
  const [selection, setSelection] = useState<number[]>([]);
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
    queryKey: [AdminGetBooksQuery],
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

  function onBookSelected(bookId: number, isSelected: boolean) {
    let newSelection: number[];
    if (isSelected) {
      newSelection = [...selection, bookId];
    } else {
      newSelection = selection.filter((id) => id !== bookId);
    }
    setSelection(newSelection);
  }

  const formattedSelection = useMemo(() => {
    return selection.join(", ");
  }, [selection]);

  const deleteMutation = useMutation({
    mutationKey: ["DeleteBooksMutation"],
    mutationFn: async (ids: number[]) => {
      await apiAxios({
        method: "delete",
        url: "/books",
        data: JSON.stringify(ids),
      });
      booksQuery.refetch();
    },
  });

  async function confirmDeletion() {
    if (confirm(`Delete ${formattedSelection}?`)) {
      await deleteMutation.mutateAsync(selection);
    }
  }

  return (
    <>
      <div>
        <span>Selected IDs: {formattedSelection}</span>
        <span>
          <button onClick={confirmDeletion} className="secondary-button ms-2">
            Delete
          </button>
        </span>
      </div>
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
      <AdminBookList books={books} onBookSelected={onBookSelected} />
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
            : "No more data"}
        </button>
      </div>
    </>
  );
};

export default AdminBooks;

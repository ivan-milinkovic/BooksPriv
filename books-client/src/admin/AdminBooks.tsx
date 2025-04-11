import {
  InfiniteData,
  QueryFunctionContext,
  useMutation,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Author, BooksResponse, Cursor, Genres } from "../model";
import { apiAxios } from "../axios";
import { AdminGetBooksQuery } from "../queryKeys";
import AdminBookList from "./AdminBookList";
import { useMemo, useState } from "react";
import { Modal } from "../modal/Modal";
import AdminAddBook from "./AdminAddBook";

const PageSize = 10;
const MaxPages = 3;

const AdminBooks = () => {
  const [selection, setSelection] = useState<number[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);
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

  const authorsQuery = useSuspenseQuery({
    queryKey: ["GetAuthorsQuery"],
    queryFn: async () => {
      const res = await apiAxios.get("/authors");
      return res.data as Author[];
    },
  });

  const genresQuery = useSuspenseQuery({
    queryKey: ["GetGenresQuery"],
    queryFn: async () => {
      const res = await apiAxios.get("/genres");
      return res.data as Genres;
    },
  });

  const booksData = booksQuery.data;
  if (!booksData) return <>Error</>; // todo: throw error

  const books = useMemo(() => {
    return booksData.pages.flatMap((page) => page.books);
  }, [booksData]);

  const authors = authorsQuery.data as Author[];
  const genres = genresQuery.data as Genres;

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
    },
  });

  async function confirmDeletion() {
    if (confirm(`Delete ${formattedSelection}?`)) {
      await deleteMutation.mutateAsync(selection);
      booksQuery.refetch();
      setSelection([]);
    }
  }

  return (
    <div className="mt-4">
      {showAddBook && (
        <Modal>
          <AdminAddBook
            authors={authors}
            genres={genres}
            handleClose={(added: boolean) => {
              setShowAddBook(false);
              if (added) booksQuery.refetch();
            }}
          />
        </Modal>
      )}
      <div className="mb-4">
        <button
          onClick={() => {
            setShowAddBook(true);
          }}
          className="secondary-button"
        >
          Add Book
        </button>
        <span className="mx-4">|</span>
        <span>
          Selected IDs: &nbsp;
          <span>{formattedSelection}</span>
        </span>
        <span>
          <button onClick={confirmDeletion} className="secondary-button ms-2">
            Delete
          </button>
        </span>
      </div>
      {booksQuery.hasPreviousPage && (
        <div className="text-center">
          <button
            disabled={
              !booksQuery.hasPreviousPage || booksQuery.isFetchingPreviousPage
            }
            onClick={() => booksQuery.fetchPreviousPage()}
            className="link"
          >
            Load Previous
          </button>
        </div>
      )}
      <AdminBookList books={books} onBookSelected={onBookSelected} />
      <div className="mb-8 text-center">
        <button
          onClick={() => booksQuery.fetchNextPage()}
          disabled={!booksQuery.hasNextPage || booksQuery.isFetchingNextPage}
          className="link"
        >
          {booksQuery.isFetchingNextPage
            ? "Loading..."
            : booksQuery.hasNextPage
            ? "Load More"
            : "No more data"}
        </button>
      </div>
    </div>
  );
};

export default AdminBooks;

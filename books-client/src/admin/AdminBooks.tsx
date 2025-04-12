import { useMutation } from "@tanstack/react-query";
import { Author, Genres } from "../model/model";
import { apiAxios } from "../axios";
import { AdminGetBooksQuery } from "../queries/queryKeys";
import AdminBookList from "./AdminBookList";
import { useMemo, useState } from "react";
import { Modal } from "../modal/Modal";
import AdminAddBook from "./AdminAddBook";
import {
  useBooksSuspenseInfiniteQuery,
  useDeleteBooksMutation,
} from "../queries/booksQuery";
import { useAuthorsSuspenseQuery } from "../queries/authorsQuery";
import { useGenresSuspenseQuery } from "../queries/genresQuery";

const PageSize = 10;
const MaxPages = 3;

const AdminBooks = () => {
  const [selection, setSelection] = useState<number[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);

  const booksQuery = useBooksSuspenseInfiniteQuery(
    [AdminGetBooksQuery],
    PageSize,
    MaxPages
  );
  const authorsQuery = useAuthorsSuspenseQuery();
  const genresQuery = useGenresSuspenseQuery();

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

  const deleteMutation = useDeleteBooksMutation();

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

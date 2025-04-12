import { Author, Genres } from "../model/model";
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
import { LoadNextButton, LoadPrevButton } from "../components/LoadButtons";

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
  const deleteMutation = useDeleteBooksMutation();

  const booksData = booksQuery.data;
  const authors = authorsQuery.data as Author[];
  const genres = genresQuery.data as Genres;

  const books = useMemo(() => {
    if (!booksData) return [];
    return booksData.pages.flatMap((page) => page.books);
  }, [booksData]);

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

      <div className="text-center">
        <LoadPrevButton
          hasMore={booksQuery.hasPreviousPage}
          isFetching={booksQuery.isFetchingPreviousPage}
          handleClick={() => booksQuery.fetchPreviousPage()}
        />
      </div>

      <AdminBookList books={books} onBookSelected={onBookSelected} />
      <div className="mb-8 text-center">
        <LoadNextButton
          hasMore={booksQuery.hasNextPage}
          isFetching={booksQuery.isFetchingNextPage}
          handleClick={() => booksQuery.fetchNextPage()}
        />
      </div>
    </div>
  );
};

export default AdminBooks;

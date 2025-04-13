import AdminBooksToolbar from "./AdminBooksToolbar";
import AdminBookList from "./AdminBookList";
import BookForm from "./BookForm";
import AuthorForm from "./AuthorForm";
import Filters from "../components/Filters";
import useDebounce from "../components/useDebounce";
import { AdminGetBooksQuery } from "../queries/queryKeys";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "../modal/Modal";
import { useAuthorsSuspenseQuery } from "../queries/authorsQuery";
import { useGenresSuspenseQuery } from "../queries/genresQuery";
import { LoadNextButton, LoadPrevButton } from "../components/LoadButtons";
import {
  useDeleteBooksMutation,
  useFilteredBooksInfiniteQuery,
} from "../queries/booksQuery";
import {
  Author,
  Book,
  FilterInfo,
  Genres,
  makeEmptyFilter,
  queryFromFilter,
} from "../model/model";

const PageSize = 20;
const MaxPages = 3;

const AdminBooks = () => {
  const [selection, setSelection] = useState<number[]>([]);
  const [showAddBook, setShowAddBook] = useState<boolean>(false);
  const [editBook, setEditBook] = useState<Book | undefined>(undefined);
  const [showAddAuthor, setShowAddAuthor] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterInfo>(makeEmptyFilter());
  const [debouncedFilter, setDebouncedFilter] = useState(makeEmptyFilter());
  const filterQuery = useMemo(() => {
    return queryFromFilter(debouncedFilter);
  }, [debouncedFilter]);

  const booksQuery = useFilteredBooksInfiniteQuery(
    [AdminGetBooksQuery, filterQuery],
    PageSize,
    MaxPages,
    debouncedFilter
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

  function onBookEdit(bookId: number) {
    setEditBook(books.find((b) => b.id === bookId));
  }

  function handleBookFormClose(changed: boolean) {
    setShowAddBook(false);
    setEditBook(undefined);
    if (changed) booksQuery.refetch();
  }

  function handleAuthorFormClose(changed: boolean) {
    setShowAddAuthor(false);
    if (changed) authorsQuery.refetch();
  }

  function handleFiltersUpdate(filterInfo: FilterInfo) {
    setFilter(filterInfo);
    console.log(filterInfo);
  }

  const debouncedFilter0 = useDebounce(filter, 500);
  useEffect(() => {
    setDebouncedFilter(debouncedFilter0);
  }, [debouncedFilter0]);

  return (
    <div className="mt-4">
      {/* Modals */}
      {(showAddBook || editBook) && (
        <Modal>
          <BookForm
            editBook={editBook}
            authors={authors}
            genres={genres}
            handleClose={handleBookFormClose}
          />
        </Modal>
      )}
      {showAddAuthor && (
        <Modal>
          <AuthorForm handleClose={handleAuthorFormClose} />
        </Modal>
      )}

      {/* Toolbar */}
      <div className="mb-4">
        <AdminBooksToolbar
          selection={selection}
          handleAddAuthor={() => {
            setShowAddAuthor(true);
          }}
          handleAddBook={() => {
            setShowAddBook(true);
          }}
          handleDelete={confirmDeletion}
        />
      </div>

      <div>
        <Filters handleFiltersUpdate={handleFiltersUpdate} />
      </div>

      {/* Load Previous */}
      <div className="text-center">
        <LoadPrevButton
          hasMore={booksQuery.hasPreviousPage}
          isFetching={booksQuery.isFetchingPreviousPage}
          handleClick={() => booksQuery.fetchPreviousPage()}
        />
      </div>

      <AdminBookList
        books={books}
        onBookSelected={onBookSelected}
        onBookEdit={onBookEdit}
      />

      {/* Load Next */}
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

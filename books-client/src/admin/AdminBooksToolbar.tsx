import { useMemo } from "react";

type Props = {
  selection: number[];
  handleAddAuthor: () => void;
  handleAddBook: () => void;
  handleDelete: () => void;
};

export default function AdminBooksToolbar({
  selection,
  handleAddAuthor,
  handleAddBook,
  handleDelete,
}: Props) {
  const formattedSelection = useMemo(() => {
    return selection.join(", ");
  }, [selection]);

  return (
    <>
      <button onClick={handleAddAuthor} className="secondary-button">
        Add Author
      </button>
      <button onClick={handleAddBook} className="secondary-button ms-2">
        Add Book
      </button>
      <span className="mx-4">|</span>
      <span>
        Selected IDs: &nbsp;
        <span>{formattedSelection}</span>
      </span>
      <span>
        <button onClick={handleDelete} className="secondary-button ms-2">
          Delete
        </button>
      </span>
    </>
  );
}

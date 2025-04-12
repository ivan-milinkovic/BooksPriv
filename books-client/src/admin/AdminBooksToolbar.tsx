import { useMemo } from "react";

type Props = {
  selection: number[];
  handleAdd: () => void;
  handleDelete: () => void;
};

export default function AdminBooksToolbar({
  selection,
  handleAdd,
  handleDelete,
}: Props) {
  const formattedSelection = useMemo(() => {
    return selection.join(", ");
  }, [selection]);

  return (
    <>
      <button onClick={handleAdd} className="secondary-button">
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

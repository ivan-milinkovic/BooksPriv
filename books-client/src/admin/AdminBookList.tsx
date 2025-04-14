import { ChangeEvent } from "react";
import { Author, Book } from "../model/model";
import { Link } from "react-router";
import { formatDateFromString } from "../components/dateUtil";

type Props = {
  books: Book[];
  onBookSelected: (bookId: number, isSelected: boolean) => void;
  onBookEdit: (bookId: number) => void;
};

const AdminBookList = ({ books, onBookSelected, onBookEdit }: Props) => {
  function formatAuthors(authors: Author[]): string {
    return authors.map((a) => a.name).join(", ");
  }

  function onCheckbox(event: ChangeEvent<HTMLInputElement>, bookId: number) {
    const isChecked = event.target.checked;
    onBookSelected(bookId, isChecked);
  }

  return (
    <>
      <table className="table-fixed border-separate border-spacing-4">
        <thead>
          <tr className="table-row">
            <th>ID</th>
            <th>ISBN</th>
            <th>Title</th>
            <th>Authors</th>
            <th>Publish Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="table-row">
              <td>
                <Link to={"/books/" + book.id} className="link" target="_blank">
                  {book.id}
                </Link>
              </td>
              <td>{book.isbn}</td>
              <td>{book.title}</td>
              <td className="max-w-[300px]">{formatAuthors(book.authors)}</td>
              <td>{formatDateFromString(book.publishDate)}</td>
              <td>
                <div>
                  <Link
                    to={"/books/" + book.id}
                    className="link"
                    target="_blank"
                  >
                    ⓘ
                  </Link>
                  <button
                    className="link ms-4"
                    onClick={() => {
                      onBookEdit(book.id);
                    }}
                  >
                    ✎
                  </button>
                  <input
                    type="checkbox"
                    onChange={(e) => onCheckbox(e, book.id)}
                    className="link ms-4"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminBookList;

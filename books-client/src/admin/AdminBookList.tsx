import { ChangeEvent } from "react";
import { Author, Book } from "../model";
import { Link } from "react-router";

type Props = {
  books: Book[];
  onBookSelected: (bookId: number, isSelected: boolean) => void;
};

const AdminBookList = ({ books, onBookSelected }: Props) => {
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
              <td>{book.publishDate}</td>
              <td>
                <div>
                  <button className="link">✎</button>
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

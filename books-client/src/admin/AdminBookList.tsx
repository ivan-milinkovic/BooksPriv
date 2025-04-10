import { Author, Book } from "../model";

type Props = {
  books: Book[];
};

const AdminBookList = ({ books }: Props) => {
  function formatAuthors(authors: Author[]): string {
    return authors.map((a) => a.name).join(", ");
  }

  return (
    <>
      <table className="table-fixed border-separate border-spacing-4">
        <thead>
          <tr className="table-row">
            <th className="table-cell">ID</th>
            <th className="table-cell">ISBN</th>
            <th className="table-cell">Title</th>
            <th className="table-cell">Authors</th>
            <th className="table-cell">Publish Date</th>
            <th className="table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="table-row">
              <td className="table-cell">{book.id}</td>
              <td className="table-cell">{book.isbn}</td>
              <td className="table-cell">{book.title}</td>
              <td className="table-cell max-w-[300px]">
                {formatAuthors(book.authors)}
              </td>
              <td className="table-cell">{book.publishDate}</td>
              <td className="table-cell">
                <div>
                  <button className="link">✎</button>
                  <button className="link ms-4">x</button>
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

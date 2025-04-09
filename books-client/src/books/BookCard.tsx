import { Link } from "react-router";
import { Author, Book } from "../model";

type Props = {
  book: Book;
};
export const BookCard = ({ book }: Props) => {
  function formatAuthors(authors: Author[]): string {
    return authors.map((a) => a.name).join(", ");
  }
  return (
    <div className="rounded-3xl bg-gray-800 w-[200px] h-[200px] p-4">
      <Link to={`/books/${book.id}`} className="text-2xl">
        {book.title}
      </Link>
      <br />
      <div className="text-wrap italic subtle-text">
        By: {formatAuthors(book.authors)}
      </div>
      <div>
        Price: <span>{book.price}</span>
      </div>
      <button className="link">Add to Cart</button>
    </div>
  );
};

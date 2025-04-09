import { Author, Book } from "../model";

type Props = {
  book: Book;
};
export const BookCard = ({ book }: Props) => {
  function formatAuthors(authors: Author[]): string {
    return authors.map((a) => a.name).join(", ");
  }
  return (
    <div>
      {book.title} by {formatAuthors(book.authors)}
    </div>
  );
};

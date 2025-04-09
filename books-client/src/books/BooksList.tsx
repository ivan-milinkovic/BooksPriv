import { Book } from "../model";
import { BookCard } from "./BookCard";

type Props = {
  books: Book[];
};
export const BooksList = ({ books }: Props) => {
  return (
    <div>
      {books.map((b) => (
        <BookCard book={b} />
      ))}
    </div>
  );
};

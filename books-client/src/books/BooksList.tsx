import { Book } from "../model";
import { BookCard } from "./BookCard";

type Props = {
  books: Book[];
};
export const BooksList = ({ books }: Props) => {
  return (
    <div className="flex flex-row flex-wrap w-[700px]">
      {books.map((b) => (
        <div key={b.id} className="m-4">
          <BookCard key={b.id} book={b} />
        </div>
      ))}
    </div>
  );
};

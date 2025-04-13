import { useCallback, useRef } from "react";
import { Book } from "../model/model";
import { BookCard } from "./BookCard";

type Props = {
  books: Book[];
  handleLastElementVisible: () => void;
};
export const BooksList = ({ books, handleLastElementVisible }: Props) => {
  const observer = useRef<IntersectionObserver | undefined>(undefined);
  const lastElementRefSetter = useCallback(
    (node: Element | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries.length === 0) return;
        const entry = entries[0];
        if (entry.isIntersecting) handleLastElementVisible();
      });
      if (node) observer.current.observe(node);
    },
    [books]
  );

  return (
    <div className="flex flex-row flex-wrap w-[700px]">
      {books.map((b, i) => {
        if (i === books.length - 1) {
          return (
            <div ref={lastElementRefSetter} key={b.id} className="m-4">
              <BookCard key={b.id} book={b} />
            </div>
          );
        } else {
          return (
            <div key={b.id} className="m-4">
              <BookCard key={b.id} book={b} />
            </div>
          );
        }
      })}
    </div>
  );
};

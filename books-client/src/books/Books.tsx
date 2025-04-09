import { useSuspenseQuery } from "@tanstack/react-query";
import { GetBooksQuery } from "../queryKeys";
import { Book } from "../model";
import { apiAxios } from "../axios";
import { BooksList } from "./BooksList";

const Books = () => {
  const booksQuery = useSuspenseQuery({
    queryKey: [GetBooksQuery],
    queryFn: async (): Promise<Book[]> => {
      var res = await apiAxios.get("books");
      const books = res.data as Book[];
      return books;
    },
    retry: 0,
    staleTime: 10,
  });

  return (
    <>
      <BooksList books={booksQuery.data} />
    </>
  );
};

export default Books;

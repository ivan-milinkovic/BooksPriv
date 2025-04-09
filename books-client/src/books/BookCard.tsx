import { Link } from "react-router";
import { Author, Book } from "../model";
import useCart from "../Cart/useCart";
import { useMemo } from "react";
import { proxy } from "../apiConfig";

type Props = {
  book: Book;
};
export const BookCard = ({ book }: Props) => {
  const { cartState, addToCart } = useCart();
  function formatAuthors(authors: Author[]): string {
    return authors.map((a) => a.name).join(", ");
  }

  const isInCart = useMemo(() => {
    return cartState.books.findIndex((b) => b.id === book.id) !== -1;
  }, [cartState]);

  const bgImage = `bg-[url(${proxy + book.image})]`;

  return (
    <div
      className={
        "rounded-3xl subtle-background w-[200px] h-[200px] p-4 overflow-clip bg-cover " +
        bgImage
      }
    >
      <div className="text-shadow-lg/30 bg-stone-700/50 backdrop-blur-md rounded-2xl">
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
        {isInCart ? (
          <div>In cart</div>
        ) : (
          <button
            onClick={() => {
              addToCart(book);
            }}
            className="link"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

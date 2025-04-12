import { useState } from "react";
import { CartState } from "./CartState";
import { CartContext, CartFunctions } from "./CartContext";
import { Book } from "../model/model";

type Props = {
  children: React.ReactNode;
};

const CartProvider = ({ children }: Props) => {
  const [cartState, setCartState] = useState<CartState>(new CartState([]));

  function addToCart(book: Book) {
    const isAlreadyInCart =
      cartState.books.findIndex((b) => b.id === book.id) !== -1;
    if (isAlreadyInCart) return;
    const newBooks = [...cartState.books, book];
    setCartState(new CartState(newBooks));
  }

  function removeFromCart(bookId: number) {
    const newBooks = cartState.books.filter((b) => b.id !== bookId);
    setCartState(new CartState(newBooks));
  }

  const cartFunctions: CartFunctions = {
    cartState: cartState,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
  };
  return (
    <CartContext.Provider value={cartFunctions}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

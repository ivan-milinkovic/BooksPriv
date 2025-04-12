import { createContext } from "react";
import { Book } from "../model/model";
import { CartState } from "./CartState";

export type CartFunctions = {
  cartState: CartState;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
};

const dummyFunctions: CartFunctions = {
  cartState: new CartState([]),
  addToCart: () => {},
  removeFromCart: () => {},
};

export const CartContext = createContext<CartFunctions>(dummyFunctions);

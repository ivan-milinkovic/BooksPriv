import { Book } from "../model";

export class CartState {
  public books: Book[];
  public total: number;
  constructor(books: Book[]) {
    this.books = books;
    this.total = books.reduce((acc, b) => acc + b.price, 0);
  }
}

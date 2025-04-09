import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loading from "../../Loading";
import { Author, Book } from "../../model";
import { apiAxios } from "../../axios";

const BookDetails = () => {
  const { bookId } = useParams();

  const bookQuery = useQuery({
    queryKey: ["BookQuery", [bookId]],
    queryFn: async () => {
      const res = await apiAxios.get(`books/${bookId}`);
      return res.data as Book;
    },
  });

  function formatAuthors(authors: Author[]): string {
    return authors.map((a) => a.name).join(", ");
  }

  if (bookQuery.isLoading) return <Loading />;

  const book = bookQuery.data as Book;

  return (
    <div className="table-auto border-spacing-2 w-1/2">
      <div className="table-row">
        <span className="table-cell subtle-text">Title</span>
        <span className="table-cell">{book.title}</span>
      </div>
      <div className="table-row">
        <span className="table-cell subtle-text">Authors</span>
        <span className="table-cell">{formatAuthors(book.authors)}</span>
      </div>
      <div className="table-row">
        <span className="table-cell subtle-text">ISBN</span>
        <span className="table-cell">{book.isbn}</span>
      </div>
      <div className="table-row">
        <span className="table-cell subtle-text">Genres</span>
        <span className="table-cell">{book.genres.join(", ")}</span>
      </div>
      <div className="table-row">
        <span className="table-cell subtle-text">Description</span>
        <span className="table-cell">{book.description}</span>
      </div>
      <div className="table-row">
        <span className="table-cell subtle-text">Stock</span>
        <span className="table-cell">{book.quantity}</span>
      </div>
      <div className="table-row">
        <span className="table-cell subtle-text">Price</span>
        <span className="table-cell">{book.price}</span>
      </div>
      <div className="table-row">
        <span className="table-cell"></span>
        <button className="primary-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default BookDetails;

// image, add to cart,

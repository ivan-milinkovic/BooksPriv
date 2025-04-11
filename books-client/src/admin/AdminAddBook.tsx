import { useForm } from "react-hook-form";

type Props = {
  handleClose: () => void;
};

type Inputs = {
  title: string;
  isbn: string;
  price: number;
  quantity: number;
  publishDate: Date;
  pageCount: number;
  genres: string[]; // genre ids, id = genre name
  authors: number[]; // author ids
  forChildren: boolean;
  image?: File;
  description: string;
};

const AdminAddBook = ({ handleClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  function submit(inputs: Inputs) {
    console.log(inputs);
  }

  return (
    <div onSubmit={handleSubmit(submit)} className="subtle-background p-4">
      <span className="w-full">
        <span className="text-2xl">Add Book</span>
        <button onClick={handleClose} className="secondary-button float-end">
          X
        </button>
      </span>
      <form className="table-auto">
        {/* Title */}
        <div className="table-row">
          <label htmlFor="title" className="table-cell">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="title"
            className="table-cell"
            {...register("title", { required: true })}
          />
        </div>
        {/* ISBN */}
        <div className="table-row">
          <label htmlFor="isbn" className="table-cell">
            Title
          </label>
          <input
            type="text"
            id="isbn"
            placeholder="isbn"
            className="table-cell"
            {...register("isbn", { required: true })}
          />
        </div>
        {/* Price */}
        <div className="table-row">
          <label htmlFor="price" className="table-cell">
            Price
          </label>
          <input
            type="number"
            id="price"
            placeholder="price"
            className="table-cell"
            {...register("price", { required: true })}
          />
        </div>
        {/* Publish Date */}
        <div className="table-row">
          <label htmlFor="publishDate" className="table-cell">
            Publish Date
          </label>
          <input
            type="date"
            id="publishDate"
            placeholder="publishDate"
            className="table-cell"
            {...register("publishDate", { required: true })}
          />
        </div>
        {/* Page Count */}
        <div className="table-row">
          <label htmlFor="pageCount" className="table-cell">
            Page Count
          </label>
          <input
            type="number"
            id="pageCount"
            placeholder="pageCount"
            className="table-cell"
            {...register("pageCount", { required: true })}
          />
        </div>
        {/* Genres */}
        <div className="table-row">
          <label htmlFor="genres" className="table-cell">
            Genres
          </label>
          <input
            type="text"
            id="genres"
            placeholder="genres"
            className="table-cell"
            {...register("genres", { required: true })}
          />
        </div>
        {/* Authors */}
        <div className="table-row">
          <label htmlFor="authors" className="table-cell">
            Authors
          </label>
          <input
            type="text"
            id="authors"
            placeholder="authors"
            className="table-cell"
            {...register("authors", { required: true })}
          />
        </div>
        {/* For Children */}
        <div className="table-row">
          <label htmlFor="forChildren" className="table-cell">
            For Children
          </label>
          <input
            type="checkbox"
            id="forChildren"
            placeholder="forChildren"
            className="table-cell"
            {...register("forChildren")}
          />
        </div>
        {/* Description */}
        <div className="table-row">
          <label htmlFor="description" className="table-cell">
            Description
          </label>
          <textarea
            id="description"
            placeholder="description"
            className="table-cell"
            {...register("description")}
          />
        </div>
        {/* Image */}
        <div className="table-row">
          <label htmlFor="image" className="table-cell">
            Image
          </label>
          <input
            type="file"
            id="image"
            className="table-cell"
            {...register("image")}
          />
        </div>
        {/* Submit */}
        <div className="table-row">
          <span className="table-cell"></span>
          <span className="table-cell">
            <button className="primary-button">Submit</button>
          </span>
        </div>
      </form>
    </div>
  );
};

/*
  image?: string;
*/

export default AdminAddBook;

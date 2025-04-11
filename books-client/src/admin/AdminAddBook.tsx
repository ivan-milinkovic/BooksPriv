import { useForm } from "react-hook-form";
import { apiAxios } from "../axios";

type Props = {
  handleClose: () => void;
};

type Inputs = {
  title: string;
  isbn: string;
  price: number;
  publishDate: string;
  pageCount: number;
  genres: string; // comma separated genre ids, id = genre name
  authors: string; // comma separated author ids
  forChildren: boolean;
  image?: FileList;
  description: string;
};

const AdminAddBook = ({ handleClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  async function submit(inputs: Inputs) {
    console.log(inputs);
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("isbn", inputs.isbn);
    formData.append("price", inputs.price.toString());
    formData.append("publishDate", inputs.publishDate);
    formData.append("pageCount", inputs.pageCount.toString());
    formData.append("genres", inputs.genres);
    formData.append("authors", inputs.authors);
    formData.append("forChildren", inputs.forChildren ? "true" : "false");
    console.log(inputs.image);
    if (inputs.image && inputs.image.length == 1)
      formData.append("image", inputs.image[0]);
    formData.append("description", inputs.description);

    console.log(formData);

    await apiAxios({
      method: "post",
      url: "books",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    });
  }

  return (
    <div onSubmit={handleSubmit(submit)} className="subtle-background p-4">
      <span className="w-full">
        <span className="text-2xl">Add Book</span>
        <button onClick={handleClose} className="secondary-button float-end">
          X
        </button>
      </span>
      <form className="table-auto border-spacing-2">
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
            defaultValue="Book X"
            {...register("title", { required: true })}
          />
          <div className="table-cell">
            {errors.title && <div className="error-text">Required field</div>}
          </div>
        </div>
        {/* ISBN */}
        <div className="table-row">
          <label htmlFor="isbn" className="table-cell">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            placeholder="isbn"
            className="table-cell"
            defaultValue="0-1645-2527-0"
            {...register("isbn", { required: true })}
          />
          <div className="table-cell">
            {errors.isbn && <div className="error-text">Required field</div>}
          </div>
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
            defaultValue="10"
            {...register("price", { required: true })}
          />
          <div className="table-cell">
            {errors.isbn && <div className="error-text">Required field</div>}
          </div>
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
            defaultValue="2000-01-01"
            {...register("publishDate", { required: true })}
          />
          <div className="table-cell">
            {errors.publishDate && (
              <div className="error-text">Required field</div>
            )}
          </div>
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
            defaultValue="200"
            {...register("pageCount", { required: true })}
          />
          <div className="table-cell">
            {errors.pageCount && (
              <div className="error-text">Required field</div>
            )}
          </div>
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
            defaultValue="Picture Books"
            {...register("genres", { required: true })}
          />
          <div className="table-cell">
            {errors.pageCount && (
              <div className="error-text">Required field</div>
            )}
          </div>
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
            defaultValue="0, 1"
            {...register("authors", { required: true })}
          />
          <div className="table-cell">
            {errors.authors && <div className="error-text">Required field</div>}
          </div>
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
            defaultChecked={false}
            {...register("forChildren")}
          />
          <div className="table-cell"></div>
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
            defaultValue="Etiam lobortis, libero id suscipit commodo."
            {...register("description")}
          />
          <div className="table-cell"></div>
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
            accept="image/png, image/jpg, image/jpeg, image/webp"
            {...register("image")}
          />
          <div className="table-cell"></div>
        </div>
        {/* Submit */}
        <div className="table-row">
          <span className="table-cell"></span>
          <span className="table-cell">
            <button className="primary-button">Submit</button>
          </span>
          <div className="table-cell"></div>
        </div>
      </form>
    </div>
  );
};

/*
  image?: string;
*/

export default AdminAddBook;

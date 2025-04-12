import { useForm } from "react-hook-form";
import { Author, Book, Genre, Genres } from "../model/model";
import { memo, useState } from "react";
import { postBook, updateBook } from "../apiFunctions";
import TokenizedInput from "../components/TokenInput";
import { ApiUrl } from "../apiConfig";

type Props = {
  editBook: Book | undefined;
  authors: Author[];
  genres: Genres;
  handleClose: (changed: boolean) => void;
};

type Inputs = {
  title: string;
  isbn: string;
  price: number;
  quantity: number;
  publishDate: string;
  pageCount: number;
  authors: string; // author ids
  genres: string; // comma separated genre ids, id = genre name
  forChildren: boolean;
  image?: FileList;
  description: string;
};

function BookForm({ editBook, authors, genres, handleClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Inputs>();

  const [appropriateGenres, setAppropriateGenres] = useState<Genre[]>(
    genres.adult
  );
  const [selectedAuthorIds, setSelectedAuthorIds] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState("");

  watch((value, _info) => {
    if (value.forChildren === true) {
      setAppropriateGenres(genres.children);
    } else {
      setAppropriateGenres(genres.adult);
    }
  });

  async function submit(inputs: Inputs) {
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("isbn", inputs.isbn);
    formData.append("price", inputs.price.toString());
    formData.append("publishDate", inputs.publishDate);
    formData.append("pageCount", inputs.pageCount.toString());
    formData.append("genres", inputs.genres);
    formData.append("authors", inputs.authors);
    formData.append("forChildren", inputs.forChildren ? "true" : "false");

    if (inputs.image && inputs.image.length == 1)
      formData.append("image", inputs.image[0]);
    formData.append("description", inputs.description);

    if (editBook) {
      await updateBook(editBook.id, formData);
    } else {
      await postBook(formData);
    }

    handleClose(true);
  }

  function handleAuthorIds(newAuthorIds: string[]) {
    const newCommaSeparatedAuthorIds = newAuthorIds.join(",");
    setSelectedAuthorIds(newCommaSeparatedAuthorIds);
    setValue("authors", newCommaSeparatedAuthorIds, { shouldValidate: true });
  }

  function handleGenreIds(newGenreIds: string[]) {
    const newCommaSeparatedGenreIds = newGenreIds.join(",");
    setSelectedGenreIds(newCommaSeparatedGenreIds);
    setValue("genres", newCommaSeparatedGenreIds, { shouldValidate: true });
  }

  const initialAuthorsSelection =
    editBook?.authors.map((a) => a.id.toString()) || [];

  let initialDate: string = "2000-01-01";
  if (editBook) {
    const date = new Date(editBook.publishDate);
    var day = ("0" + date.getDate()).slice(-2); // adds zero, takes the last 2 (because 031)
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    initialDate = date.getFullYear() + "-" + month + "-" + day;
  }

  return (
    <div onSubmit={handleSubmit(submit)} className="subtle-background p-4">
      {/* Close Button */}
      <span className="w-full">
        <span className="text-2xl">Add Book</span>
        <button
          onClick={() => {
            handleClose(false);
          }}
          className="secondary-button float-end"
        >
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
            defaultValue={editBook?.title || "Book X"}
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
            defaultValue={editBook?.isbn || "0-1645-2527-0"}
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
            defaultValue={editBook?.price || 10}
            {...register("price", { required: true })}
          />
          <div className="table-cell">
            {errors.price && <div className="error-text">Required field</div>}
          </div>
        </div>
        {/* Quantity */}
        <div className="table-row">
          <label htmlFor="price" className="table-cell">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            placeholder="quantity"
            className="table-cell"
            defaultValue={editBook?.quantity || 20}
            {...register("quantity", { required: true })}
          />
          <div className="table-cell">
            {errors.quantity && (
              <div className="error-text">Required field</div>
            )}
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
            defaultValue={initialDate}
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
            defaultValue={editBook?.pageCount || 200}
            {...register("pageCount", { required: true })}
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
          <div className="table-cell">
            <TokenizedInput
              tokens={authors.map((a) => {
                return {
                  id: a.id.toString(),
                  name: a.name,
                };
              })}
              initialSelection={initialAuthorsSelection}
              handleOutput={(newAuthorIds) => handleAuthorIds(newAuthorIds)}
            />
            <input
              type="text"
              id="authors"
              value={selectedAuthorIds}
              {...register("authors", { required: true })}
              className="hidden"
            />
          </div>
          <div className="table-cell">
            {errors.authors && <div className="error-text">Required field</div>}
          </div>
        </div>
        {/* Genres */}
        <div className="table-row">
          <label htmlFor="genres" className="table-cell">
            Genres
          </label>
          <div className="table-cell">
            <TokenizedInput
              tokens={appropriateGenres.map((g) => {
                // console.log(appropriateGenres[0]);
                return {
                  id: g,
                  name: g,
                };
              })}
              initialSelection={editBook?.genres || []}
              handleOutput={(newGenreIds) => handleGenreIds(newGenreIds)}
            />
            <input
              type="text"
              id="genres"
              value={selectedGenreIds}
              {...register("genres", { required: true })}
              className="hidden"
            />
          </div>

          <div className="table-cell">
            {errors.pageCount && (
              <div className="error-text">Required field</div>
            )}
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
            defaultChecked={editBook?.forChildren || false}
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
            className="table-cell resize min-w-[300px] min-h-[100px]"
            defaultValue={
              editBook?.description ||
              "Etiam lobortis, libero id suscipit commodo."
            }
            {...register("description")}
          />
          <div className="table-cell"></div>
        </div>
        {/* Current Image */}
        {editBook && (
          <div className="table-row">
            <label htmlFor="image" className="table-cell">
              Current Image
            </label>
            <div className="table-cell max-w-[100px] max-h-[70px]">
              <img
                src={ApiUrl + editBook.image}
                alt=""
                // className="object-contain"
                width={70}
                height={40}
              />
            </div>
            <div className="table-cell"></div>
          </div>
        )}
        {/* Image Picker */}
        <div className="table-row">
          <label htmlFor="image" className="table-cell">
            New Image
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
}

export default memo(BookForm);

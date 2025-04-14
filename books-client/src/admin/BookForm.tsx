import { useForm } from "react-hook-form";
import { Author, Book, Genre, Genres } from "../model/model";
import { memo, useEffect, useState } from "react";
import { postBook, updateBook } from "../apiFunctions";
import TokenizedInput from "../components/TokenInput";
import { ApiUrl } from "../apiConfig";
import { makeInputDate, makeInputDateFromString } from "../components/dateUtil";

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
  const initialForChildren = editBook?.forChildren || false;
  const [appropriateGenres, setAppropriateGenres] = useState<Genre[]>(
    initialForChildren ? genres.children : genres.adult
  );

  // These double artist and genre pairs must be kept in sync at all times
  // They help bridge TokenizedInput and react-hook-form
  // by setting one to TokenizedInput and the other to the hidden input field registered with react-hook-form
  const [authorsSelection, setAuthorsSelection] = useState(
    editBook?.authors.map((a) => a.id.toString()) || []
  );
  const [selectedAuthorIds, setSelectedAuthorIds] = useState(
    authorsSelection.join(",")
  );

  const [genresSelection, setGenresSelection] = useState(
    editBook?.genres || []
  );
  const [selectedGenreIds, setSelectedGenreIds] = useState(
    genresSelection.join(",")
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      title: editBook?.title || "Book X",
      isbn: editBook?.isbn || "0-1645-2527-0",
      price: editBook?.price || 10,
      quantity: editBook?.quantity || 20,
      publishDate: editBook?.publishDate
        ? makeInputDateFromString(editBook.publishDate)
        : "2000-01-01",
      pageCount: editBook?.pageCount || 200,
      authors: selectedAuthorIds,
      genres: selectedGenreIds,
      forChildren: initialForChildren === true, // because javascript...
      description:
        editBook?.description || "Etiam lobortis, libero id suscipit commodo.",
    },
  });

  // for children checkbox change
  useEffect(() => {
    const subscription = watch((value, info) => {
      if (info.name !== "forChildren") return;
      if (typeof value.forChildren === "undefined") return;
      if (info.type !== "change") return;

      setAppropriateGenres(value.forChildren ? genres.children : genres.adult);
      setGenresSelection([]);
      setSelectedGenreIds("");
    });
    return () => subscription.unsubscribe();
  }, [watch, genres]);

  function handleAuthorIds(newAuthorIds: string[]) {
    const newCommaSeparatedAuthorIds = newAuthorIds.join(",");
    setSelectedAuthorIds(newCommaSeparatedAuthorIds);
    setAuthorsSelection(newAuthorIds);
    setValue("authors", newCommaSeparatedAuthorIds, { shouldValidate: true });
  }

  function handleGenreIds(newGenreIds: string[]) {
    const newCommaSeparatedGenreIds = newGenreIds.join(",");
    setSelectedGenreIds(newCommaSeparatedGenreIds);
    setGenresSelection(newGenreIds);
    setValue("genres", newCommaSeparatedGenreIds, { shouldValidate: true });
  }

  async function submit(inputs: Inputs) {
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("isbn", inputs.isbn);
    formData.append("price", inputs.price.toString());
    formData.append("publishDate", inputs.publishDate);
    formData.append("quantity", inputs.quantity.toString());
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

  return (
    <div className="subtle-background p-4">
      {/* Close Button */}
      <span className="w-full">
        <span className="text-2xl">
          {editBook ? `Edit Book (id:${editBook.id})` : "Add Book"}
        </span>
        <button
          onClick={() => {
            handleClose(false);
          }}
          className="secondary-button float-end"
        >
          X
        </button>
      </span>

      <form
        onSubmit={handleSubmit(submit)}
        className="table-auto border-spacing-2 max-w-[600px]"
      >
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
            max={makeInputDate(new Date())}
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
              initialSelection={authorsSelection}
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
                return {
                  id: g,
                  name: g,
                };
              })}
              initialSelection={genresSelection}
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
            {errors.genres && <div className="error-text">Required field</div>}
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
            className="table-cell"
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

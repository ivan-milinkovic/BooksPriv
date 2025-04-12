import { useMemo, useState } from "react";
import { useGenresSuspenseQuery } from "../queries/genresQuery";
import TagsPicker from "./TagsPicker";
import { Genre } from "../model/model";

export type FilterInfo = {
  titleFilter: string;
  authorsFilter: string;
  genresFilter: string[];
};

type Props = {
  handleFiltersUpdate: (filterInfo: FilterInfo) => void;
};

export default function Filters({ handleFiltersUpdate }: Props) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [genresSelection, setGenresSelection] = useState<Genre[]>([]);

  const genresQuery = useGenresSuspenseQuery();
  const genres = genresQuery.data;

  function sendFilterUpdate() {
    const filterInfo: FilterInfo = {
      titleFilter: title,
      authorsFilter: authors,
      genresFilter: genresSelection,
    };
    handleFiltersUpdate(filterInfo);
  }

  function updateTitleState(val: string) {
    setTitle(val);
    sendFilterUpdate();
  }

  function updateAuthorsState(val: string) {
    setAuthors(val);
    sendFilterUpdate();
  }

  function isGenreSelected(id: string) {
    return genresSelection.findIndex((g) => g === id) >= 0;
  }

  function handleGenreSelection(genreId: string) {
    let newGenresSelection: Genre[];
    if (isGenreSelected(genreId))
      newGenresSelection = genresSelection.filter((g) => g !== genreId);
    else {
      newGenresSelection = [...genresSelection, genreId];
    }
    setGenresSelection(newGenresSelection);
    sendFilterUpdate();
  }

  const tags = useMemo(() => {
    return [...genres.children, ...genres.adult].map((g) => {
      return { id: g, name: g, isSelected: isGenreSelected(g) };
    });
  }, [genres, genresSelection, isGenreSelected]);

  return (
    <div className="max-w-[700px]">
      {/* <span className="subtle-text">Filters </span> */}

      <div>
        <div>
          {/* Title */}
          <span className="">
            <label htmlFor="titleFilter">Title</label>
            <input
              type="text"
              id="titleFilter"
              value={title}
              className="ms-2 border-b-1 border-gray-500"
              onChange={(e) => {
                updateTitleState(e.target.value);
              }}
            />
          </span>

          {/* Authors */}
          <span className="ms-4">
            <label htmlFor="authorsFilter">Authors</label>
            <input
              type="text"
              id="authorsFilter"
              value={authors}
              className="ms-2 border-b-1 border-gray-500"
              onChange={(e) => {
                updateAuthorsState(e.target.value);
              }}
            />
          </span>
        </div>

        <div className="m-t-4">
          <div>Genres</div>
          <TagsPicker tags={tags} handleSelection={handleGenreSelection} />
        </div>
      </div>
    </div>
  );
}

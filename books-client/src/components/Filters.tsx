import { useCallback, useEffect, useMemo, useState } from "react";
import { useGenresSuspenseQuery } from "../queries/genresQuery";
import TagsPicker from "./TagsPicker";
import { FilterInfo } from "../model/model";

type Props = {
  handleFiltersUpdate: (filterInfo: FilterInfo) => void;
};

export default function Filters({ handleFiltersUpdate }: Props) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const genresQuery = useGenresSuspenseQuery();
  const genres = genresQuery.data;

  function updateTitleState(val: string) {
    setTitle(val);
  }

  function updateAuthorsState(val: string) {
    setAuthors(val);
  }

  const isGenreSelected = useCallback(
    (id: number) => {
      return selectedGenreIds.findIndex((gid) => gid === id) >= 0;
    },
    [selectedGenreIds]
  );

  function handleGenreSelection(genreIdStr: string) {
    const genreId = Number(genreIdStr);
    let newGenresSelection: number[];
    if (isGenreSelected(genreId))
      newGenresSelection = selectedGenreIds.filter((gid) => gid !== genreId);
    else {
      newGenresSelection = [...selectedGenreIds, genreId];
    }
    setSelectedGenreIds(newGenresSelection);
  }

  const tags = useMemo(() => {
    return [...genres.children, ...genres.adult].map((g) => {
      return {
        id: g.id.toString(),
        name: g.name,
        isSelected: isGenreSelected(g.id),
      };
    });
  }, [genres, isGenreSelected]);

  useEffect(() => {
    const filterInfo: FilterInfo = {
      titleFilter: title,
      authorsFilter: authors,
      genresFilter: selectedGenreIds,
    };
    handleFiltersUpdate(filterInfo);
  }, [title, authors, selectedGenreIds]); // putting handleFiltersUpdate here creates an infinite render loop

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
          <div>Genres (AND)</div>
          <TagsPicker tags={tags} handleSelection={handleGenreSelection} />
        </div>
      </div>
    </div>
  );
}

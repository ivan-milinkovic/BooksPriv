import { useSuspenseQuery } from "@tanstack/react-query";
import { GetGenresQuery } from "./queryKeys";
import { apiAxios } from "../axios";
import { Genres } from "../model/model";

export function useGenresSuspenseQuery() {
  return useSuspenseQuery({
    queryKey: [GetGenresQuery],
    queryFn: async () => {
      const res = await apiAxios.get("/genres");
      return res.data as Genres;
    },
  });
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { apiAxios } from "../axios";
import { Author } from "../model/model";
import { GetAuthorsQuery } from "./queryKeys";

export function useAuthorsSuspenseQuery() {
  return useSuspenseQuery({
    queryKey: [GetAuthorsQuery],
    queryFn: async () => {
      const res = await apiAxios.get("/authors");
      return res.data as Author[];
    },
  });
}

import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  BooksResponse,
  Cursor,
  FilterInfo,
  nextCursor,
  prevCursor,
} from "../model/model";
import { fetchBooksPage, fetchFilteredBooksPage } from "../apiFunctions";
import { apiAxios } from "../axios";

export function useBooksSuspenseInfiniteQuery(
  queryKey: string[],
  pageSize: number,
  maxPages: number
) {
  return useSuspenseInfiniteQuery<
    BooksResponse,
    Error,
    InfiniteData<BooksResponse, Cursor>,
    string[],
    Cursor
  >({
    queryKey: queryKey,
    queryFn: (context: QueryFunctionContext<string[], Cursor>) =>
      fetchBooksPage(context.pageParam),
    initialPageParam: {
      pageIndex: 0,
      pageSize: pageSize,
    },
    getNextPageParam: (lastCursor: Cursor) => nextCursor(lastCursor, pageSize),
    getPreviousPageParam: (lastCursor: Cursor) =>
      prevCursor(lastCursor, pageSize),
    maxPages: maxPages,
  });
}

export function useFilteredBooksInfiniteQuery(
  queryKey: string[],
  pageSize: number,
  maxPages: number,
  filter: FilterInfo
) {
  return useInfiniteQuery<
    BooksResponse,
    Error,
    InfiniteData<BooksResponse, Cursor>,
    string[],
    Cursor
  >({
    queryKey: queryKey,
    queryFn: (context: QueryFunctionContext<string[], Cursor>) =>
      fetchFilteredBooksPage(context.pageParam, filter),
    initialPageParam: {
      pageIndex: 0,
      pageSize: pageSize,
    },
    getNextPageParam: (lastCursor: Cursor) => nextCursor(lastCursor, pageSize),
    getPreviousPageParam: (lastCursor: Cursor) =>
      prevCursor(lastCursor, pageSize),
    maxPages: maxPages,
  });
}

export function useDeleteBooksMutation() {
  return useMutation({
    mutationKey: ["DeleteBooksMutation"],
    mutationFn: async (ids: number[]) => {
      await apiAxios({
        method: "delete",
        url: "/books",
        data: JSON.stringify(ids),
      });
    },
  });
}

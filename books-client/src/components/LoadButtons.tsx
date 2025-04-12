type Props = {
  hasMore: boolean;
  isFetching: boolean;
  handleClick: () => void;
};

export function LoadPrevButton({ hasMore, isFetching, handleClick }: Props) {
  return (
    <button
      disabled={!hasMore || isFetching}
      className="link"
      onClick={() => handleClick()}
      hidden={!hasMore}
    >
      Load Previous
    </button>
  );
}

export function LoadNextButton({ hasMore, isFetching, handleClick }: Props) {
  return (
    <button
      disabled={!hasMore || isFetching}
      onClick={() => handleClick()}
      className="link"
    >
      {isFetching ? "Loading..." : hasMore ? "Load More" : "No more to load"}
    </button>
  );
}

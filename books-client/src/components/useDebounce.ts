import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delayMillis: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMillis);

    return () => {
      clearTimeout(id);
    };
  }, [value, delayMillis]);

  return debouncedValue;
}

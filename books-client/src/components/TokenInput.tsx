import { useEffect, useMemo, useState } from "react";

type TokenizedInputToken = {
  id: string;
  name: string;
};

type Props = {
  tokens: TokenizedInputToken[];
  initialSelection: string[];
  handleOutput: (ids: string[]) => void;
};

const TokenizedInput = ({ tokens, initialSelection, handleOutput }: Props) => {
  const allIds = tokens.map((t) => t.id);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [remainingIds, setRemainingIds] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<TokenizedInputToken[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setSelectedIds(allIds.filter((id) => initialSelection.includes(id)));
    setRemainingIds(allIds.filter((id) => !initialSelection.includes(id)));
  }, [initialSelection]);

  function addSelection(tokenId: string) {
    const newSelectedIds = [...selectedIds, tokenId];
    setSelectedIds(newSelectedIds);
    setRemainingIds(allIds.filter((id) => !newSelectedIds.includes(id)));
    setSearch("");
    handleOutput(newSelectedIds);
  }

  function removeSelection(tokenId: string) {
    const newSelectedIds = selectedIds.filter((id) => id !== tokenId);
    setSelectedIds(newSelectedIds);
    setRemainingIds(allIds.filter((id) => !newSelectedIds.includes(id)));
    handleOutput(newSelectedIds);
  }

  const selectedTokens = useMemo(() => {
    return tokens.filter((t) => selectedIds.includes(t.id));
  }, [selectedIds, tokens]);

  const remainingTokens = useMemo(() => {
    return tokens.filter((t) => remainingIds.includes(t.id));
  }, [remainingIds, tokens]);

  useEffect(() => {
    if (search === "") {
      setSuggestions([]);
      return;
    }
    const newSuggestions = remainingTokens
      .filter((t) => {
        return t.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
      })
      .slice(0, 5);
    setSuggestions(newSuggestions);
  }, [search, tokens, remainingTokens]);

  return (
    <span>
      <div>
        {selectedTokens.map((t) => (
          <span key={t.id} className="me-2">
            {t.name}{" "}
            <button
              onClick={() => removeSelection(t.id)}
              className="secondary-button"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={search}
        className="border-b-1 border-gray-500"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      {suggestions.length > 0 && (
        <ul className="absolute block bg-gray-500 p-2">
          {suggestions.map((t) => (
            <li
              key={t.id}
              className="cursor-pointer"
              onClick={() => {
                addSelection(t.id);
              }}
            >
              {t.name}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
};

export default TokenizedInput;

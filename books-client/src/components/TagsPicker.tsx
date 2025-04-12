type Tag = {
  id: string;
  name: string;
  isSelected: boolean;
};

type Props = {
  tags: Tag[];
  handleSelection: (id: string) => void;
};

export default function TagsPicker({ tags, handleSelection }: Props) {
  function selectionStyleForId(tag: Tag) {
    return tag.isSelected
      ? "text-stone-800 bg-stone-300 hover:text-stone-800 hover:bg-stone-400"
      : "text-stone-500 hover:text-stone-400";
  }

  return (
    <span className="flex flex-row flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t.id}
          className={`border rounded px-2 cursor-pointer ${selectionStyleForId(
            t
          )}`}
          onClick={() => {
            handleSelection(t.id);
          }}
        >
          {t.name}
        </span>
      ))}
    </span>
  );
}

interface Props {
  items: string[];
  selectedIndices: number[];
  setSelectedIndices: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectItem: (item: string) => void;
}

function isTrueFalseItems(items: string[]): boolean {
  // Csak akkor true, ha pontosan két elem van, és mindkettő 'Igaz' vagy 'Hamis'
  return (
    items.length === 2 &&
    items.every((txt) => txt === "Igaz" || txt === "Hamis")
  );
}

function ListGroup({ items, selectedIndices, setSelectedIndices }: Props) {
  // Egy index hozzáadása vagy eltávolítása a kijelöltek közül
  function toggleIndex(prev: number[], index: number) {
    if (prev.includes(index)) {
      return prev.filter((i) => i !== index);
    } else {
      return [...prev, index];
    }
  }

  // Kattintás kezelése egy elemre
  function handleItemClick(index: number) {
    if (isTrueFalseItems(items)) {
      setSelectedIndices([index]);
    } else {
      setSelectedIndices((prev) => toggleIndex(prev, index));
    }
  }

  return (
    <>
      {
        /* javaScriptben ha true && 'valami' akkor 'valamit' kapok vissza*/
        items.length === 0 && <p>No item found</p>
      }
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              (selectedIndices.includes(index)
                ? "list-group-item active"
                : "list-group-item") + " text-center"
            }
            key={item}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;

import "./ListGroup.css";

interface Props {
  items: string[];
  selectedIndices: number[];
  setSelectedIndices: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectItem: (item: string) => void;
  optionImages?: (string | undefined)[]; // Képek az opciókhoz
  correctOptions?: boolean[]; // Helyes válaszok jelzése
  isQuizSubmitted?: boolean; // Kvíz leadva
}

function isTrueFalseItems(items: string[]): boolean {
  // Csak akkor true, ha pontosan két elem van, és mindkettő 'Igaz' vagy 'Hamis'
  return (
    items.length === 2 &&
    items.every((txt) => txt === "Igaz" || txt === "Hamis")
  );
}

function ListGroup({
  items,
  selectedIndices,
  setSelectedIndices,
  optionImages,
  correctOptions,
  isQuizSubmitted = false,
}: Props) {
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
        {items.map((item, index) => {
          // Szöveg színe leadás után
          let textColor = "";
          if (isQuizSubmitted && correctOptions) {
            textColor = correctOptions[index] ? "text-success" : "text-danger";
          }

          return (
            <li
              className={
                (selectedIndices.includes(index)
                  ? "list-group-item active"
                  : "list-group-item") + " text-center cursor-pointer"
              }
              key={item}
              onClick={() => handleItemClick(index)}
              style={{
                padding: "12px",
                minHeight: optionImages?.[index] ? "200px" : "auto",
              }}
            >
              {optionImages?.[index] && (
                <div className="mb-2">
                  <img
                    src={`/szoftvertech2/pictures/${optionImages[index]}`}
                    alt={`Opció ${index + 1} képe`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              <div
                className={textColor}
                style={{ fontWeight: isQuizSubmitted ? "bold" : "normal" }}
              >
                {item}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ListGroup;

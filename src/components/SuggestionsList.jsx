export default function SuggestionsList({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;

  return (
    <ul className="absolute bg-white shadow-lg border rounded-xl w-full max-h-48 overflow-y-auto mt-1 z-20">
      {suggestions.map((item) => (
        <li
          key={item.id}
          className="p-2 cursor-pointer hover:bg-blue-100 text-sm"
          onClick={() => onSelect(item)}
        >
          {item.formatted}
        </li>
      ))}
    </ul>
  );
}

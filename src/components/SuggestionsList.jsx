export default function SuggestionsList({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;

  return (
    <ul
      className="
        absolute w-full left-0 top-full
        bg-white shadow-lg border rounded-xl 
        mt-1 z-30
        
        max-h-40 sm:max-h-48 md:max-h-60
        overflow-y-auto 
        
        text-xs sm:text-sm md:text-base
      "
      style={{ overscrollBehavior: "contain" }}
    >
      {suggestions.map((item) => (
        <li
          key={item.id}
          onClick={() => onSelect(item)}
          className="
            p-2 sm:p-3 
            cursor-pointer 
            hover:bg-blue-100
            break-words
          "
        >
          {item.formatted}
        </li>
      ))}
    </ul>
  );
}

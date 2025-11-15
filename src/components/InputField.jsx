import SuggestionsList from "./SuggestionsList";
import VoiceButton from "./VoiceButton";
import { X } from "lucide-react";

export default function InputField({
  label,
  value,
  setValue,
  onChange,
  suggestions,
  onSelect,
  showVoice = true,
  onVoice,
}) {
  return (
    <div className="relative w-full">
      <div
        className="
          flex items-center gap-2
          relative
          w-full
        "
      >
        <input
          type="text"
          placeholder={label}
          value={value}
          onChange={onChange}
          className="
            flex-1
            p-2.5 sm:p-3
            pr-12 sm:pr-14
            border rounded-xl
            bg-gray-50
            text-sm sm:text-base
            w-full
          "
        />

        {/* CLEAR BUTTON */}
        {value.length > 0 && (
          <button
            onClick={() => setValue("")}
            className="
              absolute
              right-12 sm:right-14
              p-1.5
              text-gray-500 hover:text-black
              rounded-lg
              active:scale-95
            "
          >
            <X size={18} />
          </button>
        )}

        {/* VOICE BUTTON */}
        {showVoice && (
          <div
            className="
              flex-shrink-0
              transform active:scale-95
            "
          >
            <VoiceButton onClick={onVoice} />
          </div>
        )}
      </div>

      {/* RESPONSIVE SUGGESTIONS */}
      <SuggestionsList suggestions={suggestions} onSelect={onSelect} />
    </div>
  );
}

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
    <div className="relative">
      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          placeholder={label}
          value={value}
          onChange={onChange}
          className="flex-1 p-3 pr-10 border rounded-xl bg-gray-50"
        />

        {/* CLEAR BUTTON (visible only when text exists) */}
        {value.length > 0 && (
          <button
            onClick={() => {
              setValue("");
            }}
            className="absolute right-14 p-1 text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>
        )}

        {/* VOICE BUTTON */}
        {showVoice && <VoiceButton onClick={onVoice} />}
      </div>

      <SuggestionsList suggestions={suggestions} onSelect={onSelect} />
    </div>
  );
}

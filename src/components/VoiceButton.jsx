import { Mic } from "lucide-react";

export default function VoiceButton({ onClick }) {
  return (
    <button onClick={onClick} className="p-3 bg-blue-600 text-white rounded-xl">
      <Mic size={20} />
    </button>
  );
}

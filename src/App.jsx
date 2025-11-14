import { useState } from "react";
import MapView from "./components/MapView";
import { Mic, LocateFixed } from "lucide-react";

export default function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const startVoiceInput = (setter) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setter(text);
    };

    recognition.onerror = (err) => {
      console.error("Speech error: ", err);
    };

    recognition.onend = () => {
      console.log("Voice input stopped");
    };
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white shadow-xl p-5 flex flex-col gap-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600">NavAI</h1>

        {/* INPUT GROUP */}
        <div className="flex flex-col gap-4">
          {/* SOURCE */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="flex-1 p-3 border rounded-xl bg-gray-50"
            />
            <button
              onClick={() => startVoiceInput(setSource)}
              className="p-3 bg-blue-600 text-white rounded-xl cursor-pointer"
            >
              <Mic size={20} />
            </button>
          </div>

          {/* DESTINATION */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 p-3 border rounded-xl bg-gray-50"
            />
            <button
              onClick={() => startVoiceInput(setDestination)}
              className="p-3 bg-blue-600 text-white rounded-xl cursor-pointer"
            >
              <Mic size={20} />
            </button>
          </div>

          {/* LOCATION BUTTON */}
          <button
            id="locateMeBtn"
            className="flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-xl cursor-pointer"
          >
            <LocateFixed size={20} />
            Detect My Location
          </button>
        </div>

        {/* FEATURES */}
        <div className="mt-4">
          <h2 className="font-semibold text-gray-700">Features</h2>
          <ul className="mt-2 text-gray-600 list-disc pl-5">
            <li>Voice Input</li>
            <li>AI Route Assistant</li>
            <li>Current Location</li>
          </ul>
        </div>
      </aside>

      {/* MAP AREA */}
      <main className="flex-1 h-full">
        <MapView />
      </main>
    </div>
  );
}

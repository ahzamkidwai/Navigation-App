import { useState, useEffect } from "react";
import MapView from "./components/MapView";
import { Mic, LocateFixed } from "lucide-react";
import AIRecommendations from "./components/AIRecommendations";

export default function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [currentLocation, setCurrentLocation] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  // ------------------------------
  // Free OpenStreetMap Search API
  // ------------------------------

  function cleanPlacesData(dataArray) {
    return dataArray.map((item) => ({
      id: item.properties.place_id,
      name: item.properties.address_line1,
      formatted: item.properties.formatted,
      state: item.properties.state,
      country: item.properties.country,
      lat: item.properties.lat,
      lon: item.properties.lon,
    }));
  }

  const fetchPlaces = async (query, type) => {
    if (query.length < 3) {
      type === "source" ? setSourceSuggestions([]) : setDestSuggestions([]);
      return;
    }

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&filter=countrycode:in&limit=10&apiKey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      console.log("RESULTS:", data.features);

      if (type === "source") setSourceSuggestions(data.features);
      else setDestSuggestions(data.features);

      const suggestions =
        type === "source"
          ? cleanPlacesData(data.features)
          : cleanPlacesData(data.features);

      if (type === "source") setSourceSuggestions(suggestions);
      else setDestSuggestions(suggestions);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    console.log("Source Suggestions:", sourceSuggestions);
    console.log("Destination Suggestions:", destSuggestions);
  }, [sourceSuggestions, destSuggestions]);

  // Voice input handler
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
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white shadow-xl p-5 flex flex-col gap-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600">NavAI</h1>

        {/* INPUT GROUP */}
        <div className="flex flex-col gap-4">
          {/* SOURCE FIELD */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Source"
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  fetchPlaces(e.target.value, "source");
                }}
                className="flex-1 p-3 border rounded-xl bg-gray-50"
              />

              <button
                onClick={() => startVoiceInput(setSource)}
                className="p-3 bg-blue-600 text-white rounded-xl"
              >
                <Mic size={20} />
              </button>
            </div>

            {/* SOURCE AUTOCOMPLETE */}
            {sourceSuggestions.length > 0 && (
              <ul className="absolute bg-white shadow-lg border rounded-xl w-full max-h-40 overflow-y-auto mt-1 z-20">
                {sourceSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setSource(item.formatted); // <-- FIXED
                      setSourceSuggestions([]);
                    }}
                  >
                    {item.name}, {item.state}, {item.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DESTINATION FIELD */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  fetchPlaces(e.target.value, "dest");
                }}
                className="flex-1 p-3 border rounded-xl bg-gray-50"
              />

              <button
                onClick={() => startVoiceInput(setDestination)}
                className="p-3 bg-blue-600 text-white rounded-xl"
              >
                <Mic size={20} />
              </button>
            </div>

            {/* DESTINATION AUTOCOMPLETE */}
            {destSuggestions.length > 0 && (
              <ul
                className="absolute bg-white shadow-lg border rounded-xl 
                w-full max-h-48 overflow-y-auto mt-1 z-20"
              >
                {destSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-blue-100 text-sm"
                    onClick={() => {
                      setDestination(item.formatted); // <-- FIXED
                      setDestSuggestions([]);
                    }}
                  >
                    {item.name}, {item.state}, {item.country}
                  </li>
                ))}
              </ul>
            )}
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
      </aside>

      {/* MAP AREA */}
      <main className="flex-1 h-full">
        <MapView onLocation={(pos) => setCurrentLocation(pos)} />
        <AIRecommendations coords={currentLocation} />
      </main>
    </div>
  );
}

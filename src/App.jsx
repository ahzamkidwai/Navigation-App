import { useState, useEffect } from "react";
import MapView from "./components/MapView";
import { Mic, LocateFixed } from "lucide-react";
import AIRecommendations from "./components/AIRecommendations";

export default function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  const apiKey = import.meta.env.VITE_API_KEY;

  const cleanPlacesData = (dataArray) =>
    dataArray.map((item) => ({
      id: item.properties.place_id,
      formatted: item.properties.formatted,
      lat: item.properties.lat,
      lon: item.properties.lon,
    }));

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

      const cleaned = cleanPlacesData(data.features);
      type === "source"
        ? setSourceSuggestions(cleaned)
        : setDestSuggestions(cleaned);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const startVoiceInput = (setter) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setter(event.results[0][0].transcript);
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
    };
  };

  // -------------------------------
  // GET ROUTE FROM GEOAPIFY
  // -------------------------------
  const getRoute = async () => {
    if (!sourceCoords || !destCoords) {
      alert("Please select valid Source & Destination");
      return;
    }
    console.log("Fetching route...");
    console.log("Source:", sourceCoords);
    console.log("Destination:", destCoords);

    const url = `https://api.geoapify.com/v1/routing?waypoints=${sourceCoords.lat},${sourceCoords.lon}|${destCoords.lat},${destCoords.lon}&mode=drive&apiKey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const coordinates = data?.features?.[0]?.geometry?.coordinates?.[0] || [];

      const latlngs = coordinates.map((c) => ({ lat: c[1], lon: c[0] }));
      setRouteCoords(latlngs);
    } catch (err) {
      console.error("Route Error:", err);
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <aside className="w-80 bg-white shadow-xl p-5 flex flex-col gap-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600">NavAI</h1>

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

            {sourceSuggestions.length > 0 && (
              <ul className="absolute bg-white shadow-lg border rounded-xl w-full max-h-40 overflow-y-auto mt-1 z-20">
                {sourceSuggestions.map((item) => (
                  <li
                    key={item.id}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setSource(item.formatted);
                      setSourceCoords({ lat: item.lat, lon: item.lon });
                      setSourceSuggestions([]);
                    }}
                  >
                    {item.formatted}
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

            {destSuggestions.length > 0 && (
              <ul className="absolute bg-white shadow-lg border rounded-xl w-full max-h-48 overflow-y-auto mt-1 z-20">
                {destSuggestions.map((item) => (
                  <li
                    key={item.id}
                    className="p-2 cursor-pointer hover:bg-blue-100 text-sm"
                    onClick={() => {
                      setDestination(item.formatted);
                      setDestCoords({ lat: item.lat, lon: item.lon });
                      setDestSuggestions([]);
                    }}
                  >
                    {item.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ROUTE BUTTON */}
          <button
            onClick={getRoute}
            className="p-3 bg-blue-600 text-white rounded-xl w-full font-semibold"
          >
            Get Route
          </button>

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

      <main className="flex-1 h-full">
        {/* <MapView
          onLocation={(pos) => setCurrentLocation(pos)}
          routeCoords={routeCoords}
        /> */}
        <MapView
          onLocation={(pos) => setCurrentLocation(pos)}
          routeCoords={routeCoords}
          sourceCoords={sourceCoords}
          destCoords={destCoords}
        />

        <AIRecommendations coords={currentLocation} />
      </main>
    </div>
  );
}

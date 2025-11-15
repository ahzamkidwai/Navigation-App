import { useState } from "react";
import MapView from "./components/MapView";
import InputField from "./components/InputField";
import RouteSummary from "./components/RouteSummary";

import usePlacesAutocomplete from "./hooks/usePlacesAutocomplete";
import useVoiceInput from "./hooks/useVoiceInput";
import useRoute from "./hooks/useRoute";

export default function App() {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  const [currentLocation, setCurrentLocation] = useState(null);

  const {
    fetchPlaces,
    sourceSuggestions,
    destSuggestions,
    setSourceSuggestions,
    setDestSuggestions,
  } = usePlacesAutocomplete(apiKey);

  const { startVoiceInput } = useVoiceInput();
  const { routeCoords, routeInfo, getRoute } = useRoute(apiKey);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-gray-100">
      {/* Sidebar / Top Panel */}
      <aside
        className="
      w-full md:w-80 
      bg-white shadow-xl p-4 md:p-5 
      flex flex-col gap-5 
      overflow-y-auto 
      md:h-full 
      h-auto
    "
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center md:text-left">
          NavAI
        </h1>

        <InputField
          label="Source"
          value={source}
          setValue={setSource}
          suggestions={sourceSuggestions}
          onChange={(e) => {
            setSource(e.target.value);
            fetchPlaces(e.target.value, "source");
          }}
          onSelect={(item) => {
            setSource(item.formatted);
            setSourceCoords({ lat: item.lat, lon: item.lon });
            setSourceSuggestions([]);
          }}
          onVoice={() => startVoiceInput(setSource)}
        />

        <InputField
          label="Destination"
          value={destination}
          setValue={setDestination}
          suggestions={destSuggestions}
          onChange={(e) => {
            setDestination(e.target.value);
            fetchPlaces(e.target.value, "dest");
          }}
          onSelect={(item) => {
            setDestination(item.formatted);
            setDestCoords({ lat: item.lat, lon: item.lon });
            setDestSuggestions([]);
          }}
          onVoice={() => startVoiceInput(setDestination)}
        />

        <button
          onClick={() => getRoute(sourceCoords, destCoords)}
          className="
          p-3 bg-blue-600 text-white rounded-xl
          font-semibold cursor-pointer 
          hover:bg-blue-700 transition
          w-full
        "
        >
          Get Route
        </button>

        <RouteSummary
          info={routeInfo}
          source={source}
          destination={destination}
        />
      </aside>

      {/* Map Area */}
      <main className="flex-1 h-[60vh] md:h-full relative">
        <MapView
          onLocation={(pos) => setCurrentLocation(pos)}
          routeCoords={routeCoords}
          sourceCoords={sourceCoords}
          destCoords={destCoords}
        />
      </main>
    </div>
  );
}

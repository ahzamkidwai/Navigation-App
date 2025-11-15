import { useState } from "react";
import { cleanPlacesData } from "../utils/cleanPlacesData";
import { API } from "../utils/api";

export default function usePlacesAutocomplete(apiKey) {
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const fetchPlaces = async (query, type) => {
    if (query.length < 3) {
      type === "source" ? setSourceSuggestions([]) : setDestSuggestions([]);
      return;
    }

    try {
      const url = API.autocomplete(query, apiKey);
      const res = await fetch(url);
      const data = await res.json();
      const clean = cleanPlacesData(data.features);

      type === "source"
        ? setSourceSuggestions(clean)
        : setDestSuggestions(clean);
    } catch (err) {
      console.error("Autocomplete Error:", err);
    }
  };

  return {
    fetchPlaces,
    sourceSuggestions,
    destSuggestions,
    setSourceSuggestions,
    setDestSuggestions,
  };
}

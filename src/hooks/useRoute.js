import { useState } from "react";
import { API } from "../utils/api";

export default function useRoute(apiKey) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const getRoute = async (sourceCoords, destCoords) => {
    if (!sourceCoords || !destCoords) {
      alert("Please select valid Source & Destination");
      return;
    }

    try {
      const url = API.route(sourceCoords, destCoords, apiKey);
      const res = await fetch(url);
      const data = await res.json();

      const feature = data?.features?.[0];
      const coordinates = feature?.geometry?.coordinates?.[0] || [];

      const latlngs = coordinates.map((c) => ({ lat: c[1], lon: c[0] }));
      setRouteCoords(latlngs);

      setRouteInfo({
        distance: (feature.properties.distance / 1000).toFixed(2),
        duration: Math.round(feature.properties.time / 60),
        mode: feature.properties.mode,
      });
    } catch (err) {
      console.error("Route Error:", err);
    }
  };

  return { routeCoords, routeInfo, getRoute };
}

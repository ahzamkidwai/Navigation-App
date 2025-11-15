import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [35, 35],
});

export default function MapView({ onLocation }) {
  const [position, setPosition] = useState([28.6139, 77.209]); // Default Delhi

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (loc) => {
        setPosition([loc.coords.latitude, loc.coords.longitude]);
      },
      () => alert("Unable to get location")
    );
  };

  useEffect(() => {
    const btn = document.getElementById("locateMeBtn");
    if (btn) btn.addEventListener("click", getCurrentLocation);
  }, []);

  function LocationFinder({ onLocation }) {
    const map = useMap();

    useEffect(() => {
      map.locate();

      map.on("locationfound", (e) => {
        onLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }, []);

    return null;
  }

  return (
    <div className="w-full h-full">
      <MapContainer center={position} zoom={13} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationFinder onLocation={onLocation} />
        <Marker position={position} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

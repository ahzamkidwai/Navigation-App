export const cleanPlacesData = (dataArray) =>
  dataArray.map((item) => ({
    id: item.properties.place_id,
    formatted: item.properties.formatted,
    lat: item.properties.lat,
    lon: item.properties.lon,
  }));

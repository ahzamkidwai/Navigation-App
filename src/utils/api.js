export const API = {
  autocomplete: (query, key) =>
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&filter=countrycode:in&limit=10&apiKey=${key}`,

  route: (source, dest, key) =>
    `https://api.geoapify.com/v1/routing?waypoints=${source.lat},${source.lon}|${dest.lat},${dest.lon}&mode=drive&apiKey=${key}`,
};

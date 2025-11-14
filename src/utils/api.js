import axios from "axios";

export const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY || "";
export const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "";

export async function fetchOverpass(lat, lon, radius = 300) {
  const query = `
[out:json];
(
node(around:${radius}, ${lat}, ${lon});
way(around:${radius}, ${lat}, ${lon});
rel(around:${radius}, ${lat}, ${lon});
);
out center 20;
`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    query
  )}`;
  const res = await axios.get(url);
  return res.data.elements || [];
}

export async function getRoute(from, to, profile = "driving-car") {
  if (!ORS_API_KEY) throw new Error("Missing ORS API key in VITE_ORS_API_KEY");

  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
  const body = {
    coordinates: [
      [from.lng, from.lat],
      [to.lng, to.lat],
    ],
  };
  const res = await axios.post(url, body, {
    headers: { Authorization: ORS_API_KEY, "Content-Type": "application/json" },
  });
  return res.data;
}

export async function hfTextGeneration(prompt, max_new_tokens = 120) {
  // uses @huggingface/inference library; you can also use direct REST
  // Here we use REST to keep it simple without adding the SDK to bundle
  if (!HF_API_KEY) throw new Error("Missing HF API key in VITE_HF_API_KEY");
  const res = await axios.post(
    "https://api-inference.huggingface.co/models/google/flan-t5-large",
    { inputs: prompt, parameters: { max_new_tokens } },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
  );
  // response can be a string or object depending on model and cache; we guard
  if (res.data?.generated_text) return res.data.generated_text;
  if (Array.isArray(res.data) && res.data[0]?.generated_text)
    return res.data[0].generated_text;
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
}

export async function hfZeroShotClassification(text, labels) {
  if (!HF_API_KEY) throw new Error("Missing HF API key in VITE_HF_API_KEY");
  const url =
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
  const res = await axios.post(
    url,
    { inputs: text, parameters: { candidate_labels: labels } },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
  );
  return res.data;
}

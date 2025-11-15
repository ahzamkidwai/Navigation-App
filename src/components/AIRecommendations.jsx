import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function AIRecommendations({ coords }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIRecommendation = async () => {
    if (!coords) {
      alert("Please allow location access first.");
      return;
    }

    setLoading(true);
    setResult("");

    const prompt = `
You are an AI travel assistant.
User's Location: latitude ${coords.lat}, longitude ${coords.lng}.
User is searching for: ${query}.
Recommend the best 5 places nearby with short descriptions.
Return clean bullet points.
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer hf_xxxxxxxx", // <-- Put your free HF token
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();
    setLoading(false);

    if (data.error) {
      setResult("Model is loading... try again in 10 seconds.");
      return;
    }

    setResult(data[0]?.generated_text || "No results found.");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-4">
      <h2 className="font-bold text-lg text-blue-600">
        AI Place Recommendations
      </h2>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Search: cafes, parks, restaurants..."
          className="flex-1 p-3 border rounded-xl bg-gray-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={getAIRecommendation}
          disabled={loading}
          className="px-4 bg-purple-600 text-white rounded-xl cursor-pointer flex items-center gap-2"
        >
          <FiSearch size={18} />
          {loading ? "Thinking..." : "AI Search"}
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-gray-100 p-3 rounded-xl whitespace-pre-wrap text-gray-700">
          {result}
        </div>
      )}
    </div>
  );
}

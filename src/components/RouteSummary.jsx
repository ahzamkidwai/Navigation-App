export default function RouteSummary({ info, source, destination }) {
  if (!info) return null;

  return (
    <div
      className="
        bg-blue-50 border border-blue-200 rounded-xl 
        p-3 md:p-4 mt-2 shadow-md 
        w-full
      "
    >
      <h2
        className="
          text-base md:text-lg 
          font-semibold text-blue-700
        "
      >
        Route Summary
      </h2>

      <div
        className="
          mt-3 space-y-2 
          text-xs sm:text-sm md:text-base 
          text-gray-700
          break-words
        "
      >
        <p>
          <span className="font-semibold">From:</span> {source}
        </p>
        <p>
          <span className="font-semibold">To:</span> {destination}
        </p>

        <hr className="my-2" />

        <p>
          <span className="font-semibold">Distance:</span> {info.distance} km
        </p>
        <p>
          <span className="font-semibold">Duration:</span> {info.duration} min
        </p>
        <p>
          <span className="font-semibold">Mode:</span> {info.mode}
        </p>
      </div>
    </div>
  );
}

export function Rating({
  value,
  count,
}: {
  value: number;
  count?: number;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {/* Rating badge */}
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-full
          border
          border-[#ead9a8]
          bg-[#fbf6e8]
          px-2
          py-1
        "
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-[#c69220]"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>

        <span
          className="
            text-xs
            font-semibold
            text-[#765818]
          "
        >
          {value.toFixed(1)}
        </span>
      </span>

      {/* Review count */}
      {count !== undefined && (
        <span className="text-xs text-slate">
          {count.toLocaleString("en-IN")}{" "}
          {count === 1 ? "review" : "reviews"}
        </span>
      )}
    </span>
  );
}
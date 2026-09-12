export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);

  return (
    <nav
      className="
        flex
        items-center
        justify-center
        gap-1.5
        pt-4
      "
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="
          inline-flex
          h-10
          items-center
          gap-1.5
          rounded-full
          border
          border-[#d9dfd4]
          bg-white
          px-3.5
          text-xs
          font-medium
          text-[#31533c]
          shadow-sm
          transition
          hover:border-[#24543b]
          hover:bg-[#edf3e8]
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:border-[#d9dfd4]
          disabled:hover:bg-white
          sm:px-4
          sm:text-sm
        "
      >
        <span aria-hidden="true">←</span>
        <span>Prev</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="
                flex
                h-10
                w-7
                items-center
                justify-center
                text-sm
                text-slate
              "
            >
              …
            </span>
          ) : (
            <button
              type="button"
              key={p}
              onClick={() => onChange(p)}
              aria-current={
                p === page ? "page" : undefined
              }
              aria-label={`Go to page ${p}`}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                text-sm
                font-medium
                transition
                ${
                  p === page
                    ? "border-[#24543b] bg-[#24543b] text-white shadow-sm"
                    : "border-[#d9dfd4] bg-white text-[#31533c] hover:border-[#24543b] hover:bg-[#edf3e8]"
                }
              `}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="
          inline-flex
          h-10
          items-center
          gap-1.5
          rounded-full
          border
          border-[#d9dfd4]
          bg-white
          px-3.5
          text-xs
          font-medium
          text-[#31533c]
          shadow-sm
          transition
          hover:border-[#24543b]
          hover:bg-[#edf3e8]
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:border-[#d9dfd4]
          disabled:hover:bg-white
          sm:px-4
          sm:text-sm
        "
      >
        <span>Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}

function getPageWindow(
  current: number,
  total: number
): (number | "…")[] {
  const window = 1;
  const pages: (number | "…")[] = [];

  for (let p = 1; p <= total; p++) {
    if (
      p === 1 ||
      p === total ||
      Math.abs(p - current) <= window
    ) {
      pages.push(p);
    } else if (
      pages[pages.length - 1] !== "…"
    ) {
      pages.push("…");
    }
  }

  return pages;
}
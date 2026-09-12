"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";

import { SearchBar } from "./SearchBar";

import {
  FilterSidebar,
  type Facets,
  type FilterState,
} from "./FilterSidebar";

import { CollegeCard } from "./CollegeCard";
import { Pagination } from "./Pagination";

import {
  SORT_OPTIONS,
  type SortOption,
} from "@/lib/collegeQuery";

import type { CollegeListItem } from "@/lib/queryColleges";

type ListResponse = {
  data: CollegeListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export function CollegeSearch({
  initialData,
  facets,
}: {
  initialData: ListResponse;
  facets: Facets;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] =
    useState<ListResponse>(initialData);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const isFirstRender = useRef(true);

  /* =====================================================
     URL PARAMETERS
     ===================================================== */

  const q =
    searchParams.get("q") ?? "";

  const district =
    searchParams.get("district") ?? "";

  const stream =
    searchParams.get("stream") ?? "";

  const type =
    searchParams.get("type") ?? "";

  const minRating =
    searchParams.get("minRating") ?? "";

  const maxFees =
    searchParams.get("maxFees") ?? "";

  const sort =
    (searchParams.get("sort") as SortOption) ||
    "rating_desc";

  /* =====================================================
     UPDATE URL
     ===================================================== */

  const updateParams = useCallback(
    (
      patch: Record<
        string,
        string | number | undefined
      >,
      resetPage = true
    ) => {
      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      Object.entries(patch).forEach(
        ([key, value]) => {
          if (
            value === undefined ||
            value === ""
          ) {
            params.delete(key);
          } else {
            params.set(
              key,
              String(value)
            );
          }
        }
      );

      if (resetPage) {
        params.delete("page");
      }

      const query =
        params.toString();

      router.push(
        query
          ? `${pathname}?${query}`
          : pathname,
        {
          scroll: false,
        }
      );
    },
    [
      router,
      pathname,
      searchParams,
    ]
  );

  /* =====================================================
     FETCH RESULTS
     ===================================================== */

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller =
      new AbortController();

    setLoading(true);
    setError(null);

    fetch(
      `/api/colleges?${searchParams.toString()}`,
      {
        signal:
          controller.signal,
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Search failed. Please try again."
          );
        }

        return res.json();
      })
      .then(
        (data: ListResponse) => {
          setResult(data);
        }
      )
      .catch((err) => {
        if (
          err.name !==
          "AbortError"
        ) {
          setError(
            err.message
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () =>
      controller.abort();
  }, [searchParams]);

  /* =====================================================
     FILTER STATE
     ===================================================== */

  const filters: FilterState = {
    district,
    stream,
    type,
    minRating,
    maxFees,
  };

  const hasFilters =
    Boolean(
      q ||
        district ||
        stream ||
        type ||
        minRating ||
        maxFees
    );

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* =================================================
          BACKGROUND IMAGE
          ================================================= */}

      <div
        className="
          fixed
          inset-0
          -z-20
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            'url("/college-campus.jpg")',
        }}
      />

      {/* =================================================
          BRIGHT OVERLAY
          ================================================= */}

      <div
        className="
          fixed
          inset-0
          -z-10
          bg-[#f7f5ef]/30
        "
      />

      {/* =================================================
          HEADER
          ================================================= */}

      <section
        className="
          relative
          border-b
          border-[#e6e1d5]
          bg-[#f7f5ef]/88
          backdrop-blur-[2px]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-4
            pb-7
            pt-9
            sm:px-6
            lg:px-8
          "
        >

          {/* Label */}

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[#d29b25]
              "
            />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#8b6b20]
              "
            >
              Vidya discovery
            </span>
          </div>

          {/* Heading */}

          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <h1
                className="
                  font-display
                  text-4xl
                  leading-tight
                  text-[#173a2a]
                  sm:text-5xl
                "
              >
                Find the right college.
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate
                  sm:text-base
                "
              >
                Explore colleges across Tamil Nadu,
                compare courses, fees and placements,
                and find a college that fits you.
              </p>

            </div>

            {/* College count */}

            <div
              className="
                hidden
                shrink-0
                rounded-full
                border
                border-[#d9dfd4]
                bg-white
                px-4
                py-2
                text-sm
                text-slate
                shadow-sm
                sm:block
              "
            >
              <span
                className="
                  font-semibold
                  text-[#24543b]
                "
              >
                {result.pagination.total}
              </span>{" "}
              colleges
            </div>

          </div>

          {/* =================================================
              SEARCH + SORT
              ================================================= */}

          <div
            className="
              mt-7
              flex
              flex-col
              gap-3
              lg:flex-row
            "
          >

            {/* Search */}

            <div
              className="
                relative
                min-w-0
                flex-1
              "
            >
              <SearchBar
                initialValue={q}
                placeholder="Search by college name, district or course..."
                onSearch={(value) =>
                  updateParams({
                    q: value,
                  })
                }
              />
            </div>

            {/* Sort */}

            <div
              className="
                flex
                gap-2
              "
            >

              <div
                className="
                  relative
                  flex-1
                  lg:flex-none
                "
              >

                <select
                  value={sort}
                  onChange={(e) =>
                    updateParams(
                      {
                        sort:
                          e.target.value,
                      },
                      false
                    )
                  }
                  className="
                    h-full
                    w-full
                    min-w-[180px]
                    appearance-none
                    rounded-xl
                    border
                    border-[#d9dfd4]
                    bg-white
                    px-4
                    py-3
                    pr-10
                    text-sm
                    font-medium
                    text-[#173a2a]
                    outline-none
                    transition
                    hover:border-[#24543b]
                    focus:border-[#24543b]
                    focus:ring-2
                    focus:ring-[#24543b]/10
                  "
                  aria-label="Sort by"
                >

                  {SORT_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}

                </select>

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate
                  "
                >
                  ↓
                </span>

              </div>

              {/* Mobile filter */}

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    (value) =>
                      !value
                  )
                }
                className="
                  rounded-xl
                  border
                  border-[#24543b]
                  bg-[#24543b]
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-[#183f2c]
                  lg:hidden
                "
              >
                {mobileFiltersOpen
                  ? "Close"
                  : "Filters"}
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-4
          py-7
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            flex
            flex-col
            gap-10
            lg:flex-row
          "
        >

          {/* =================================================
              LEFT FILTER SIDEBAR
              ================================================= */}

          <aside
            className={`
              ${
                mobileFiltersOpen
                  ? "block"
                  : "hidden"
              }
              w-full
              shrink-0
              lg:block
              lg:w-[320px]
            `}
          >

            <FilterSidebar
              facets={facets}
              filters={filters}
              onChange={(patch) =>
                updateParams(patch)
              }
              onReset={() => {
                router.push(
                  pathname,
                  {
                    scroll: false,
                  }
                );

                setMobileFiltersOpen(
                  false
                );
              }}
            />

          </aside>

          {/* =================================================
              RIGHT COLLEGE RESULTS
              ================================================= */}

          <section
            className="
              min-w-0
              flex-1
            "
          >

            {/* Result header */}

            <div
              className="
                mb-5
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-white
                    drop-shadow
                  "
                >

                  {loading ? (
                    "Finding colleges..."
                  ) : (
                    <>
                      <span className="font-bold">
                        {result.pagination.total}
                      </span>{" "}
                      colleges found
                    </>
                  )}

                </p>

                {district && (
                  <p
                    className="
                      mt-1
                      text-xs
                      text-white
                      drop-shadow
                    "
                  >
                    Results in{" "}
                    <span className="font-semibold">
                      {district}
                    </span>
                  </p>
                )}

              </div>

              {/* Active filters */}

              {hasFilters && (
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {district && (
                    <FilterPill
                      label={`📍 ${district}`}
                      onRemove={() =>
                        updateParams({
                          district:
                            undefined,
                        })
                      }
                    />
                  )}

                  {stream && (
                    <FilterPill
                      label={stream}
                      onRemove={() =>
                        updateParams({
                          stream:
                            undefined,
                        })
                      }
                    />
                  )}

                  {type && (
                    <FilterPill
                      label={type}
                      onRemove={() =>
                        updateParams({
                          type:
                            undefined,
                        })
                      }
                    />
                  )}

                  {minRating && (
                    <FilterPill
                      label={`★ ${minRating}+`}
                      onRemove={() =>
                        updateParams({
                          minRating:
                            undefined,
                        })
                      }
                    />
                  )}

                  {maxFees && (
                    <FilterPill
                      label={`≤ ₹${Number(
                        maxFees
                      ).toLocaleString(
                        "en-IN"
                      )}`}
                      onRemove={() =>
                        updateParams({
                          maxFees:
                            undefined,
                        })
                      }
                    />
                  )}

                </div>
              )}

            </div>

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-5
                  text-sm
                  text-red-700
                "
              >

                <p className="font-semibold">
                  Something went wrong
                </p>

                <p className="mt-1">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                NO RESULTS
                ================================================= */}

            {!error &&
              result.data.length ===
                0 &&
              !loading && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-[#e0ddd4]
                    bg-white/95
                    px-6
                    py-16
                    text-center
                    shadow-sm
                  "
                >

                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-[#edf3e8]
                      text-2xl
                    "
                  >
                    🔎
                  </div>

                  <h2
                    className="
                      mt-5
                      font-display
                      text-2xl
                      text-[#173a2a]
                    "
                  >
                    No colleges found
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-slate
                    "
                  >
                    We couldn't find colleges
                    matching these filters.
                    Try another district or
                    clear a filter.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        pathname,
                        {
                          scroll: false,
                        }
                      )
                    }
                    className="
                      mt-6
                      rounded-full
                      bg-[#24543b]
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-[#183f2c]
                    "
                  >
                    Clear filters
                  </button>

                </div>
              )}

            {/* =================================================
                LOADING
                ================================================= */}

            {loading &&
              result.data.length ===
                0 && (
                <div
                  className="
                    grid
                    gap-6
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >

                  {Array.from({
                    length: 6,
                  }).map(
                    (_, index) => (
                      <CollegeSkeleton
                        key={index}
                      />
                    )
                  )}

                </div>
              )}

            {/* =================================================
                COLLEGE CARDS
                ================================================= */}

            {result.data.length >
              0 && (
              <div
                className={`
                  grid
                  gap-6
                  sm:grid-cols-2
                  xl:grid-cols-3
                  transition-opacity
                  duration-200
                  ${
                    loading
                      ? "opacity-50"
                      : "opacity-100"
                  }
                `}
              >

                {result.data.map(
                  (college) => (
                    <CollegeCard
                      key={college.id}
                      college={
                        college
                      }
                    />
                  )
                )}

              </div>
            )}

            {/* =================================================
                PAGINATION
                ================================================= */}

            {!loading &&
              result.data.length >
                0 && (
                <div
                  className="
                    mt-10
                    flex
                    justify-center
                  "
                >

                  <Pagination
                    page={
                      result.pagination
                        .page
                    }
                    totalPages={
                      result.pagination
                        .totalPages
                    }
                    onChange={(p) =>
                      updateParams(
                        {
                          page: p,
                        },
                        false
                      )
                    }
                  />

                </div>
              )}

          </section>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   FILTER PILL
   ========================================================= */

function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-[#d9dfd4]
        bg-white
        px-3
        py-1.5
        text-xs
        font-medium
        text-[#31533c]
        shadow-sm
        transition
        hover:border-[#24543b]
        hover:bg-[#edf3e8]
      "
    >
      {label}

      <span className="text-slate">
        ×
      </span>
    </button>
  );
}

/* =========================================================
   LOADING SKELETON
   ========================================================= */

function CollegeSkeleton() {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#e0ddd4]
        bg-white
      "
    >

      <div
        className="
          m-2
          h-36
          animate-pulse
          rounded-xl
          bg-[#e9e7df]
        "
      />

      <div className="space-y-3 p-5">

        <div
          className="
            h-6
            w-4/5
            animate-pulse
            rounded
            bg-[#e9e7df]
          "
        />

        <div
          className="
            h-4
            w-3/5
            animate-pulse
            rounded
            bg-[#eeece6]
          "
        />

        <div className="flex gap-2">

          <div
            className="
              h-6
              w-20
              animate-pulse
              rounded-full
              bg-[#edf3e8]
            "
          />

          <div
            className="
              h-6
              w-24
              animate-pulse
              rounded-full
              bg-[#edf3e8]
            "
          />

        </div>

        <div className="h-px bg-[#ece9e1]" />

        <div className="flex justify-between">

          <div
            className="
              h-5
              w-24
              animate-pulse
              rounded
              bg-[#e9e7df]
            "
          />

          <div
            className="
              h-5
              w-20
              animate-pulse
              rounded
              bg-[#e9e7df]
            "
          />

        </div>

      </div>

      <div
        className="
          border-t
          border-[#ece9e1]
          p-4
        "
      >

        <div
          className="
            h-10
            animate-pulse
            rounded-full
            bg-[#edf3e8]
          "
        />

      </div>

    </div>
  );
}
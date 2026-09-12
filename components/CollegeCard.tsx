"use client";

import Link from "next/link";
import { Rating } from "./Rating";
import { formatINR, streamsList } from "@/lib/format";
import { useCompareTray } from "./CompareTrayProvider";
import type { CollegeListItem } from "@/lib/queryColleges";

export function CollegeCard({
  college,
}: {
  college: CollegeListItem;
}) {
  const { add, remove, isSelected } =
    useCompareTray();

  const selected = isSelected(college.slug);

  const streams = streamsList(college.streams);

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-line
        bg-surface
        flex
        flex-col
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_35px_rgba(20,55,35,0.10)]
      "
      style={{
        borderLeftColor: college.heroColor,
        borderLeftWidth: 4,
      }}
    >
      {/* =========================================
          COLLEGE VISUAL / IMAGE AREA
          ========================================= */}
      <Link
        href={`/colleges/${college.slug}`}
        className="block"
      >
        <div
          className="
            relative
            mx-2
            mt-2
            h-36
            overflow-hidden
            rounded-xl
          "
          style={{
            background: `
              linear-gradient(
                135deg,
                ${college.heroColor || "#24543B"} 0%,
                #183F2C 100%
              )
            `,
          }}
        >
          {/* Decorative campus-style visual */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-white" />
            <div className="absolute -left-10 bottom-[-45px] h-40 w-40 rounded-full border-[22px] border-white" />
          </div>

          {/* Building illustration */}
          <div className="absolute bottom-0 left-0 right-0 px-6">
            <div className="relative h-24 rounded-t-2xl bg-white/90 shadow-lg">

              {/* Building roof */}
              <div className="absolute -top-3 left-5 right-5 h-3 rounded-full bg-white" />

              {/* Windows */}
              <div className="flex h-full items-end justify-center gap-3 pb-3">
                {Array.from({ length: 7 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="
                        h-9
                        w-5
                        rounded-sm
                        border
                        border-white
                        bg-slate-300/80
                      "
                    />
                  )
                )}
              </div>

              {/* Entrance */}
              <div className="absolute bottom-0 left-1/2 h-12 w-10 -translate-x-1/2 rounded-t-lg bg-slate-500/80" />
            </div>
          </div>

          {/* College type badge */}
          <div
            className="
              absolute
              bottom-3
              left-3
              rounded-full
              border
              border-white/70
              bg-white/95
              px-3
              py-1
              text-[11px]
              font-medium
              text-ink
              shadow-sm
            "
          >
            🎓 {college.type}
          </div>

          {/* Favorite-style button */}
          <div
            className="
              absolute
              right-3
              top-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/95
              text-slate
              shadow-sm
              transition
              group-hover:text-gold
            "
            aria-hidden="true"
          >
            ♡
          </div>
        </div>
      </Link>

      {/* =========================================
          CONTENT
          ========================================= */}
      <div className="flex grow flex-col px-4 pb-4 pt-3">

        {/* College name */}
        <Link
          href={`/colleges/${college.slug}`}
          className="min-w-0"
        >
          <h3
            className="
              font-display
              text-xl
              leading-[1.12]
              text-ink
              transition-colors
              duration-200
              group-hover:text-green-800
              line-clamp-3
            "
          >
            {college.name}
          </h3>
        </Link>

        {/* Location */}
        <p
          className="
            mt-2
            flex
            items-center
            gap-1.5
            text-sm
            text-slate
          "
        >
          <span className="text-base">
            📍
          </span>

          <span className="truncate">
            {college.city}, {college.state}
          </span>

          <span className="shrink-0">
            ·
          </span>

          <span className="shrink-0">
            Est. {college.establishedYear}
          </span>
        </p>

        {/* Stream badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {streams.slice(0, 4).map(
            (stream) => (
              <span
                key={stream}
                className="
                  rounded-full
                  bg-[#edf3e8]
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-[#31533c]
                "
              >
                {stream}
              </span>
            )
          )}

          {streams.length > 4 && (
            <span
              className="
                rounded-full
                bg-[#f4f0df]
                px-2.5
                py-1
                text-[11px]
                text-slate
              "
            >
              +{streams.length - 4}
            </span>
          )}
        </div>

        {/* =========================================
            RATING + FEES
            ========================================= */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-line
            pt-3
          "
        >
          <div className="flex items-center gap-1.5">
            <span className="text-lg text-[#d99a16]">
              ★
            </span>

            <Rating
              value={college.rating}
              count={college.reviewCount}
            />
          </div>

          <div className="text-right">
            <span className="text-base font-semibold text-ink">
              {formatINR(
                college.avgFeesPerYear
              )}
            </span>

            <span className="ml-1 text-xs text-slate">
              /yr
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          ACTIONS
          ========================================= */}
      <div
        className="
          flex
          items-center
          gap-2
          border-t
          border-line
          px-4
          py-3
        "
      >
        <Link
          href={`/colleges/${college.slug}`}
          className="
            flex
            grow
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#24543b]
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition-all
            duration-200
            hover:bg-[#183f2c]
          "
        >
          View details
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (selected) {
              remove(college.slug);
              return;
            }

            const res = add({
              slug: college.slug,
              name: college.name,
            });

            if (!res.ok && res.reason) {
              alert(res.reason);
            }
          }}
          className={`
            shrink-0
            rounded-full
            border
            px-4
            py-2.5
            text-xs
            font-medium
            transition-all
            duration-200
            ${
              selected
                ? "border-[#24543b] bg-[#24543b] text-white"
                : "border-[#cfd9cf] bg-white text-[#31533c] hover:border-[#24543b] hover:bg-[#f3f7f1]"
            }
          `}
        >
          {selected
            ? "✓ Added"
            : "+ Compare"}
        </button>
      </div>
    </article>
  );
}
"use client";

import { useState } from "react";
import { Rating } from "./Rating";
import {
  formatINR,
  formatLPA,
  streamsList,
} from "@/lib/format";
import { useCompareTray } from "./CompareTrayProvider";

type CollegeDetail = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  establishedYear: number;
  rating: number;
  reviewCount: number;
  avgFeesPerYear: number;
  description: string;
  streams: string;
  campusSizeAcres: number | null;
  heroColor: string;

  courses: {
    id: string;
    name: string;
    degree: string;
    durationYears: number;
    feesTotal: number;
    seats: number;
  }[];

  placements: {
    id: string;
    year: number;
    avgPackageLPA: number;
    highestPackageLPA: number;
    medianPackageLPA: number;
    placementPercent: number;
    topRecruiters: string;
  }[];

  reviews: {
    id: string;
    authorName: string;
    rating: number;
    title: string;
    content: string;
    pros: string | null;
    cons: string | null;
  }[];
};

const TABS = [
  "Overview",
  "Courses",
  "Placements",
  "Reviews",
] as const;

export function CollegeDetailTabs({
  college,
}: {
  college: CollegeDetail;
}) {
  const [tab, setTab] =
    useState<(typeof TABS)[number]>("Overview");

  const {
    add,
    remove,
    isSelected,
  } = useCompareTray();

  const selected = isSelected(college.slug);

  const latestPlacement =
    college.placements[0];

  const streams = streamsList(
    college.streams
  );

  return (
    <div className="min-h-screen bg-[#f4f7f1]">

      {/* =====================================================
          GREEN HERO
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#173f2b]">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div
            className="
              absolute
              -right-24
              -top-32
              h-80
              w-80
              rounded-full
              border-[55px]
              border-white/5
            "
          />

          <div
            className="
              absolute
              -left-28
              bottom-[-150px]
              h-96
              w-96
              rounded-full
              border-[65px]
              border-white/5
            "
          />

          <div
            className="
              absolute
              right-[22%]
              top-1/2
              h-32
              w-32
              rounded-full
              bg-[#c69220]/10
              blur-3xl
            "
          />

        </div>

        {/* Main hero */}
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-xs">

            <span className="text-white/55">
              Colleges
            </span>

            <span className="text-white/30">
              /
            </span>

            <span className="font-medium text-white/90">
              {college.city}
            </span>

          </div>

          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            {/* College information */}
            <div className="min-w-0">

              {/* College type */}
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-3.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-white
                  backdrop-blur
                "
              >
                <span>🎓</span>
                {college.type}
              </span>

              {/* College name */}
              <h1
                className="
                  mt-5
                  max-w-5xl
                  font-display
                  text-4xl
                  font-semibold
                  leading-[1.05]
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {college.name}
              </h1>

              {/* Location */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  text-sm
                  text-white/70
                "
              >

                <span className="flex items-center gap-2">
                  <span className="text-[#e0b33e]">
                    ●
                  </span>

                  {college.city},{" "}
                  {college.state}
                </span>

                <span className="hidden text-white/25 sm:inline">
                  •
                </span>

                <span>
                  Established{" "}
                  {college.establishedYear}
                </span>

              </div>

              {/* Rating */}
              <div className="mt-5">

                <div
                  className="
                    inline-flex
                    rounded-xl
                    border
                    border-white/10
                    bg-white/10
                    p-1
                    backdrop-blur
                  "
                >
                  <Rating
                    value={college.rating}
                    count={college.reviewCount}
                  />
                </div>

              </div>

            </div>

            {/* Compare button */}
            <div className="shrink-0">

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

                  if (
                    !res.ok &&
                    res.reason
                  ) {
                    alert(res.reason);
                  }
                }}
                className={`
                  w-full
                  rounded-full
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  sm:w-auto
                  ${
                    selected
                      ? `
                        border
                        border-white
                        bg-white
                        text-[#173f2b]
                        shadow-lg
                      `
                      : `
                        border
                        border-white/25
                        bg-white/10
                        text-white
                        backdrop-blur
                        hover:bg-white
                        hover:text-[#173f2b]
                      `
                  }
                `}
              >
                {selected
                  ? "✓ Added to compare"
                  : "+ Add to compare"}
              </button>

            </div>

          </div>

          {/* =================================================
              QUICK STATS
              ================================================= */}

          <div
            className="
              mt-10
              grid
              grid-cols-2
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-white
              shadow-[0_20px_50px_rgba(0,0,0,0.16)]
              sm:grid-cols-4
            "
          >

            <StatCard
              label="Average fees / year"
              value={formatINR(
                college.avgFeesPerYear
              )}
            />

            <StatCard
              label="Average package"
              value={
                latestPlacement
                  ? formatLPA(
                      latestPlacement.avgPackageLPA
                    )
                  : "—"
              }
            />

            <StatCard
              label="Placement rate"
              value={
                latestPlacement
                  ? `${latestPlacement.placementPercent}%`
                  : "—"
              }
            />

            <StatCard
              label="Campus size"
              value={
                college.campusSizeAcres
                  ? `${college.campusSizeAcres} acres`
                  : "—"
              }
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          TABS
          ===================================================== */}

      <div
        className="
          sticky
          top-0
          z-30
          border-b
          border-[#dbe4d8]
          bg-white/95
          shadow-sm
          backdrop-blur-xl
        "
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <nav
            className="
              flex
              gap-1
              overflow-x-auto
            "
            role="tablist"
          >

            {TABS.map((t) => {
              const active = tab === t;

              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className={`
                    relative
                    shrink-0
                    px-5
                    py-4
                    text-sm
                    transition-colors
                    ${
                      active
                        ? "font-semibold text-[#24543b]"
                        : "text-[#718078] hover:text-[#173f2b]"
                    }
                  `}
                >
                  {t}

                  {active && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-3
                        right-3
                        h-[3px]
                        rounded-full
                        bg-[#24543b]
                      "
                    />
                  )}

                </button>
              );
            })}

          </nav>

        </div>

      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <main
        className="
          mx-auto
          max-w-7xl
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >

        {/* ===================================================
            OVERVIEW
            =================================================== */}

        {tab === "Overview" && (
          <div
            className="
              grid
              gap-7
              lg:grid-cols-[minmax(0,1fr)_340px]
            "
          >

            {/* About */}
            <section
              className="
                rounded-2xl
                border
                border-[#dbe4d8]
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(23,63,43,0.06)]
                sm:p-8
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#eaf2e7]
                    text-lg
                  "
                >
                  🌿
                </div>

                <div>

                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#8b6b20]
                    "
                  >
                    About the college
                  </p>

                </div>

              </div>

              <h2
                className="
                  mt-5
                  font-display
                  text-2xl
                  font-semibold
                  text-[#173f2b]
                  sm:text-3xl
                "
              >
                Discover {college.name}
              </h2>

              <p
                className="
                  mt-5
                  text-sm
                  leading-7
                  text-[#66746c]
                  sm:text-base
                "
              >
                {college.description}
              </p>

              {/* Streams */}
              <div className="mt-8">

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-[#173f2b]
                  "
                >
                  Available streams
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {streams.map(
                    (stream) => (
                      <span
                        key={stream}
                        className="
                          rounded-full
                          border
                          border-[#d8e5d5]
                          bg-[#edf4e9]
                          px-3.5
                          py-1.5
                          text-xs
                          font-semibold
                          text-[#315d42]
                        "
                      >
                        {stream}
                      </span>
                    )
                  )}

                </div>

              </div>

            </section>

            {/* At a glance */}
            <section
              className="
                rounded-2xl
                border
                border-[#dbe4d8]
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(23,63,43,0.06)]
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#24543b]
                    text-white
                  "
                >
                  ✓
                </div>

                <div>

                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#8b6b20]
                    "
                  >
                    At a glance
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-4">

                <InfoRow
                  label="Location"
                  value={`${college.city}, ${college.state}`}
                />

                <InfoRow
                  label="College type"
                  value={college.type}
                />

                <InfoRow
                  label="Established"
                  value={String(
                    college.establishedYear
                  )}
                />

                <InfoRow
                  label="Annual fees"
                  value={formatINR(
                    college.avgFeesPerYear
                  )}
                />

                <InfoRow
                  label="Rating"
                  value={`${college.rating} / 5`}
                />

                <InfoRow
                  label="Reviews"
                  value={college.reviewCount.toLocaleString(
                    "en-IN"
                  )}
                />

              </div>

            </section>

          </div>
        )}

        {/* ===================================================
            COURSES
            =================================================== */}

        {tab === "Courses" && (
          <section>

            <SectionHeading
              eyebrow="Academic programs"
              title="Courses offered"
              icon="📚"
            />

            {/* Desktop table */}
            <div
              className="
                hidden
                overflow-hidden
                rounded-2xl
                border
                border-[#dbe4d8]
                bg-white
                shadow-[0_8px_30px_rgba(23,63,43,0.06)]
                md:block
              "
            >

              <table className="w-full text-sm">

                <thead>
                  <tr
                    className="
                      border-b
                      border-[#dbe4d8]
                      bg-[#edf4e9]
                      text-left
                    "
                  >

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                        text-[#315d42]
                      "
                    >
                      Course
                    </th>

                    <th
                      className="
                        px-4
                        py-4
                        font-semibold
                        text-[#315d42]
                      "
                    >
                      Duration
                    </th>

                    <th
                      className="
                        px-4
                        py-4
                        font-semibold
                        text-[#315d42]
                      "
                    >
                      Total fees
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-right
                        font-semibold
                        text-[#315d42]
                      "
                    >
                      Seats
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {college.courses.map(
                    (course) => (
                      <tr
                        key={course.id}
                        className="
                          border-b
                          border-[#edf0eb]
                          last:border-0
                          transition
                          hover:bg-[#f7faf5]
                        "
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-start gap-3">

                            <div
                              className="
                                mt-0.5
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#24543b]
                                text-sm
                                font-bold
                                text-white
                              "
                            >
                              C
                            </div>

                            <div>

                              <p
                                className="
                                  font-semibold
                                  text-[#173f2b]
                                "
                              >
                                {course.name}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-[#758178]
                                "
                              >
                                {course.degree}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td
                          className="
                            px-4
                            py-5
                            text-[#66746c]
                          "
                        >
                          {course.durationYears} years
                        </td>

                        <td
                          className="
                            px-4
                            py-5
                            font-semibold
                            text-[#24543b]
                          "
                        >
                          {formatINR(
                            course.feesTotal
                          )}
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                            text-right
                            font-medium
                            text-[#66746c]
                          "
                        >
                          {course.seats}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">

              {college.courses.map(
                (course) => (
                  <div
                    key={course.id}
                    className="
                      rounded-2xl
                      border
                      border-[#dbe4d8]
                      bg-white
                      p-5
                      shadow-[0_6px_24px_rgba(23,63,43,0.06)]
                    "
                  >

                    <div className="flex items-start gap-3">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#24543b]
                          text-sm
                          font-bold
                          text-white
                        "
                      >
                        C
                      </div>

                      <div>

                        <h3
                          className="
                            font-display
                            text-lg
                            font-semibold
                            text-[#173f2b]
                          "
                        >
                          {course.name}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-[#758178]
                          "
                        >
                          {course.degree}
                        </p>

                      </div>

                    </div>

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-3
                        gap-2
                      "
                    >

                      <MiniStat
                        label="Duration"
                        value={`${course.durationYears} yrs`}
                      />

                      <MiniStat
                        label="Fees"
                        value={formatINR(
                          course.feesTotal
                        )}
                      />

                      <MiniStat
                        label="Seats"
                        value={String(
                          course.seats
                        )}
                      />

                    </div>

                  </div>
                )
              )}

            </div>

            {college.courses.length ===
              0 && (
              <EmptyState text="Course information is not available yet." />
            )}

          </section>
        )}

        {/* ===================================================
            PLACEMENTS
            =================================================== */}

        {tab === "Placements" && (
          <section>

            <SectionHeading
              eyebrow="Career outcomes"
              title="Placement performance"
              icon="📈"
            />

            <div className="space-y-5">

              {college.placements.map(
                (placement) => (
                  <article
                    key={placement.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#dbe4d8]
                      bg-white
                      shadow-[0_8px_30px_rgba(23,63,43,0.06)]
                    "
                  >

                    {/* Green top strip */}
                    <div className="h-1.5 bg-[#24543b]" />

                    <div className="p-6 sm:p-7">

                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >

                        <div>

                          <span
                            className="
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-[0.16em]
                              text-[#8b6b20]
                            "
                          >
                            Placement year
                          </span>

                          <h3
                            className="
                              mt-1
                              font-display
                              text-3xl
                              font-semibold
                              text-[#173f2b]
                            "
                          >
                            {placement.year}
                          </h3>

                        </div>

                        <span
                          className="
                            inline-flex
                            w-fit
                            items-center
                            rounded-full
                            border
                            border-[#cfe0cb]
                            bg-[#edf4e9]
                            px-4
                            py-2
                            text-xs
                            font-bold
                            text-[#24543b]
                          "
                        >
                          {placement.placementPercent}%
                          &nbsp; placed
                        </span>

                      </div>

                      {/* Placement stats */}
                      <div
                        className="
                          mt-6
                          grid
                          grid-cols-1
                          gap-3
                          sm:grid-cols-3
                        "
                      >

                        <PlacementStat
                          label="Average package"
                          value={formatLPA(
                            placement.avgPackageLPA
                          )}
                        />

                        <PlacementStat
                          label="Median package"
                          value={formatLPA(
                            placement.medianPackageLPA
                          )}
                        />

                        <PlacementStat
                          label="Highest package"
                          value={formatLPA(
                            placement.highestPackageLPA
                          )}
                          highlight
                        />

                      </div>

                      {/* Recruiters */}
                      <div
                        className="
                          mt-6
                          border-t
                          border-[#e7ece4]
                          pt-5
                        "
                      >

                        <p
                          className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-[#758178]
                          "
                        >
                          Top recruiters
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {placement.topRecruiters
                            .split(",")
                            .map(
                              (recruiter) => (
                                <span
                                  key={recruiter}
                                  className="
                                    rounded-full
                                    border
                                    border-[#dbe4d8]
                                    bg-[#f7faf5]
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-[#315d42]
                                  "
                                >
                                  {recruiter.trim()}
                                </span>
                              )
                            )}

                        </div>

                      </div>

                    </div>

                  </article>
                )
              )}

              {college.placements.length ===
                0 && (
                <EmptyState text="Placement information is not available yet." />
              )}

            </div>

          </section>
        )}

        {/* ===================================================
            REVIEWS
            =================================================== */}

        {tab === "Reviews" && (
          <section>

            <SectionHeading
              eyebrow="Student experiences"
              title="Reviews"
              icon="💬"
            />

            <div className="space-y-4">

              {college.reviews.map(
                (review) => (
                  <article
                    key={review.id}
                    className="
                      rounded-2xl
                      border
                      border-[#dbe4d8]
                      bg-white
                      p-6
                      shadow-[0_8px_30px_rgba(23,63,43,0.06)]
                      sm:p-7
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >

                      <div className="flex gap-3">

                        {/* Avatar */}
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#24543b]
                            text-sm
                            font-bold
                            text-white
                          "
                        >
                          {review.authorName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <h3
                            className="
                              font-semibold
                              text-[#173f2b]
                            "
                          >
                            {review.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-[#758178]
                            "
                          >
                            {review.authorName}
                          </p>

                        </div>

                      </div>

                      <Rating
                        value={review.rating}
                      />

                    </div>

                    <p
                      className="
                        mt-5
                        text-sm
                        leading-7
                        text-[#66746c]
                      "
                    >
                      {review.content}
                    </p>

                    {(review.pros ||
                      review.cons) && (
                      <div
                        className="
                          mt-6
                          grid
                          gap-4
                          sm:grid-cols-2
                        "
                      >

                        {review.pros && (
                          <div
                            className="
                              rounded-xl
                              border
                              border-[#d7e7d3]
                              bg-[#edf4e9]
                              p-4
                            "
                          >

                            <div className="flex items-center gap-2">

                              <span
                                className="
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-[#24543b]
                                  text-xs
                                  text-white
                                "
                              >
                                ✓
                              </span>

                              <p
                                className="
                                  text-xs
                                  font-bold
                                  text-[#315d42]
                                "
                              >
                                What they liked
                              </p>

                            </div>

                            <p
                              className="
                                mt-3
                                text-sm
                                leading-6
                                text-[#66746c]
                              "
                            >
                              {review.pros}
                            </p>

                          </div>
                        )}

                        {review.cons && (
                          <div
                            className="
                              rounded-xl
                              border
                              border-[#eadfbd]
                              bg-[#fbf6e8]
                              p-4
                            "
                          >

                            <div className="flex items-center gap-2">

                              <span
                                className="
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-[#c69220]
                                  text-xs
                                  text-white
                                "
                              >
                                !
                              </span>

                              <p
                                className="
                                  text-xs
                                  font-bold
                                  text-[#80631b]
                                "
                              >
                                What could improve
                              </p>

                            </div>

                            <p
                              className="
                                mt-3
                                text-sm
                                leading-6
                                text-[#66746c]
                              "
                            >
                              {review.cons}
                            </p>

                          </div>
                        )}

                      </div>
                    )}

                  </article>
                )
              )}

              {college.reviews.length ===
                0 && (
                <EmptyState text="No reviews yet." />
              )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

function SectionHeading({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: string;
}) {
  return (
    <div className="mb-7">

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-[#24543b]
            text-base
            shadow-sm
          "
        >
          {icon}
        </div>

        <p
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#8b6b20]
          "
        >
          {eyebrow}
        </p>

      </div>

      <h2
        className="
          mt-3
          font-display
          text-3xl
          font-semibold
          text-[#173f2b]
          sm:text-4xl
        "
      >
        {title}
      </h2>

    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        border-b
        border-[#e1e9de]
        p-5
        sm:border-b-0
        sm:border-r
        sm:last:border-r-0
        [&:nth-child(odd)]:border-r
        sm:[&:nth-child(odd)]:border-r-0
      "
    >

      <p
        className="
          text-[11px]
          font-semibold
          uppercase
          tracking-wide
          text-[#758178]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          text-lg
          font-bold
          text-[#24543b]
        "
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INFO ROW
   ========================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        border-b
        border-[#e7ece4]
        pb-4
        last:border-0
        last:pb-0
      "
    >

      <dt
        className="
          text-sm
          text-[#758178]
        "
      >
        {label}
      </dt>

      <dd
        className="
          text-right
          text-sm
          font-semibold
          text-[#24543b]
        "
      >
        {value}
      </dd>

    </div>
  );
}

/* =========================================================
   MINI STAT
   ========================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        bg-[#f1f6ee]
        p-3
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wide
          text-[#758178]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-bold
          text-[#24543b]
        "
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   PLACEMENT STAT
   ========================================================= */

function PlacementStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        ${
          highlight
            ? `
              border-[#ead9a8]
              bg-[#fbf6e8]
            `
            : `
              border-[#dbe4d8]
              bg-[#f5f8f3]
            `
        }
      `}
    >

      <p
        className="
          text-[11px]
          font-semibold
          uppercase
          tracking-wide
          text-[#758178]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1.5
          text-xl
          font-bold
          ${
            highlight
              ? "text-[#8b6b20]"
              : "text-[#24543b]"
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#dbe4d8]
        bg-white
        p-12
        text-center
        shadow-sm
      "
    >

      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-[#edf4e9]
          text-xl
        "
      >
        🌿
      </div>

      <p
        className="
          mt-4
          text-sm
          text-[#758178]
        "
      >
        {text}
      </p>

    </div>
  );
}
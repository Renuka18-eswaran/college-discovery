"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompareTray, MAX_COMPARE } from "@/components/CompareTrayProvider";
import { formatINR, formatLPA } from "@/lib/format";
import { Rating } from "@/components/Rating";

type CompareCollege = {
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  reviewCount: number;
  avgFeesPerYear: number;
  establishedYear: number;
  heroColor: string;
  placements: {
    avgPackageLPA: number;
    highestPackageLPA: number;
    placementPercent: number;
  }[];
};

export default function ComparePage() {
  const { items, remove } = useCompareTray();

  const [data, setData] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length < 2) {
      setData([]);
      return;
    }

    const slugs = items.map((i) => i.slug).join(",");

    setLoading(true);
    setError(null);

    fetch(`/api/colleges/compare?slugs=${encodeURIComponent(slugs)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Couldn't load comparison. Please try again.");
        }
        return res.json();
      })
      .then((json) => setData(json.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [items]);

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#173a2a]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#b5c9ad] blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#8b6b20] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-[#dfead9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d6b34a]" />
              College comparison
            </div>

            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Compare colleges.
              <br />
              <span className="text-[#c8d8c2]">Choose with confidence.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d6e0d5] sm:text-base">
              Compare fees, ratings, placements and other important details
              side by side before making your college decision.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b6b20]">
              Your shortlist
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-[#173a2a]">
              Compare colleges
            </h2>
          </div>

          <Link
            href="/colleges"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cbd8cc] bg-white px-4 py-2.5 text-sm font-semibold text-[#24543b] shadow-sm transition hover:border-[#24543b] hover:bg-[#edf3e8]"
          >
            <span className="text-base">+</span>
            Add colleges
          </Link>
        </div>

        {/* NOT ENOUGH COLLEGES */}
        {items.length < 2 && (
          <div className="overflow-hidden rounded-3xl border border-[#d9dfd4] bg-white shadow-[0_12px_40px_rgba(23,58,42,0.08)]">
            <div className="h-1.5 bg-[#24543b]" />

            <div className="px-6 py-16 text-center sm:px-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#24543b]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 4v16" />
                  <path d="M16 4v16" />
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </svg>
              </div>

              <h3 className="font-display text-2xl font-semibold text-[#173a2a]">
                {items.length === 0
                  ? "No colleges selected yet"
                  : "Add one more college"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718078]">
                {items.length === 0
                  ? "Select colleges from the browse page and add them to your comparison."
                  : "Choose another college to see a useful side-by-side comparison."}
              </p>

              <Link
                href="/colleges"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#24543b] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2c]"
              >
                Browse colleges
              </Link>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-[#d9dfd4] bg-white p-8 shadow-[0_12px_40px_rgba(23,58,42,0.07)]">
            <div className="flex items-center gap-3 text-sm text-[#718078]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d9dfd4] border-t-[#24543b]" />
              Loading comparison…
            </div>
          </div>
        )}

        {/* DESKTOP COMPARISON */}
        {!loading && data.length >= 2 && (
          <>
            <div className="hidden overflow-hidden rounded-3xl border border-[#d9dfd4] bg-white shadow-[0_12px_40px_rgba(23,58,42,0.08)] md:block">
              <div className="h-1.5 bg-[#24543b]" />

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#e6e4dc] bg-[#faf9f5]">
                      <th className="w-44 px-5 py-6 text-left align-bottom text-xs font-semibold uppercase tracking-[0.1em] text-[#7c8780]">
                        Compare
                      </th>

                      {data.map((college) => (
                        <th
                          key={college.slug}
                          className="relative min-w-[220px] px-5 py-6 text-left align-bottom"
                        >
                          <div
                            className="absolute inset-x-0 top-0 h-1"
                            style={{
                              backgroundColor:
                                college.heroColor || "#24543b",
                            }}
                          />

                          <div className="flex items-start justify-between gap-3">
                            <Link
                              href={`/colleges/${college.slug}`}
                              className="group"
                            >
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3e8] font-display text-lg font-semibold text-[#24543b]">
                                {college.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="font-display text-lg font-semibold leading-6 text-[#173a2a] transition group-hover:text-[#24543b]">
                                {college.name}
                              </div>
                            </Link>

                            <button
                              type="button"
                              onClick={() => remove(college.slug)}
                              className="rounded-full px-2 py-1 text-xs font-medium text-[#89938d] transition hover:bg-red-50 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <CompareRow label="Location">
                      {data.map((college) => (
                        <td
                          key={college.slug}
                          className="px-5 py-4 font-medium text-[#31533c]"
                        >
                          {college.city}, {college.state}
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="College type">
                      {data.map((college) => (
                        <td key={college.slug} className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-[#d9dfd4] bg-[#f4f7f2] px-3 py-1 text-xs font-medium text-[#31533c]">
                            {college.type}
                          </span>
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="Established">
                      {data.map((college) => (
                        <td
                          key={college.slug}
                          className="px-5 py-4 font-medium text-[#31533c]"
                        >
                          {college.establishedYear}
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="Rating">
                      {data.map((college) => (
                        <td key={college.slug} className="px-5 py-4">
                          <Rating
                            value={college.rating}
                            count={college.reviewCount}
                          />
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="Annual fees" highlight>
                      {data.map((college) => (
                        <td
                          key={college.slug}
                          className="px-5 py-4 font-semibold text-[#173a2a]"
                        >
                          {formatINR(college.avgFeesPerYear)}
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="Average package" highlight>
                      {data.map((college) => (
                        <td
                          key={college.slug}
                          className="px-5 py-4 font-semibold text-[#24543b]"
                        >
                          {college.placements[0]
                            ? formatLPA(
                                college.placements[0].avgPackageLPA
                              )
                            : "—"}
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="Highest package">
                      {data.map((college) => (
                        <td
                          key={college.slug}
                          className="px-5 py-4 font-medium text-[#31533c]"
                        >
                          {college.placements[0]
                            ? formatLPA(
                                college.placements[0].highestPackageLPA
                              )
                            : "—"}
                        </td>
                      ))}
                    </CompareRow>

                    <CompareRow label="Placement rate" highlight>
                      {data.map((college) => (
                        <td
                          key={college.slug}
                          className="px-5 py-4 font-semibold text-[#24543b]"
                        >
                          {college.placements[0]
                            ? `${college.placements[0].placementPercent}%`
                            : "—"}
                        </td>
                      ))}
                    </CompareRow>

                    <tr>
                      <th className="px-5 py-5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#7c8780]">
                        Details
                      </th>

                      {data.map((college) => (
                        <td key={college.slug} className="px-5 py-5">
                          <Link
                            href={`/colleges/${college.slug}`}
                            className="inline-flex items-center gap-2 rounded-full bg-[#24543b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#183f2c]"
                          >
                            View college
                            <span>→</span>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE COMPARISON */}
            <div className="space-y-4 md:hidden">
              {data.map((college) => (
                <article
                  key={college.slug}
                  className="overflow-hidden rounded-3xl border border-[#d9dfd4] bg-white shadow-[0_10px_30px_rgba(23,58,42,0.08)]"
                >
                  <div
                    className="h-1.5"
                    style={{
                      backgroundColor: college.heroColor || "#24543b",
                    }}
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/colleges/${college.slug}`}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3e8] font-display text-lg font-semibold text-[#24543b]">
                          {college.name.charAt(0).toUpperCase()}
                        </div>

                        <h3 className="mt-3 font-display text-xl font-semibold leading-6 text-[#173a2a]">
                          {college.name}
                        </h3>
                      </Link>

                      <button
                        type="button"
                        onClick={() => remove(college.slug)}
                        className="rounded-full px-2 py-1 text-xs font-medium text-[#89938d] hover:bg-red-50 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-5 divide-y divide-[#ebe9e2] rounded-2xl border border-[#e6e4dc]">
                      <MobileRow label="Location">
                        {college.city}, {college.state}
                      </MobileRow>

                      <MobileRow label="Type">
                        {college.type}
                      </MobileRow>

                      <MobileRow label="Established">
                        {college.establishedYear}
                      </MobileRow>

                      <MobileRow label="Rating">
                        <Rating
                          value={college.rating}
                          count={college.reviewCount}
                        />
                      </MobileRow>

                      <MobileRow label="Annual fees">
                        <span className="font-semibold text-[#173a2a]">
                          {formatINR(college.avgFeesPerYear)}
                        </span>
                      </MobileRow>

                      <MobileRow label="Average package">
                        <span className="font-semibold text-[#24543b]">
                          {college.placements[0]
                            ? formatLPA(
                                college.placements[0].avgPackageLPA
                              )
                            : "—"}
                        </span>
                      </MobileRow>

                      <MobileRow label="Highest package">
                        {college.placements[0]
                          ? formatLPA(
                              college.placements[0].highestPackageLPA
                            )
                          : "—"}
                      </MobileRow>

                      <MobileRow label="Placement rate">
                        <span className="font-semibold text-[#24543b]">
                          {college.placements[0]
                            ? `${college.placements[0].placementPercent}%`
                            : "—"}
                        </span>
                      </MobileRow>
                    </div>

                    <Link
                      href={`/colleges/${college.slug}`}
                      className="mt-5 flex items-center justify-center rounded-full bg-[#24543b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#183f2c]"
                    >
                      View college details
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function CompareRow({
  label,
  children,
  highlight = false,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <tr
      className={`border-t border-[#e6e4dc] ${
        highlight ? "bg-[#f3f7ef]" : "bg-white"
      }`}
    >
      <th className="px-5 py-4 text-left align-top text-xs font-semibold uppercase tracking-[0.08em] text-[#7c8780]">
        {label}
      </th>

      {children}
    </tr>
  );
}

function MobileRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#89938d]">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-[#31533c]">
        {children}
      </span>
    </div>
  );
}
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Rating } from "@/components/Rating";
import { formatINR, streamsList } from "@/lib/format";

const QUICK_STREAMS = ["Engineering", "Management", "Science", "Commerce", "Architecture"];

export default async function HomePage() {
  const topRated = await prisma.college.findMany({
    orderBy: { rating: "desc" },
    take: 3,
    select: {
      slug: true,
      name: true,
      city: true,
      state: true,
      rating: true,
      reviewCount: true,
      avgFeesPerYear: true,
      streams: true,
      heroColor: true,
    },
  });

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1] max-w-2xl">
            Find the right college, not just a ranked list.
          </h1>
          <p className="mt-4 text-slate max-w-xl">
            Compare fees, placements, and real reviews side by side — search
            structured data instead of scrolling through listicles.
          </p>

          <form action="/colleges" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              name="q"
              placeholder="Search by college name or city…"
              className="grow rounded-sm border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-ink"
            />
            <button
              type="submit"
              className="rounded-sm bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-ink-soft"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_STREAMS.map((s) => (
              <Link
                key={s}
                href={`/colleges?stream=${encodeURIComponent(s)}`}
                className="text-xs px-3 py-1.5 rounded-sm border border-line text-slate hover:border-ink hover:text-ink"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Top rated this week</h2>
          <Link href="/colleges" className="text-sm text-ink hover:text-gold">
            Browse all colleges
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {topRated.map((college: (typeof topRated)[number], i: number) => (
            <Link
              key={college.slug}
              href={`/colleges/${college.slug}`}
              className="border border-line bg-surface rounded-sm p-5 flex flex-col gap-2 hover:border-ink transition-colors"
              style={{ borderTopColor: college.heroColor, borderTopWidth: 3 }}
            >
              <span className="text-xs text-slate">No. {i + 1}</span>
              <h3 className="font-display text-lg text-ink leading-snug">{college.name}</h3>
              <p className="text-sm text-slate">
                {college.city}, {college.state}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {streamsList(college.streams).map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-sm bg-gold-soft text-ink-soft">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Rating value={college.rating} count={college.reviewCount} />
                <span className="text-sm font-medium text-ink">
                  {formatINR(college.avgFeesPerYear)}
                  <span className="text-slate font-normal">/yr</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

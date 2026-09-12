import { Suspense } from "react";
import { CollegeSearch } from "@/components/CollegeSearch";
import { parseCollegeQuery, collegeQuerySchema } from "@/lib/collegeQuery";
import { queryColleges } from "@/lib/queryColleges";
import { getFacets } from "@/lib/getFacets";

export const metadata = {
  title: "Browse colleges — Vidya",
};

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const parsed = parseCollegeQuery(resolvedParams);
  const query = parsed.success ? parsed.data : undefined;

  const [initialData, facets] = await Promise.all([
    query ? queryColleges(query) : queryColleges(parseCollegeQuery({}).data as any),
    getFacets(),
  ]);

  return (
    <Suspense>
      <CollegeSearch initialData={initialData} facets={facets} />
    </Suspense>
  );
}

import { z } from "zod";

export const SORT_OPTIONS = [
  {
    value: "rating_desc",
    label: "Highest rated",
  },
  {
    value: "fees_asc",
    label: "Fees: low to high",
  },
  {
    value: "fees_desc",
    label: "Fees: high to low",
  },
  {
    value: "name_asc",
    label: "Name: A to Z",
  },
] as const;

export type SortOption =
  (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 9;

export const collegeQuerySchema = z.object({

  // Search
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default(""),

  // District
  district: z
    .string()
    .trim()
    .max(60)
    .optional()
    .default(""),

  // Keep city for backward compatibility
  city: z
    .string()
    .trim()
    .max(60)
    .optional()
    .default(""),

  // State
  state: z
    .string()
    .trim()
    .max(60)
    .optional()
    .default(""),

  // Stream
  stream: z
    .string()
    .trim()
    .max(60)
    .optional()
    .default(""),

  // College type
  type: z
    .string()
    .trim()
    .max(30)
    .optional()
    .default(""),

  // Fees
  minFees: z
    .coerce
    .number()
    .int()
    .min(0)
    .optional(),

  maxFees: z
    .coerce
    .number()
    .int()
    .min(0)
    .optional(),

  // Rating
  minRating: z
    .coerce
    .number()
    .min(0)
    .max(5)
    .optional(),

  // Sorting
  sort: z
    .enum(
      SORT_OPTIONS.map(
        (s) => s.value
      ) as [
        SortOption,
        ...SortOption[]
      ]
    )
    .optional()
    .default("rating_desc"),

  // Pagination
  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .optional()
    .default(1),
});

export type CollegeQuery =
  z.infer<typeof collegeQuerySchema>;

export function parseCollegeQuery(
  params: Record<
    string,
    string | string[] | undefined
  >
) {
  const flat: Record<
    string,
    string | undefined
  > = {};

  for (const key in params) {
    const val = params[key];

    flat[key] = Array.isArray(val)
      ? val[0]
      : val;
  }

  return collegeQuerySchema.safeParse(flat);
}
import { prisma } from "@/lib/prisma";
import {
  CollegeQuery,
  PAGE_SIZE,
} from "@/lib/collegeQuery";
import type { Prisma } from "@prisma/client";

export async function queryColleges(
  query: CollegeQuery
) {
  const {
    q,
    district,
    city,
    state,
    stream,
    type,
    minFees,
    maxFees,
    minRating,
    sort,
    page,
  } = query;

  // ------------------------------------
  // Build filters
  // ------------------------------------

  const where: Prisma.CollegeWhereInput = {
    AND: [

      // -------------------------------
      // Search
      // -------------------------------

      q
        ? {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },

              {
                city: {
                  contains: q,
                  mode: "insensitive",
                },
              },

              {
                state: {
                  contains: q,
                  mode: "insensitive",
                },
              },

              {
                streams: {
                  contains: q,
                  mode: "insensitive",
                },
              },

              {
                type: {
                  contains: q,
                  mode: "insensitive",
                },
              },

              {
                description: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},

      // -------------------------------
      // DISTRICT FILTER
      //
      // Database:
      // city = district
      //
      // Example:
      // district = Namakkal
      // becomes:
      // city = Namakkal
      // -------------------------------

      district
        ? {
            city: {
              equals: district,
              mode: "insensitive",
            },
          }
        : {},

      // -------------------------------
      // Backward-compatible city filter
      // -------------------------------

      city
        ? {
            city: {
              equals: city,
              mode: "insensitive",
            },
          }
        : {},

      // -------------------------------
      // State
      // -------------------------------

      state
        ? {
            state: {
              equals: state,
              mode: "insensitive",
            },
          }
        : {},

      // -------------------------------
      // Stream
      // -------------------------------

      stream
        ? {
            streams: {
              contains: stream,
              mode: "insensitive",
            },
          }
        : {},

      // -------------------------------
      // College type
      // -------------------------------

      type
        ? {
            type: {
              equals: type,
              mode: "insensitive",
            },
          }
        : {},

      // -------------------------------
      // Minimum fees
      // -------------------------------

      minFees !== undefined
        ? {
            avgFeesPerYear: {
              gte: minFees,
            },
          }
        : {},

      // -------------------------------
      // Maximum fees
      // -------------------------------

      maxFees !== undefined
        ? {
            avgFeesPerYear: {
              lte: maxFees,
            },
          }
        : {},

      // -------------------------------
      // Minimum rating
      // -------------------------------

      minRating !== undefined
        ? {
            rating: {
              gte: minRating,
            },
          }
        : {},
    ],
  };

  // ------------------------------------
  // Sorting
  // ------------------------------------

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "fees_asc"
      ? {
          avgFeesPerYear: "asc",
        }
      : sort === "fees_desc"
      ? {
          avgFeesPerYear: "desc",
        }
      : sort === "name_asc"
      ? {
          name: "asc",
        }
      : {
          rating: "desc",
        };

  // ------------------------------------
  // Database query
  // ------------------------------------

  const [total, colleges] =
    await Promise.all([
      prisma.college.count({
        where,
      }),

      prisma.college.findMany({
        where,

        orderBy,

        skip: (page - 1) * PAGE_SIZE,

        take: PAGE_SIZE,

        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          type: true,
          rating: true,
          reviewCount: true,
          avgFeesPerYear: true,
          streams: true,
          heroColor: true,
          establishedYear: true,
        },
      }),
    ]);

  // ------------------------------------
  // Return result
  // ------------------------------------

  return {
    data: colleges,

    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,

      totalPages: Math.max(
        1,
        Math.ceil(
          total / PAGE_SIZE
        )
      ),
    },
  };
}

export type CollegeListItem =
  Awaited<
    ReturnType<typeof queryColleges>
  >["data"][number];
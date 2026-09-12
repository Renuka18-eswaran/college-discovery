import { prisma } from "@/lib/prisma";

export async function getFacets() {
  const [
    states,
    districts,
    types,
    feesRange,
    colleges,
  ] = await Promise.all([

    // -----------------------------
    // States
    // -----------------------------
    prisma.college.findMany({
      distinct: ["state"],
      select: {
        state: true,
      },
      orderBy: {
        state: "asc",
      },
    }),

    // -----------------------------
    // Districts
    //
    // Your database stores the
    // Tamil Nadu district inside
    // the `city` field.
    // -----------------------------
    prisma.college.findMany({
      where: {
        state: "Tamil Nadu",
      },
      distinct: ["city"],
      select: {
        city: true,
      },
      orderBy: {
        city: "asc",
      },
    }),

    // -----------------------------
    // College Types
    // -----------------------------
    prisma.college.findMany({
      distinct: ["type"],
      select: {
        type: true,
      },
      orderBy: {
        type: "asc",
      },
    }),

    // -----------------------------
    // Fee range
    // -----------------------------
    prisma.college.aggregate({
      _min: {
        avgFeesPerYear: true,
      },
      _max: {
        avgFeesPerYear: true,
      },
    }),

    // -----------------------------
    // Streams
    // -----------------------------
    prisma.college.findMany({
      select: {
        streams: true,
      },
    }),
  ]);

  // -----------------------------
  // Create unique stream list
  // -----------------------------

  const streamSet = new Set<string>();

  for (const college of colleges) {
    const streamValues =
      college.streams.split(",");

    for (const stream of streamValues) {
      const cleanedStream =
        stream.trim();

      if (cleanedStream) {
        streamSet.add(cleanedStream);
      }
    }
  }

  // -----------------------------
  // Return facets
  // -----------------------------

  return {
    states: states.map(
      (item: { state: string }) =>
        item.state
    ),

    districts: districts.map(
      (item: { city: string }) =>
        item.city
    ),

    types: types.map(
      (item: { type: string }) =>
        item.type
    ),

    streams:
      Array.from(streamSet).sort(),

    feesMin:
      feesRange._min.avgFeesPerYear ??
      0,

    feesMax:
      feesRange._max.avgFeesPerYear ??
      0,
  };
}
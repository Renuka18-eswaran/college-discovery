import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("slugs") ?? "";
  const slugs = Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );

  if (slugs.length < 2) {
    return NextResponse.json(
      { error: "Provide at least 2 college slugs via ?slugs=a,b,c" },
      { status: 400 }
    );
  }
  if (slugs.length > 3) {
    return NextResponse.json(
      { error: "You can compare at most 3 colleges at a time" },
      { status: 400 }
    );
  }

  const colleges = await prisma.college.findMany({
    where: { slug: { in: slugs } },
    include: {
      placements: { orderBy: { year: "desc" }, take: 1 },
      courses: { select: { degree: true }, distinct: ["degree"] },
    },
  });

  if (colleges.length !== slugs.length) {
    const found = new Set(colleges.map((c: { slug: string }) => c.slug));
    const missing = slugs.filter((s) => !found.has(s));
    return NextResponse.json(
      { error: `College(s) not found: ${missing.join(", ")}` },
      { status: 404 }
    );
  }

  // Return in the order requested, not DB order.
  const ordered = slugs.map((s) => colleges.find((c: { slug: string }) => c.slug === s)!);

  return NextResponse.json({ data: ordered });
}

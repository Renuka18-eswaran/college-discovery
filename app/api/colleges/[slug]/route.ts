import { NextRequest, NextResponse } from "next/server";
import { parseCollegeQuery } from "@/lib/collegeQuery";
import { queryColleges } from "@/lib/queryColleges";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = parseCollegeQuery(
    Object.fromEntries(searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: parsed.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  const result = await queryColleges(
    parsed.data
  );

  return NextResponse.json(result);
}
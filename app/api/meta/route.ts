import { NextResponse } from "next/server";
import { getFacets } from "@/lib/getFacets";

export async function GET() {
  const facets = await getFacets();
  return NextResponse.json({ data: facets });
}

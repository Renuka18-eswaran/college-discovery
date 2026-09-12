import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CollegeDetailTabs } from "@/components/CollegeDetailTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug },
    select: { name: true, city: true, state: true },
  });
  if (!college) return { title: "College not found — Vidya" };
  return { title: `${college.name} — Vidya` };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: { orderBy: { name: "asc" } },
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!college) notFound();

  return <CollegeDetailTabs college={college} />;
}

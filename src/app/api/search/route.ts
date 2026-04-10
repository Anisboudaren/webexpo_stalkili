import { NextRequest, NextResponse } from "next/server";
import { allTeachers } from "@/lib/teachers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") ?? "").toLowerCase().trim();

  // Simulate a small network delay so the loading state is visible
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!query) {
    return NextResponse.json({ results: allTeachers });
  }

  const results = allTeachers.filter((t) => {
    const searchable =
      `${t.name} ${t.subject} ${t.university} ${t.bio} ${t.tags.join(" ")}`.toLowerCase();
    return searchable.includes(query);
  });

  return NextResponse.json({ results });
}

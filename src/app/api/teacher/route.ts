import { NextRequest, NextResponse } from 'next/server';
import { allTeachers } from '@/lib/teachers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing teacher id' }, { status: 400 });
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const teacher = allTeachers.find((t) => t.id === id);

  if (!teacher) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }

  return NextResponse.json({ teacher });
}

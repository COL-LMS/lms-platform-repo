import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, place, details, status } = await request.json();

    if (!name || !place) {
      return NextResponse.json(
        { error: 'Name and Place are required' },
        { status: 400 }
      );
    }

    const updatedUniversity = await prisma.university.update({
      where: { id },
      data: {
        name,
        place,
        details,
        status,
      },
    });

    return NextResponse.json(updatedUniversity);
  } catch (error: any) {
    console.error('Error updating university:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

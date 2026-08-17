import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const universities = await prisma.university.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        admins: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, place, url, logo, details } = await request.json();

    if (!name || !place) {
      return NextResponse.json(
        { error: 'University Name and Place are required' },
        { status: 400 }
      );
    }

    const university = await prisma.university.create({
      data: {
        name,
        place,
        url: url || null,
        logo: logo || null,
        details: details || '',
      },
    });

    return NextResponse.json(university, { status: 201 });
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const { name, email, universityId, status } = await request.json();

    if (!name || !email || !universityId) {
      return NextResponse.json(
        { error: 'Name, Email, and University are required' },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.universityAdmin.findUnique({ where: { id } });
    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Update UniversityAdmin record
    const updatedAdmin = await prisma.universityAdmin.update({
      where: { id },
      data: {
        name,
        email,
        universityId,
        status,
      },
      include: {
        university: true,
      },
    });

    // Sync with User table (username = email)
    const existingUser = await prisma.user.findFirst({
      where: { username: existingAdmin.email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          username: email,
          email,
          status,
        },
      });
    }

    return NextResponse.json(updatedAdmin);
  } catch (error: any) {
    console.error('Error updating university admin:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

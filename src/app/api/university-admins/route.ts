import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admins = await prisma.universityAdmin.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            place: true,
          },
        },
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching university admins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, universityId } = await request.json();

    if (!name || !email || !password || !universityId) {
      return NextResponse.json(
        { error: 'Name, Email (ID), Password, and University Selection are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.universityAdmin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An admin with this Email ID already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.universityAdmin.create({
      data: {
        name,
        email,
        passwordHash,
        universityId,
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Also register user in User table so they can authenticate in system
    await prisma.user.upsert({
      where: { username: email },
      update: { passwordHash, name },
      create: {
        username: email,
        email,
        name,
        passwordHash,
        role: 'UNIVERSITY_ADMIN',
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error('Error creating university admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

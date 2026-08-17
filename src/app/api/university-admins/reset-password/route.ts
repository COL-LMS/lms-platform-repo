import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adminId, newPassword } = await request.json();

    if (!adminId || !newPassword) {
      return NextResponse.json(
        { error: 'Admin ID and new password are required' },
        { status: 400 }
      );
    }

    const admin = await prisma.universityAdmin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: 'University Admin not found' }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update UniversityAdmin record
    await prisma.universityAdmin.update({
      where: { id: adminId },
      data: { passwordHash },
    });

    // Update User login account record
    await prisma.user.updateMany({
      where: { username: admin.email },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

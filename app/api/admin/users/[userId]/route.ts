import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma'; 
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId  = (await params).userId;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: { userId: userId },
      }),
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json(
      { message: 'User and associated posts deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user and posts:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the user and their posts.' },
      { status: 500 }
    );
  }
}

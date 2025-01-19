import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string | null; 
  createdAt: Date;           
  category: Category;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null; 
  role: string;
  posts: Post[];      
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
    const userId  = (await params).userId;

  try {
    const userProfile: UserProfile | null = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Error fetching user profile' },
      { status: 500 }
    );
  }
}

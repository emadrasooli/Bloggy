import prisma from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server";
 
export async function POST(request: NextRequest) {

    try {
      const {title, content, categoryId, userId } = (await request.json()) as {
        title: string;
        content: string;
        categoryId: string;
        userId: string;
      }

      if(!title || !content || !categoryId || !userId ) {
        return NextResponse.json(
          { error: "Missing required fields."}, 
          { status: 400 }
        );
      }
        const post = await prisma.post.create({
          data: {
            title,
            content,
            category: {
              connect: {
                id: categoryId,
              }
            },
            author: {
              connect: {
                id: userId,
              }
            }
          }
        })
        
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Error creating post" },
        { status: 500 }
      );
    }
  }

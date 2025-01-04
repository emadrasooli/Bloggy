import prisma from "@/lib/prisma"
 
export async function POST() {

    try {
        const post = await prisma.post.create({
          data: {
            title,
            content,
            category,
            userId,
            createdAt
          }
        })
        
        return Response.json({ data: post, status: 200 })
    } catch (error) {
        return Response.json({ error: "Error fetching categories", status: 500 })   
    }
}
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(request: Request) {
//   const { title, content, category, userId, createdAt } = await request.json();

//   if (!title || !content || !category || !userId || !createdAt) {
//     return NextResponse.json({ error: "Title, Content, Category, User ID and Created At are required" }, { status: 400 });
//   }

//   try {
//     const post = await prisma.post.create({
//       data: {
//         title,
//         content,
//         category,
//         userId,
//         createdAt,
//       },
//     });
//     return NextResponse.json({ message: "Post created", post }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ error: "Error creating post" }, { status: 500 });
//   }
// }

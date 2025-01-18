import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";
 
export async function GET() {
    try {
      const categories = await prisma.category.findMany();
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
    }
  }

export async function POST(request: NextRequest) {
    try {
      const { name } = await request.json();
  
      if (!name) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
      }
  
      const category = await prisma.category.create({
        data: { name },
      });
  
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.error("Error creating category:", error);
      return NextResponse.json({ error: "Error creating category" }, { status: 500 });
    }
  }

export async function PATCH(request: NextRequest) {
    try {
      const { id, name } = await request.json();
  
      if (!id || !name) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
      }
  
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name }
      });
  
      return NextResponse.json(updatedCategory, { status: 201 });
    } catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json({ error: "Error updating category" }, { status: 500 });
    }
  }
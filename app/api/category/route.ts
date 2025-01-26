import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";
 
export async function GET() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
    }
  }

  export async function POST(request: NextRequest) {
    try {
      const { name } = await request.json();
      const trimmedName = name.trim();
  
      if (!trimmedName) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
      }
  
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: trimmedName,
            mode: "insensitive",
          },
        },
      });
  
      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 }
        );
      }
  
      const category = await prisma.category.create({
        data: { name: trimmedName },
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
      const trimmedName = name.trim();
  
      if (!id || !trimmedName) {
        return NextResponse.json(
          { error: "Category ID and name are required" },
          { status: 400 }
        );
      }
  
      const categoryToUpdate = await prisma.category.findUnique({
        where: { id },
      });
  
      if (!categoryToUpdate) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: trimmedName,
            mode: "insensitive",
          },
          NOT: {
            id: id,
          },
        },
      });
  
      if (duplicateCategory) {
        return NextResponse.json(
          { error: "Another category with this name already exists" },
          { status: 400 }
        );
      }
  
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name: trimmedName },
      });
  
      return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json({ error: "Error updating category" }, { status: 500 });
    }
  }
  

  export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signupSchema } from "@/validationSchema";

export async function POST(request: Request) {
  try {
    const { name, email, password } = signupSchema.parse(await request.json());

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => err.message);
      return NextResponse.json({ errors: formattedErrors }, { status: 400 });
    }

    console.error("Error creating User:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}

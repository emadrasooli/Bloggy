// pages/api/posts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

interface Data {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { title, content, categories, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ message: 'Title and userId are required' });
  }

  try {
    const categoryConnectOrCreate = categories.map((name: string) => ({
      where: { name },
      create: { name },
    }));

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
        categories: {
          connectOrCreate: categoryConnectOrCreate,
        },
      },
      include: {
        author: true,
        categories: true,
      },
    });

    return res.status(201).json({ message: 'Post created successfully' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

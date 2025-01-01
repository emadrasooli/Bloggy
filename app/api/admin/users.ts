// pages/api/admin/users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { User as PrismaUser } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.error('No session found');
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (session.user.role !== 'ADMIN') {
    console.error(`User role is not ADMIN: ${session.user.role}`);
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const users: PrismaUser[] = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}

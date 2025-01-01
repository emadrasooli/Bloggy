"use client";

import { useEffect, useState } from 'react';
import { User as PrismaUser } from '@prisma/client';

export default function AdminPage() {
  const [users, setUsers] = useState<PrismaUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: PrismaUser[] = await response.json();
        setUsers(data); // Update the users state
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
      <h2 className="text-2xl mb-4">User List</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-4 bg-white rounded shadow">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4 text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              <div>
                <p className="text-lg font-semibold">{user.name ?? 'No Name'}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500">Role: {user.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

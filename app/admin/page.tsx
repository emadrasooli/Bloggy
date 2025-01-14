"use client";

import CategoryForm from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const handleLogout = async () => {
      signOut({ callbackUrl: "/" });
    };

    const { isLoading: isLoadingUser, error: userError, data: userData } = useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await fetch('/api/admin/users')
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
      }
    })

    const { isLoading: isLoadingCategories, error: categoriesError, data: categoryData } = useQuery({
      queryKey: ['category'],
      queryFn: async () => {
        const response = await fetch('/api/category')
        if (!response.ok) throw new Error('Failed to fetch category');
        return await response.json();
      }
    })

    useEffect(() => {
      if (userData) {
        setUsers(userData);
      }
      if (categoryData) {
        setCategories(categoryData);
      }
    }, [userData, categoryData])


   
    if (userError || categoriesError) return <div className='flex flex-col justify-center items-center h-screen text-lg font-medium text-red-500'>An Error occurred</div>

  return (
    <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-3xl font-medium">Admin Dashboard</h1>
      <Button onClick={() => router.push("/")} variant={"link"} className="text-gray-300 w-fit"><HiHome />Home</Button>
        <div className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
          <div>
            <IoPerson size={40}/>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center gap-2">{session?.user?.name} <span className="text-xs text-white bg-green-700 px-2 rounded-full">{session?.user?.role}</span></p>
            <p className="text-gray-600 text-medium">{session?.user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant={"destructive"} className="absolute right-4">Logout</Button>
        </div>
        <CategoryForm />
        <h3 className="text-xl font-medium">All Categories</h3>
        {isLoadingCategories ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white py-2 px-3 rounded-lg text-black text-center relative">
              <IoIosCloseCircle className="absolute -right-2 -top-3 text-red-500 h-6 w-6 cursor-pointer bg-black rounded-full"/>
              <p className="text-sm font-medium">{category.name}</p>
            </div>
          ))}
        </div>  
      )}
        <h3 className="text-xl font-medium">All Users</h3>
        {isLoadingUser ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {users.map((user) => (
            <div key={user.id} className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
            <div>
              <IoPerson size={40}/>
            </div>
            <div>
              <p className="text-lg font-semibold flex items-center gap-2">{user.name} <span className="text-xs text-white bg-green-700 px-2 rounded-full">{user.role}</span></p>
              <p className="text-gray-600 text-medium">{user.email}</p>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}

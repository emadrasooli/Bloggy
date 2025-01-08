"use client";

import CategoryForm from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const handleLogout = async () => {
      signOut({ callbackUrl: "/" });
    };

      const fetchUsers = async () => {
        try {
          const response = await fetch("/api/admin/users", { method: "GET" });
          if (!response.ok) {
            throw new Error("Failed to fetch categories");
          }
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      useEffect(() => {
        fetchUsers();
      }, []);

      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/category", { method: "GET" });
          if (!response.ok) {
            throw new Error("Failed to fetch categories");
          }
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      useEffect(() => {
        fetchCategories();
      }, []);




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
        {users.length === 0 ? (
        <p className="text-gray-700">No Category is exist</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white py-2 px-3 rounded-lg text-black text-center">
              <p className="text-sm font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      )}
        <h3 className="text-xl font-medium">All Users</h3>
        {users.length === 0 ? (
        <p className="text-gray-700">No user is logged in!</p>
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

"use client";

import CategoryForm from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiHome } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();

    const handleLogout = async () => {
      signOut({ callbackUrl: "/" });
    };

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
    </div>
  );
}

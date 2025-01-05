"use client";

import CategoryForm from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function AdminPage() {
    const handleLogout = async () => {
      signOut({ callbackUrl: "/" });
    };

  return (
    <div>
      <h1>Admin Page</h1>
      <CategoryForm />
      <Button onClick={handleLogout} variant={"destructive"} className="absolute right-4">Logout</Button>
    </div>
  );
}

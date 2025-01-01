"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl">Dashboard</h1>
      <p>Name, {session?.user?.name}</p>
      <p>Email, {session?.user?.email}</p>
      <p>Role, {session?.user?.role}</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

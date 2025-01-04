"use client";

import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoPerson } from "react-icons/io5";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    category: string;
  }) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }
      
      alert("Post created successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error creating post: " + error.message);
    }
  };

  return (
    <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-3xl font-medium">Dashboard</h1>
      <Button onClick={() => router.push("/")} variant={"link"} className="text-gray-300 w-fit">Home</Button>
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
        <PostForm onSubmit={handleCreatePost}/>
    </div>
  );
};

export default Dashboard;




{/* <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
<h1 className="text-3xl font-medium">Dashboard</h1>
<Button onClick={() => router.push("/")} variant={"link"} className="text-gray-300 w-fit"><ArrowLeft />Home</Button>
<div className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
  <div>
    <IoPerson size={40}/>
  </div>
  <div>
    <p className="text-lg font-semibold flex items-center gap-2">{session?.user?.name} <span className="text-xs text-white bg-green-700 px-2 rounded-full">{session?.user?.role}</span></p>
    <p className="text-gray-600 text-medium">{session?.user?.email}</p>
  </div>
  <div className="absolute right-4">
    <Button onClick={handleLogout} variant={"destructive"}>Logout</Button>
  </div>
</div>

</div> */}
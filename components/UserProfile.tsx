"use client";

import { useQuery } from "@tanstack/react-query";
import { IoPerson } from "react-icons/io5";
import { Button } from "./ui/button";
import { sign } from "crypto";
import { signOut } from "next-auth/react";

interface PostWithRelations {
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  category: {
    name: string;
    id: string;
  }
}

interface UserProfile {
  name: string | null;
  id: string;
  email: string;
  role: string;
  posts: PostWithRelations[];
}

interface UserProfileProps {
  id: string;
}

export default function UserProfile({ id }: UserProfileProps) {

  const { isLoading, error, data } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!id) throw new Error('User not authenticated');
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch userProfile');
      return await response.json();
    },
    enabled: !!id,
  });

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const getShortContent = (content: string | null) => {
    if (!content) return "";
    const words = content.split(" ");
    return words.slice(0, 10).join(" ") + (words.length > 10 ? "..." : "");
  };

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
        ) : (
          <>
            {!data ? (
              <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-500">User not found</p>
              </div>
            ) : (
            <div className="space-y-6">
              <div className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
                <div>
                  <IoPerson size={40}/>
                </div>
                 <div>
                    <p className="text-lg font-semibold flex items-center gap-2">{data.name} <span className="text-xs text-white bg-green-700 px-2 rounded-full">{data.role}</span></p>
                    <p className="text-gray-600 text-medium">{data.email}</p>
                </div>
                <Button onClick={() => handleLogout()} variant={"destructive"} className="absolute right-4">Logout</Button>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">All Posts</h2>
                {data.posts.length === 0 ? (
                    <p className="text-gray-500 text-center">No posts available</p>
                 ) : (
                  <ul className="space-y-6">
                    {data.posts.map((post) => (
                      <div key={post.id} className="p-4 border border-gray-400 rounded-2xl space-y-3">
                        <div className="flex flex-row items-center relative">
                            <p className="text-gray-400 text-sm px-3 bg-gray-800 w-fit rounded-full">{post.id}</p>
                            <p className="text-gray-300 text-sm absolute right-0">
                              {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-gray-300">{getShortContent(post.content)}</p>
                        <p className="bg-gray-800  w-fit px-3 rounded-full text-sm py-1">{post.category.name}</p>
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </div>
              )}
          </>
      )}
    </>
  );
}

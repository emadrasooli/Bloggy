'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HiHome } from 'react-icons/hi2';
import { IoPerson } from 'react-icons/io5';
import PostForm from '@/components/PostForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from 'react-icons/fa';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface PostWithRelations {
  id: string;
  title: string;
  content?: string;
  author: Author;
  category: Category;
  createdAt: string; 
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostWithRelations | null>(null);
  const [editingPost, setEditingPost] = useState<PostWithRelations | null>(null);

  const { isLoading, error, data } = useQuery<PostWithRelations[], Error>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!session?.user.id) throw new Error('User not authenticated');
      const response = await fetch(`/api/users/${session.user.id}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    },
    enabled: !!session?.user.id,
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    setIsLogoutDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setMessage("");

    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedPost.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete post");
      }

      setMessage("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSelectedPost(null);
      setIsDialogOpen(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (error) {
    return (
      <div className='h-screen flex flex-col justify-center items-center text-red-500'>
        <p>Something Went Wrong!</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-3xl font-medium">Dashboard</h1>
      <Button onClick={() => router.push("/")} variant="link" className="text-gray-300 w-fit flex items-center gap-2">
        <HiHome /> Home
      </Button>

      <div className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
        <div>
          <IoPerson size={40} />
        </div>
        <div>
          <p className="text-lg font-semibold flex items-center gap-2">
            {session?.user?.name}{" "}
            <span className="text-xs text-white bg-green-700 px-2 rounded-full">
              {session?.user?.role}
            </span>
          </p>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
        <Button onClick={() => {
          setIsLogoutDialogOpen(true);
        }} variant="destructive" className="absolute right-4">
          Logout
        </Button>
      </div>

      <PostForm editingPost={editingPost} clearEditingPost={() => setEditingPost(null)} />

      <div>
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        {message && (
          <p className="bg-green-200 text-green-700 p-3 mb-4 rounded">{message}</p>
        )}
        {isLoading ? (
          <p className='text-gray-500 text-center'>Loading...</p>
        ) : data && data.length === 0 ? (
          <p className='text-gray-500 text-center'>No posts created</p>
        ) : (
          <ul className="space-y-6">
            {data?.map((post) => (
              <li key={post.id} className="bg-white text-black rounded-xl p-6 space-y-6">
                <div className="flex flex-row items-center gap-2">
                  <IoPerson size={24} />
                  <span className='text-gray-500'>{post.author.name}</span>
                  <div className="ml-auto flex items-center space-x-2">
                    <button
                      onClick={() => setEditingPost(post)}
                      className='text-green-500 hover:text-green-700'
                      aria-label={`Edit post titled ${post.title}`}
                    >
                      <FaEdit className='w-5 h-5 cursor-pointer' />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setIsDialogOpen(true);
                      }}
                      className='text-red-500 hover:text-red-700'
                      aria-label={`Delete post titled ${post.title}`}
                    >
                      <MdDeleteOutline className='w-5 h-5 cursor-pointer' />
                    </button>
                  </div>
                </div>
                <div className='flex flex-col space-y-3'>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-gray-700">{post.content}</p>
                </div>
                <div className='flex flex-row justify-between items-center'>
                  <span className='text-sm font-medium bg-slate-200 py-1 px-3 rounded-full'>
                    {post.category.name}
                  </span>
                  <div className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className='text-black'>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to Logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='text-black'>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the post titled <strong>{selectedPost?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

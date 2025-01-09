'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import PostComponent from '@/components/PostComponent';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HiHome } from 'react-icons/hi2';
import { IoPerson } from 'react-icons/io5';
import PostForm from '@/components/PostForm';

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
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);

  useEffect(() => {
    if (!session) return;

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`/api/users/${session.user.id}/posts`);
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('You must be logged in to view this content.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view these posts.');
          } else {
            throw new Error('Failed to fetch your posts.');
          }
        }
        const data: PostWithRelations[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchUserPosts();
  }, [status]);

    const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-3xl font-medium">Dashboard</h1>
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
          <PostForm />
          
          {posts.length === 0 ? (
        <p className="text-gray-500 text-center">You haven't created any posts yet.</p>
      ) : (
        <div className="flex flex-col justify-center space-y-6 max-w-3xl mx-auto">
          {posts.map((post) => (
            <PostComponent
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content ?? ''}
              author={post.author}
              category={post.category}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;




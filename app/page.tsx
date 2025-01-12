"use client"; 

import { useEffect, useState } from 'react';
import type { Post } from '@prisma/client';
import Navbar from '@/components/Navbar';
import PostComponent from '@/components/PostComponent';
import { useQuery } from '@tanstack/react-query';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface PostWithRelations extends Post {
  author: Author;
  category: Category;
  
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const { isLoading, error, data } = useQuery({
    queryKey: ['post'],
    queryFn: async () => {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    }
  })

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  })



  if(error) return <div className='flex flex-col justify-center items-center h-screen text-lg font-medium text-red-500 rounded-xl p-2'>An error has occurred - {error.message}</div>

  return (
    <div className='space-y-6'>
      <Navbar />
      {isLoading ? (
        <p className="text-gray-500 flex justify-center items-center">Loading...</p>
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

export default HomePage;


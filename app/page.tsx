"use client"; 

import { useEffect, useState } from 'react';
import type { Post } from '@prisma/client';
import Navbar from '@/components/Navbar';
import PostComponent from '@/components/PostComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
      return await response.json();
    }
  })

  setPosts(data);

  if (isLoading) return 'Loading...'

  if(error) return 'An error has occurred:' + error.message

  return (
    <div className='space-y-6'>
      <Navbar />
      {posts.length === 0 ? (
        <p className="text-gray-700 flex justify-center items-center">No posts available.</p>
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


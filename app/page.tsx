"use client"; 

import { useEffect, useState } from 'react';
import type { Post } from '@prisma/client';
import Navbar from '@/components/Navbar';
import PostComponent from '@/components/PostComponent';

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: PostWithRelations[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err);
    };
  }

    fetchPosts();
  }, []);

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


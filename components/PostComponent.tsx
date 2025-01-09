import React from 'react';
import { IoPerson } from 'react-icons/io5';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface PostProps {
  id: string;
  title: string;
  content: string;
  author: Author;
  category: Category;
  createdAt: Date;
}

const Post: React.FC<PostProps> = ({
  id,
  title,
  content,
  author,
  category,
  createdAt,
}) => {
  const authorName = author.name || author.email;

  return (
    <article
      className="bg-white text-black shadow-md rounded-xl p-6 space-y-6"
    >
      <div className="flex flex-row items-center gap-1" key={id}>
        <IoPerson size={24}/>
        <span className='text-gray-500'>{authorName}</span>
      </div>
      <div className='flex flex-col space-y-3'>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-700">{content}</p>
      </div>
      <div className='flex flex-row justify-between items-center'>
        <span className='text-sm font-medium bg-slate-200 py-1 px-3 rounded-full'>{category.name}</span>
        <div className="text-sm text-gray-500 mt-2">
            {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    </article>
  );
};

export default Post;

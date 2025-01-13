"use client";

import { useState, useEffect, FormEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MdOutlinePostAdd } from "react-icons/md";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";


const PostForm = () => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const response = await fetch('/api/category')
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    }
  })

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = session?.user.id;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          userId,
          categoryId: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      toast.success("Post created successfully!", {
        position: "bottom-right"
      })

      setTitle("");
      setContent("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-md text-black">
      <h1 className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-1">
        <MdOutlinePostAdd /> Create Post
      </h1>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={content}
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-fit" size={"lg"}>
        Create Post
      </Button>
      <ToastContainer />
    </form>
  );
};

export default PostForm;

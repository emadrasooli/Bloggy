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
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PostFormProps {
  editingPost: PostWithRelations | null;
  clearEditingPost: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface PostWithRelations {
  id: string;
  title: string;
  content?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: Category;
  createdAt: string;
}

const PostForm: React.FC<PostFormProps> = ({ editingPost, clearEditingPost }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['category'],
    queryFn: async () => {
      const response = await fetch('/api/category');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    }
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content || "");
      setSelectedCategory(editingPost.category.id);
    } else {
      setTitle("");
      setContent("");
      setSelectedCategory("");
    }
  }, [editingPost]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = session?.user.id;

    try {
      const response = await fetch(editingPost ? `/api/posts/${editingPost.id}` : "/api/posts", {
        method: editingPost ? "PUT" : "POST",
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
        throw new Error(errorData.error || `Failed to ${editingPost ? "update" : "create"} post`);
      }

      toast.success(`Post ${editingPost ? "updated" : "created"} successfully!`, {
        position: "bottom-right"
      });

      // Reset form fields
      setTitle("");
      setContent("");
      setSelectedCategory("");
      if (editingPost) {
        clearEditingPost();
      }

      // Invalidate the 'posts' query to refetch the posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error(`Error ${editingPost ? "updating" : "creating"} post:`, error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred", {
        position: "bottom-right"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-md text-black">
      <h1 className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-1">
        <MdOutlinePostAdd /> {editingPost ? "Update Post" : "Create Post"}
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
        {isLoading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load categories</p>
        ) : (
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
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" className="w-fit" size={"lg"}>
          {editingPost ? "Update Post" : "Create Post"}
        </Button>
        {editingPost && (
          <Button
            type="button"
            variant="destructive"
            className="w-fit"
            onClick={clearEditingPost}
          >
            Cancel Editing
          </Button>
        )}
      </div>
      <ToastContainer />
    </form>
  );
};

export default PostForm;

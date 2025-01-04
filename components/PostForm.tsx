"use client";

import { FormEvent, useState } from "react";
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

interface PostFormProps {
  onSubmit: (postData: { title: string; content: string; category: string }) => Promise<void>;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content, category });
    setTitle("");
    setContent("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-md text-black">
      <div>
        <h1 className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-1"><MdOutlinePostAdd />Create Post</h1>
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
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
</Select>

      </div>

      <Button type="submit">Create Post</Button>
    </form>
  );
};

export default PostForm;

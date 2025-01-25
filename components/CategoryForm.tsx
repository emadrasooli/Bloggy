"use client";

import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CategoryFormProps {
  editCategory?: { id: string; name: string } | null;
  onSave: (name: string, id?: string) => Promise<void>;
  onSubmitSuccess?: () => void;
}

export default function CategoryForm({ editCategory, onSave, onSubmitSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setIsUpdating(true);
    } else {
      setName("");
      setIsUpdating(false);
    }
  }, [editCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("Category name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(name, editCategory?.id);
      setMessage(
        isUpdating
          ? `Category '${name}' updated successfully!`
          : `Category '${name}' created successfully!`
      );
      setName("");
      setIsUpdating(false);
      onSubmitSuccess?.();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-white text-black p-6 space-y-4 rounded-xl">
      <h2 className="text-xl font-medium text-center">
        {isUpdating ? "Update Category" : "Add a New Category"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          {isUpdating ? "Update Category" : "Add Category"}
        </Button>
      </form>
      {message && 
        <p
          className={`text-sm p-3 rounded-lg ${
            message.includes("successfully") ? "bg-green-200 text-green-500" : "bg-red-200 text-red-500"
          }`}
        >
          {message}
        </p>}
    </div>
  );
}

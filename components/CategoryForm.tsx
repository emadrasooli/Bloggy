"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      setMessage(`Category '${data.name}' created successfully!`);
      setName("");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col bg-white text-black max-w-3xl mx-auto p-6 space-y-4">
      <h2>Add a New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit">Add Category</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

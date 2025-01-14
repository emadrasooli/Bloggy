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

      setTimeout(() => {
        setMessage("");
      }, 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));

      setTimeout(() => {
        setMessage("");
      }, 3000)
    }

  };

  return (
    <div className="flex flex-col bg-white text-black p-6 space-y-4 rounded-xl">
      <h2 className="text-xl font-medium text-center">Add a New Category</h2>
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
      {message && <p className="text-sm bg-green-200 text-green-500 p-3 rounded-lg">{message}</p>}
    </div>
  );
}

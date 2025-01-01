"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoPersonAdd } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("User created successfully");
      router.push("/auth/signin");
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 w-80 mx-auto rounded-lg shadow-lg text-black space-y-4">
      <form
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 font-medium text-center flex align-baseline items-center justify-center gap-2"><IoPersonAdd />Sign Up</h2>
        <div className="mb-4">
          <Label className="block mb-1">Name</Label>
          <Input
            type="name"
            className="w-full border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading} 
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-1">Email</Label>
          <Input
            type="email"
            className="w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} 
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-1">Password</Label>
          <Input
            type="password"
            className="w-full border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} 
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          variant={"default"}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
      <Button variant={"link"} className="w-full" onClick={() => router.push('/auth/signin')} size={'sm'}>Already have an account</Button>
    </div>
  );
};

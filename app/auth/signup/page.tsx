"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoPersonAdd } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        toast.error(data.error || "Something went wrong", {
          position: "bottom-center",
        });
        return;
      }

      toast.success("User created successfully", {
        position: "bottom-center",
      });

      const signInResponse = await signIn("credentials", {
        redirect: false, 
        email, 
        password,
      });

      if (signInResponse?.error) {
        toast.error("Auto-login failed. Please sign in manually.", {
          position: "bottom-center",
        });
        router.push("/auth/signin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 w-80 mx-auto rounded-lg shadow-lg text-black space-y-4">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 font-medium text-center flex align-baseline items-center justify-center gap-2">
          <IoPersonAdd />
          Sign Up
        </h2>
        <div className="mb-4">
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <Label>Password</Label>
          <Input
            type="password"
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
      <Button
        variant={"link"}
        className="w-full"
        onClick={() => router.push("/auth/signin")}
        size={"sm"}
      >
        Already have an account
      </Button>
      <ToastContainer />
    </div>
  );
}

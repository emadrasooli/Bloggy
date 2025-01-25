"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { signupSchema } from "@/validationSchema";
import { z } from "zod";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors([]);

    try {
      signupSchema.parse({ name, email, password });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setValidationErrors(data.errors);
        } else if (data.error) {
          setValidationErrors([data.error]);
        } else {
          setValidationErrors(["Something went wrong. Please try again."]);
        }
        toast.error(data.error || "Something went wrong", {
          position: "bottom-right",
        });
        return;
      }

      toast.success("User created successfully", {
        position: "bottom-right",
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
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => err.message);
        setValidationErrors(formattedErrors);
      } else {
        toast.error("Something went wrong", {
          position: "bottom-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 w-80 mx-auto rounded-lg shadow-lg text-black space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-3xl mb-4 font-semibold text-center flex align-baseline items-center justify-center gap-2">
          Sign Up
        </h1>
        <div>
          <Label>Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="relative">
          <Label>Password</Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-300 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        {validationErrors.length > 0 && (
          <div className="mb-4">
            {validationErrors.map((error, idx) => (
              <p key={idx} className="text-red-500 text-[12px]">
                {error}
              </p>
            ))}
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          variant={"default"}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
      <Button
        variant={"link"}
        className="w-full font-normal text-gray-500"
        onClick={() => router.push("/auth/signin")}
      >
        Already have an account
      </Button>
      <ToastContainer />
    </div>
  );
}

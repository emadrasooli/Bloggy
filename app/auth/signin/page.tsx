"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify"

export default function SignInPage () {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "USER") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error("Email or Password Is Invalid!", {
        position: "bottom-center"
      })
    } 
    setLoading(false);
};

  return (
    <div className="bg-white p-6 w-80 mx-auto rounded-lg shadow-lg text-black space-y-4">
      <form
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl mb-4 font-semibold text-center flex align-baseline items-center justify-center gap-2">Sign In</h1>
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
          variant={"default"}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Confirm"}
        </Button>
      </form>
      <Button variant={"link"} className="w-full" onClick={() => router.push('/auth/signup')} size={'sm'}>Create an account</Button>
      <ToastContainer />
    </div>
  );
}

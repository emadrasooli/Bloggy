"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogInIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage () {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "USER") {
        router.push("/protected");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      console.log(res.error);
    } 
};

  return (
    <div className="bg-white p-6 w-80 mx-auto rounded-lg shadow-lg text-black space-y-4">
      <form
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 font-medium text-center flex align-baseline items-center justify-center gap-2"><LogInIcon />Sign In</h2>
        <div className="mb-4">
          <Label className="block mb-1">Email</Label>
          <Input
            type="email"
            className="w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <Button
          type="submit"
          variant={"default"}
          className="w-full"
        >
          Sign In
        </Button>
      </form>
      <Button variant={"link"} className="w-full" onClick={() => router.push('/auth/signup')} size={'sm'}>Create an account</Button>
    </div>
  );
}

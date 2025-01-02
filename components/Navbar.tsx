import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function Navbar() {
    const router = useRouter();
    const session = useSession();

    const RouteToDashboard = () => {
        if(session?.data?.user.role === "ADMIN") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    }

  return (
    <div className="bg-white text-black max-w-3xl mx-auto p-3 px-6 mt-3 rounded-full flex justify-between items-center">
        <div>
            <Link href="/" className="font-semibold text-xl"><span className="px-2 bg-red-500 rounded-sm text-white me-[2px] font-bold">B</span>loggy</Link>
        </div>
        <div>
          {session.data ? (
            <Button onClick={() => RouteToDashboard()} className="rounded-full">Dashboard</Button>
          ) : (
            <Button onClick={() => router.push("/auth/signin")} className="rounded-full">Sign in</Button>
          )}
        </div>
    </div>
  )
}
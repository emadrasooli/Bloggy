import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
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
    <div className="bg-white text-black max-w-3xl mx-auto p-3 px-6 mt-3 rounded-xl flex justify-between items-center">
        <div>
            <p className="font-semibold text-xl"><span className="px-2 bg-red-500 rounded-sm text-white me-[2px] font-bold">B</span>loggy</p>
        </div>
        <div>
          {session.data ? (
            <Button onClick={() => RouteToDashboard()}>Dashboard</Button>
          ) : (
            <Button onClick={() => router.push("/auth/signin")}>Sign in</Button>
          )}
        </div>
    </div>
  )
}
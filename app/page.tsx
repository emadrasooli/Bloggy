"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  return (
    <div className="container">
      <Navbar />
    </div>
  );
}

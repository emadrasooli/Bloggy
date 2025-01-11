import  Providers  from "./providers";
import QueryProviders from "@/components/QueryProviders";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Bloggy",
  description: "A blogging platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-black text-white`}
      >
        <Providers>
          <QueryProviders>
            {children}
          </QueryProviders>
        </Providers>
      </body>
    </html>
  );
}

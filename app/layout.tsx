import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CompareTrayProvider } from "@/components/CompareTrayProvider";
import { CompareTray } from "@/components/CompareTray";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidya — Find the right college, not just a ranked list",
  description:
    "Search, filter, and compare colleges by fees, placements, and ratings — built on real structured data, not marketing copy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper">
        <CompareTrayProvider>
          <Nav />
          <main className="grow pb-20">{children}</main>
          <CompareTray />
        </CompareTrayProvider>
      </body>
    </html>
  );
}

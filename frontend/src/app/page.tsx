import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-white overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <footer className="text-center py-4 text-gray-500 text-sm">
        © 2025 LMS Online. All rights reserved.
      </footer>
    </main>
  );
}

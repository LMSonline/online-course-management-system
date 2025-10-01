import Image from "next/image";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <Image
        src="/images/lms_logo.png"   // ✅ từ /public
        alt="LMS Logo"
        width={220}
        height={220}
        priority
      />
        <h1 className="text-6xl font-extrabold text-gray-900 mt-6">LMS</h1>
        <p className="mt-3 text-green-600 text-lg">
          Learning Manager System Online
        </p>

        <button className="mt-8 px-8 py-3 text-white text-lg font-semibold rounded-lg
          bg-gradient-to-r from-green-700 via-green-500 to-green-300 hover:scale-105 transition">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        © 2025 LMS Online. All rights reserved.
      </footer>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <Image
          src="/images/lms_logo.png"
          alt="LMS Logo"
          width={220}
          height={220}
          priority
          sizes="(max-width: 768px) 160px, 220px"
        />

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
          LMS
        </h1>
        <p className="mt-3 text-green-600 text-base sm:text-lg">
          Learning Manager System Online
        </p>

        <Link
          href="/courses"
          className="mt-8 px-8 py-3 text-white text-lg font-semibold rounded-lg
                     bg-gradient-to-r from-green-700 via-green-500 to-green-300
                     hover:scale-105 transition"
        >
          Get Started
        </Link>
      </section>

      <footer className="text-center py-4 text-gray-500 text-sm">
        © 2025 LMS Online. All rights reserved.
      </footer>
    </main>
  );
}

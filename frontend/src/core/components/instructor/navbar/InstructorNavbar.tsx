"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Users,
    User,
    LogOut
} from "lucide-react";

export default function InstructorNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
        { label: "My Courses", href: "/instructor/courses", icon: BookOpen },
        { label: "Create Course", href: "/instructor/create-course", icon: PlusCircle },
        { label: "Students", href: "/instructor/students", icon: Users },
        { label: "Profile", href: "/instructor/profile", icon: User },
    ];

    return (
        <header className="w-full border-b border-white/10 bg-[#0B1120]/95 backdrop-blur-xl sticky top-0 z-40">
            <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">

                {/* LEFT: Logo */}
                <span className="text-lg font-extrabold tracking-wide
  text-[#7CFF3A] drop-shadow-[0_0_6px_#7CFF3A]">
                    LMS Instructor
                </span>


                {/* CENTER: Menu items */}
                <ul className="flex items-center gap-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`
                    flex items-center gap-2 text-sm font-medium transition
                    ${active ? "text-purple-300" : "text-slate-300 hover:text-white"}
                  `}
                                >
                                    <Icon size={18} className="opacity-80" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* RIGHT: Logout */}
                <button
                    onClick={() => {
                        localStorage.clear();
                        router.replace("/login");
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </nav>
        </header>
    );
}

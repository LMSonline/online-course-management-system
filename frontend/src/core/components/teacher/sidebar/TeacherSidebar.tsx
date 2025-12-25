"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    FileText,
    MessageSquare,
    DollarSign,
    BarChart3,
    X,
} from "lucide-react";

const navItems = [
    {
        label: "Dashboard",
        href: "/teacher/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "My Courses",
        href: "/teacher/courses",
        icon: BookOpen,
    },
    {
        label: "Students",
        href: "/teacher/students",
        icon: Users,
    },
    {
        label: "Assignments",
        href: "/teacher/assignments",
        icon: FileText,
    },
    {
        label: "Q&A",
        href: "/teacher/qna",
        icon: MessageSquare,
    },
    {
        label: "Payouts",
        href: "/teacher/payouts",
        icon: DollarSign,
    },
    {
        label: "Analytics",
        href: "/teacher/analytics",
        icon: BarChart3,
    },
];

interface TeacherSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TeacherSidebar({ isOpen, onClose }: TeacherSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/teacher/dashboard") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo/Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/brand/logo.svg"
                            alt="ELearner"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                        <div>
                            <span className="text-white font-semibold text-sm">ELearner</span>
                            <span className="text-slate-400 text-xs block">(Instructor)</span>
                        </div>
                    </Link>

                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => onClose()}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                            active
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <div className="text-xs text-slate-400 text-center">
                        © 2025 ELearner
                    </div>
                </div>
            </aside>
        </>
    );
}
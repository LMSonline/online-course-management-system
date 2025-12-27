"use client";

import { ServerCrash, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ServerErrorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* Icon with glow effect */}
                <div className="relative inline-flex mb-8">
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full p-8">
                        <ServerCrash className="h-20 w-20 text-purple-400" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Error code with gradient */}
                <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                    500
                </h1>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                    Internal Server Error
                </h2>

                {/* Description */}
                <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                    Something went wrong on our end. Our team has been notified and we&apos;re working to fix the issue. Please try again later.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
                    >
                        <Home className="h-5 w-5" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/60 hover:bg-slate-700/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 text-slate-100 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                    >
                        <RefreshCw className="h-5 w-5" />
                        Reload Page
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -z-10"></div>
            </div>
        </div>
    );
}

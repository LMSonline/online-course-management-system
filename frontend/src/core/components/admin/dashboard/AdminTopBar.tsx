import { Search, Bell, Shield, ChevronDown, Sun, Moon } from "lucide-react";
import React, { useState } from "react";

type Props = {
  stats: any;
};

export function AdminTopBar({ stats }: Props) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <header
      className={`${
        darkMode
          ? "bg-[#0a0f1e] border-b border-gray-800"
          : "bg-white border-b border-gray-200"
      } sticky top-0 z-10`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search users, courses, transactions..."
              className={`${
                darkMode
                  ? "bg-[#12182b] border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff00]"
                  : "bg-gray-100 border border-gray-300 text-black placeholder:text-gray-400 focus:border-[#00cc00]"
              } rounded-lg pl-10 pr-4 py-2 w-96 focus:outline-none`}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg border ${
              darkMode
                ? "bg-[#12182b] border-gray-700 text-yellow-300 hover:border-gray-600"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400"
            } transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              darkMode
                ? "bg-green-900/20 border border-green-700"
                : "bg-green-100 border border-green-300"
            }`}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              Healthy
            </span>
          </div>
          <button
            className={`relative p-2 ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-black"
            } transition-colors`}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-[#12182b] border border-gray-700 hover:border-gray-600"
                : "bg-gray-100 border border-gray-300 hover:border-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? "bg-[#00ff00]" : "bg-green-400"
              }`}
            >
              <Shield
                className={`w-5 h-5 ${
                  darkMode ? "text-black" : "text-white"
                }`}
              />
            </div>
            <div className="text-left">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Admin User
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Super Admin
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useRef } from "react";
import { Bell, Shield, ChevronDown, Sun, Moon } from "lucide-react";
import React from "react";
import { useAdmin } from "../AdminContext";
import { AdminProfilePopup } from "./AdminProfilePopup";
import { useMyProfile } from "@/hooks/admin/useMyProfile";

type Props = {
  stats: any;
};
const mockAvatarUrl =
  "https://ui-avatars.com/api/?name=Admin&background=10b981&color=ffffff&size=256";

export function AdminTopBar({ stats }: Props) {
  const { darkMode, setDarkMode } = useAdmin();
  const { data: profile } = useMyProfile();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleProfilePopup = () => setShowProfilePopup(!showProfilePopup);

  return (
    <header
      className={`${darkMode
          ? "bg-[#0a0f1e] border-b border-gray-800"
          : "bg-white border-b border-gray-200"
        } sticky top-0 z-10 h-[73px] flex items-center`}
    >
      <div className="flex items-center justify-end px-4 w-full gap-4">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg border ${darkMode
              ? "bg-[#12182b] border-gray-700 text-yellow-300 hover:border-gray-600"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400"
            } transition-colors`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* System Health Indicator */}
        {/* <div
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
        </div> */}

        {/* Notifications */}
        <button
          className={`relative p-2 rounded-lg transition-colors ${darkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Admin Profile Button */}
        <div className="relative">
          <button
            ref={profileButtonRef}
            onClick={toggleProfilePopup}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${darkMode
                ? "bg-[#12182b] border border-gray-700 hover:border-gray-600"
                : "bg-gray-100 border border-gray-300 hover:border-gray-400"
              } ${showProfilePopup ? (darkMode ? "border-emerald-500" : "border-emerald-500") : ""}`}
          >
            {/* Avatar */}
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl || mockAvatarUrl}
                alt={profile.username}
                className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                  }`}
              >
                <Shield
                  className={`w-5 h-5 ${darkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                />
              </div>
            )}

            {/* User Info */}
            <div className="text-left">
              <p
                className={`text-sm font-medium ${darkMode ? "text-white" : "text-black"
                  }`}
              >
                {profile?.profile?.fullName || profile?.username || "Admin User"}
              </p>
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {profile?.role === "ADMIN" ? "Super Admin" : profile?.role || "Admin"}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showProfilePopup ? "rotate-180" : ""
                } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            />
          </button>

          {/* Profile Popup */}
          <AdminProfilePopup
            open={showProfilePopup}
            onClose={() => setShowProfilePopup(false)}
            anchorEl={profileButtonRef.current}
          />
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { useMyProfile } from "@/hooks/admin/useMyProfile";
import { AdminEditProfileModal } from "./AdminEditProfileModal";
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Settings,
  X,
  Loader2,
  Edit,
} from "lucide-react";
import type { AccountProfile } from "@/lib/admin/account-profile.types";

interface AdminProfilePopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}
const mockAvatarUrl =
  "https://ui-avatars.com/api/?name=Admin&background=10b981&color=ffffff&size=256";

export function AdminProfilePopup({ open, onClose, anchorEl }: AdminProfilePopupProps) {
  const { darkMode } = useAdmin();
  const { data: profile, isLoading, error } = useMyProfile(open);
  const popupRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogout = () => {
    // Clear tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    // Redirect to login
    window.location.href = "/login";
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      ACTIVE: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Active" },
      PENDING_APPROVAL: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Pending" },
      INACTIVE: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Inactive" },
      SUSPENDED: { bg: "bg-rose-500/20", text: "text-rose-400", label: "Suspended" },
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${darkMode ? "border-current/30" : "border-current/30"
          }`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return null;

    const roleConfig: Record<string, { bg: string; text: string; icon: string }> = {
      ADMIN: { bg: "bg-purple-500/20", text: "text-purple-400", icon: "🛡️" },
      TEACHER: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "👨‍🏫" },
      STUDENT: { bg: "bg-cyan-500/20", text: "text-cyan-400", icon: "🎓" },
    };

    const config = roleConfig[role] || roleConfig.STUDENT;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${darkMode ? "border-current/30" : "border-current/30"
          }`}
      >
        {config.icon} {role}
      </span>
    );
  };

  return (
    <div
      ref={popupRef}
      className={`absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 ${darkMode
          ? "bg-[#12182b] border-gray-800"
          : "bg-white border-gray-200"
        }`}
      style={{
        animation: "slideDown 0.2s ease-out",
      }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? "border-gray-800" : "border-gray-200"
          }`}
      >
        <h3
          className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"
            }`}
        >
          Profile
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${darkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2
            className={`w-8 h-8 animate-spin ${darkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4">
          <div
            className={`p-3 rounded-lg border ${darkMode
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-rose-50 border-rose-200 text-rose-600"
              }`}
          >
            Failed to load profile
          </div>
        </div>
      )}

      {/* Profile Content */}
      {profile && !isLoading && (
        <>
          {/* Avatar & Basic Info */}
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl || mockAvatarUrl}
                    alt={profile.username}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = mockAvatarUrl;
                    }}
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                  />

                ) : (
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${darkMode
                        ? "bg-emerald-500/20 border-emerald-500"
                        : "bg-emerald-100 border-emerald-500"
                      }`}
                  >
                    <Shield
                      className={`w-8 h-8 ${darkMode ? "text-emerald-400" : "text-emerald-600"
                        }`}
                    />
                  </div>
                )}
                {/* Status Indicator */}
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${profile.status === "ACTIVE"
                      ? "bg-emerald-500"
                      : "bg-gray-400"
                    } ${darkMode ? "border-[#12182b]" : "border-white"
                    }`}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-bold text-lg truncate ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {profile.profile?.fullName || profile.username}
                </h4>
                <p
                  className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  @{profile.username}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {getRoleBadge(profile.role)}
                  {getStatusBadge(profile.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className={`border-t ${darkMode ? "border-gray-800" : "border-gray-200"
              }`}
          />

          {/* Details */}
          <div className="p-4 space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail
                className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                  Email
                </p>
                <p
                  className={`text-sm truncate ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Account ID */}
            <div className="flex items-center gap-3">
              <User
                className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                  Account ID
                </p>
                <p
                  className={`text-sm font-mono ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  #{profile.accountId}
                </p>
              </div>
            </div>

            {/* Last Login */}
            {profile.lastLoginAt && (
              <div className="flex items-center gap-3">
                <Calendar
                  className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                  >
                    Last Login
                  </p>
                  <p
                    className={`text-sm ${darkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {new Date(profile.lastLoginAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            className={`border-t ${darkMode ? "border-gray-800" : "border-gray-200"
              }`}
          />

          {/* Actions */}
          <div className="p-2">
            {/* <button
              onClick={() => setShowEditModal(true)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              }`}
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Profile</span>
            </button> */}

            <button
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${darkMode
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Account Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${darkMode
                  ? "hover:bg-rose-500/10 text-rose-400"
                  : "hover:bg-rose-50 text-rose-600"
                }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      <AdminEditProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { useMyProfile, useUpdateMyProfile, useUploadMyAvatar } from "@/hooks/admin/useMyProfile";
import {
  X,
  Loader2,
  Camera,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Gender } from "@/lib/admin/account-profile.types";

interface AdminEditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminEditProfileModal({ open, onClose }: AdminEditProfileModalProps) {
  const { darkMode } = useAdmin();
  const { data: profile, isLoading: profileLoading } = useMyProfile(open);
  const updateProfile = useUpdateMyProfile();
  const uploadAvatar = useUploadMyAvatar();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<Gender>("UNKNOWN");

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.profile?.fullName || "");
      setPhone(profile.profile?.phone || "");
      setBirthDate(profile.profile?.birthDate || "");
      setBio(profile.profile?.bio || "");
      setGender(profile.profile?.gender || "UNKNOWN");
      setAvatarPreview(profile.avatarUrl || null);
    }
  }, [profile]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setUploadingAvatar(true);
    try {
      await uploadAvatar.mutateAsync(avatarFile);
      setAvatarFile(null);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload avatar first if changed
      if (avatarFile) {
        await handleAvatarUpload();
      }

      // Update profile
      await updateProfile.mutateAsync({
        fullName: fullName || undefined,
        phone: phone || undefined,
        birthDate: birthDate || undefined,
        bio: bio || undefined,
        gender: gender !== "UNKNOWN" ? gender : undefined,
      });

      setSuccess(true);

      // Auto close after 1.5s
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  if (!open) return null;

  const isLoading = updateProfile.isPending || uploadingAvatar;
  const error = updateProfile.error || uploadAvatar.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-colors ${
          darkMode ? "bg-black/70" : "bg-gray-900/50"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl border overflow-hidden ${
          darkMode ? "bg-[#12182b] border-gray-800" : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-3 border-b ${
            darkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Profile
            </h2>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Update your personal information
            </p>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
            aria-label="Close"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                className={`w-8 h-8 animate-spin ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500"
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      <User
                        className={`w-10 h-10 ${
                          darkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`absolute bottom-0 right-0 p-1.5 rounded-full border-2 ${
                      darkMode
                        ? "bg-emerald-500 border-[#12182b] hover:bg-emerald-600"
                        : "bg-emerald-600 border-white hover:bg-emerald-700"
                    } text-white transition-colors`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {avatarFile && (
                  <div
                    className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs ${
                      darkMode
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-blue-50 border-blue-200 text-blue-600"
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    New avatar ready
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <User className="w-3.5 h-3.5 inline mr-1.5" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500"
                  } focus:outline-none`}
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    darkMode
                      ? "bg-gray-900 border-gray-800 text-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  } cursor-not-allowed`}
                />
                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+84 123 456 789"
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500"
                  } focus:outline-none`}
                />
              </div>

              {/* Birth Date & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none`}
                  >
                    <option value="UNKNOWN">Prefer not to say</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors resize-none ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500"
                  } focus:outline-none`}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2 ${
                    darkMode
                      ? "bg-rose-500/10 border-rose-500/30"
                      : "bg-rose-50 border-rose-200"
                  }`}
                >
                  <AlertCircle
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      darkMode ? "text-rose-400" : "text-rose-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold text-xs ${
                        darkMode ? "text-rose-300" : "text-rose-700"
                      }`}
                    >
                      Update Failed
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        darkMode ? "text-rose-400" : "text-rose-600"
                      }`}
                    >
                      {(error as Error).message || "Something went wrong"}
                    </p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2 ${
                    darkMode
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <CheckCircle
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      darkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold text-xs ${
                        darkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Profile Updated!
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        darkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      Your changes have been saved
                    </p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex gap-3 px-5 py-3 border-t ${
            darkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || success}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isLoading || success
                ? darkMode
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : darkMode
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
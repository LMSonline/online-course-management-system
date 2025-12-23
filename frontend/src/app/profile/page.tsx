"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useAuthStore } from "@/store/auth.store";
import { Tabs } from "@/components/ui/Tabs";
import { SafeImage } from "@/components/shared/SafeImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Upload, Save, Globe, Lock } from "lucide-react";
import { useToastStore } from "@/lib/toast";
import type { UpdateProfileRequest } from "@/features/profile/types/profile.types";

// Split fullName into firstName and lastName
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const lastName = parts.pop() || "";
  const firstName = parts.join(" ");
  return { firstName, lastName };
}

// Count words in text
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

// Validate URL
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // Empty is valid (optional)
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, saving, updateProfileData, uploadAvatarFile } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState<UpdateProfileRequest & { 
    firstName: string;
    lastName: string;
    headline: string;
    website: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
    twitter: string;
    language: string;
    privacy: {
      showProfilePublic: boolean;
      showCoursesOnProfile: boolean;
    };
  }>({
    firstName: "",
    lastName: "",
    headline: "",
    bio: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    twitter: "",
    language: "vi",
    privacy: {
      showProfilePublic: true,
      showCoursesOnProfile: false,
    },
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      const { firstName, lastName } = splitFullName(profile.fullName || "");
      setFormData({
        firstName,
        lastName,
        headline: "", // Not in backend yet
        bio: profile.bio || "",
        website: "", // Not in backend yet
        facebook: "", // Not in backend yet
        instagram: "", // Not in backend yet
        linkedin: "", // Not in backend yet
        tiktok: "", // Not in backend yet
        twitter: "", // Not in backend yet
        language: "vi",
        privacy: {
          showProfilePublic: true, // Default
          showCoursesOnProfile: false, // Default
        },
      });
      setIsDirty(false);
    }
  }, [profile]);

  // Check if form is dirty
  useEffect(() => {
    if (!profile) return;
    const { firstName, lastName } = splitFullName(profile.fullName || "");
    const hasChanges =
      formData.firstName !== firstName ||
      formData.lastName !== lastName ||
      formData.bio !== (profile.bio || "");
    setIsDirty(hasChanges);
  }, [formData, profile]);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent("/profile")}`);
    }
  }, [user, authLoading, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value },
    }));
    setIsDirty(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (formData.headline.length > 60) {
      newErrors.headline = "Headline must be 60 characters or less";
    }
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updated = await updateProfileData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        headline: formData.headline, // Frontend-only, stored locally
        website: formData.website, // Frontend-only
        facebook: formData.facebook, // Frontend-only
        instagram: formData.instagram, // Frontend-only
        linkedin: formData.linkedin, // Frontend-only
        tiktok: formData.tiktok, // Frontend-only
        twitter: formData.twitter, // Frontend-only
      });

      // Update auth store user snapshot
      if (updated && user) {
        useAuthStore.getState().setUser({
          ...user,
          fullName: updated.fullName,
          avatarUrl: updated.avatarUrl,
        });
      }

      setIsDirty(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        useToastStore.getState().error("Image must be less than 5MB");
        return;
      }
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
    try {
      await uploadAvatarFile(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Update auth store
      if (user && profile) {
        useAuthStore.getState().setUser({
          ...user,
          avatarUrl: profile.avatarUrl,
        });
      }
    } catch (error) {
      // Error already handled in hook
    }
  };

  if (authLoading || loading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </section>
      </main>
    );
  }

  if (!user) {
    return null; // Redirecting
  }

  if (!profile) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl">
          <EmptyState
            title="Failed to load profile"
            message="Unable to load your profile. Please try again."
            action={
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] transition"
              >
                Retry
              </button>
            }
          />
        </section>
      </main>
    );
  }

  const tabs = [
    { id: "profile", label: "Udemy profile" },
    { id: "picture", label: "Profile picture" },
    { id: "privacy", label: "Privacy settings" },
  ];

  const bioWordCount = countWords(formData.bio || "");
  const headlineCharCount = formData.headline.length;

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Profile & settings</h1>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {/* Tab 1: Udemy profile */}
        {activeTab === "profile" && (
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                      errors.firstName ? "border-red-500" : "border-white/10"
                    } text-slate-200 focus:outline-none focus:border-[var(--brand-500)]`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                      errors.lastName ? "border-red-500" : "border-white/10"
                    } text-slate-200 focus:outline-none focus:border-[var(--brand-500)]`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Headline
                    </label>
                    <span className="text-xs text-slate-400">
                      {headlineCharCount}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => {
                      if (e.target.value.length <= 60) {
                        handleInputChange("headline", e.target.value);
                      }
                    }}
                    placeholder="e.g., Software Engineer at Tech Company"
                    maxLength={60}
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                      errors.headline ? "border-red-500" : "border-white/10"
                    } text-slate-200 focus:outline-none focus:border-[var(--brand-500)]`}
                  />
                  {errors.headline && (
                    <p className="mt-1 text-xs text-red-400">{errors.headline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Biography
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={6}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)] resize-none"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    {bioWordCount} words {bioWordCount < 50 ? "(at least 50 words recommended)" : ""}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                      errors.website ? "border-red-500" : "border-white/10"
                    } text-slate-200 focus:outline-none focus:border-[var(--brand-500)]`}
                  />
                  {errors.website && (
                    <p className="mt-1 text-xs text-red-400">{errors.website}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Social links
                  </label>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">facebook.com/</span>
                    </div>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">instagram.com/</span>
                    </div>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">linkedin.com/in/</span>
                    </div>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="public-profile-url"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">tiktok.com/@</span>
                    </div>
                    <input
                      type="text"
                      value={formData.tiktok}
                      onChange={(e) => handleInputChange("tiktok", e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">x.com/</span>
                    </div>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="px-6 py-2.5 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Profile picture */}
        {activeTab === "picture" && (
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Profile picture</h2>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                {avatarPreview || profile.avatarUrl ? (
                  <SafeImage
                    src={avatarPreview || profile.avatarUrl || ""}
                    alt={profile.fullName}
                    width={120}
                    height={120}
                    className="rounded-full border-2 border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-[120px] h-[120px] rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center">
                    <span className="text-4xl text-slate-400">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload new picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-600)] file:text-white hover:file:bg-[var(--brand-700)]"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>

                {avatarFile && (
                  <button
                    onClick={handleAvatarUpload}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Privacy settings */}
        {activeTab === "privacy" && (
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Privacy settings</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 mb-6">
                <p className="text-sm text-amber-300">
                  <strong>Note:</strong> Privacy settings are not yet supported by the backend. These preferences are stored locally only.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-slate-900/40">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={16} className="text-slate-300" />
                    <label className="text-sm font-medium text-slate-200">
                      Show profile publicly
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">
                    Allow others to view your profile
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacy.showProfilePublic}
                    onChange={(e) => handlePrivacyChange("showProfilePublic", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--brand-500)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-600)]" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-slate-900/40">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock size={16} className="text-slate-300" />
                    <label className="text-sm font-medium text-slate-200">
                      Show courses on profile
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">
                    Display your enrolled courses on your public profile
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacy.showCoursesOnProfile}
                    onChange={(e) => handlePrivacyChange("showCoursesOnProfile", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--brand-500)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-600)]" />
                </label>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    // Store privacy settings locally (not in backend yet)
                    localStorage.setItem("profile_privacy", JSON.stringify(formData.privacy));
                    useToastStore.getState().success("Privacy settings saved (local only)");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}


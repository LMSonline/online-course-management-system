"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile, uploadAvatar, type AccountProfileResponse } from "@/features/profile/services/profile.service";
import { getCurrentUserInfo } from "@/features/auth/services/auth.service";
import { User, Mail, Calendar, Edit2, Upload } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    birthday: "",
    gender: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        await getCurrentUserInfo(); // Verify user is authenticated
        const profileData = await getProfile();
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || "",
          bio: profileData.bio || "",
          birthday: profileData.birthday || "",
          gender: profileData.gender || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    try {
      const result = await uploadAvatar(avatarFile);
      setProfile({ ...profile!, avatarUrl: result.avatarUrl });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload avatar");
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarPreview || profile.avatarUrl || "/images/default-avatar.png"}
                        alt={profile.fullName}
                        className="w-24 h-24 rounded-full border-2 border-white/20"
                      />
              {editing && (
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                  <Upload className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.fullName}</h2>
              <p className="text-slate-400">{profile.email}</p>
              {editing && avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  className="mt-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded text-white"
                >
                  Upload
                </button>
              )}
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                />
              ) : (
                <p className="text-white">{profile.fullName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-white">{profile.email}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4" />
                Birthday
              </label>
              {editing ? (
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                />
              ) : (
                <p className="text-white">{profile.birthday || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Bio</label>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                />
              ) : (
                <p className="text-white">{profile.bio || "No bio"}</p>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    fullName: profile.fullName || "",
                    bio: profile.bio || "",
                    birthday: profile.birthday || "",
                    gender: profile.gender || "",
                  });
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


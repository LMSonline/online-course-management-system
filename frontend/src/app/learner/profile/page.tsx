"use client";

import {
  useAccountProfile,
  useUpdateAccountProfile,
  useUploadAvatar,
} from "@/hooks/account/useAccountProfile";

import { useRef, useState, ChangeEvent, FormEvent, useEffect } from "react";
import type { Gender } from "@/services/account/accountProfile.types";
import { toast } from "sonner";

export default function ProfilePage() {
  const {
    data,
    isLoading,
    refetch: refetchProfile,
  } = useAccountProfile();

  const updateProfile = useUpdateAccountProfile();
  const uploadAvatar = useUploadAvatar();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    birthDate: "",
    bio: "",
    gender: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.profile) {
      setForm({
        fullName: data.profile.fullName || "",
        phone: data.profile.phone || "",
        birthDate: data.profile.birthDate || "",
        bio: data.profile.bio || "",
        gender: data.profile.gender || "",
      });
      setAvatarPreview(data.avatarUrl || "");
    }
  }, [data]);

  if (isLoading) {
    return <div className="p-8 text-white/70">Loading profile...</div>;
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    try {
      const res = await uploadAvatar.mutateAsync(file);
      setAvatarPreview(res.avatarUrl);
      toast.success("Avatar updated successfully!");
      refetchProfile();
    } catch {
      toast.error("Failed to upload avatar");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        ...form,
        gender: form.gender ? (form.gender as Gender) : undefined,
      });
      toast.success("Profile updated successfully!");
      refetchProfile();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F1623] to-[#0B1220] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        {/* Accent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_60%)]" />

        {/* ===== Header ===== */}
        <div className="relative flex flex-col md:flex-row items-center gap-8 border-b border-white/10 px-6 py-8">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={avatarPreview || "/images/default-avatar.png"}
              alt="Avatar"
              className="h-32 w-32 rounded-full object-cover border-4 border-sky-400/40 shadow-lg transition group-hover:brightness-90"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-black shadow hover:bg-sky-400"
            >
              Change avatar
            </button>
          </div>

          {/* User info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-white">
              {data?.profile?.fullName || data?.username}
            </h1>
            <p className="mt-1 text-sm text-white/60">{data?.email}</p>

            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                {data?.role === "STUDENT"
                  ? "Student"
                  : data?.role === "TEACHER"
                  ? "Instructor"
                  : "Administrator"}
              </span>

              {data?.profile?.studentCode && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                  Student ID: {data.profile.studentCode}
                </span>
              )}

              {data?.profile?.teacherCode && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                  Instructor ID: {data.profile.teacherCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===== Form ===== */}
        <form
          onSubmit={handleSubmit}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8"
        >
          {/* Full name */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-white/80">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-white/80">
              Phone number
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>

          {/* Birth date */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-white/80">
              Date of birth
            </label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-white/80">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="UNKNOWN">Prefer not to say</option>
            </select>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-white/80">
              About you
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-8 py-3 text-sm font-semibold text-black shadow hover:from-sky-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

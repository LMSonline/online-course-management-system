"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, User, Upload } from "lucide-react";
import Image from "next/image";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";
import { UpdateProfileRequest } from "@/services/account/account.types";
import { Gender } from "@/services/auth/auth.types";

export const ProfileTab = () => {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const uploadAvatar = useUploadAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UpdateProfileRequest>({
        fullName: "",
        birthDate: "",
        phone: "",
        bio: "",
        gender: undefined,
        specialty: "",
        degree: "",
    });

    // Update form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.profile?.fullName || "",
                birthDate: profile.profile?.birthDate || "",
                phone: profile.profile?.phone || "",
                bio: profile.profile?.bio || "",
                gender: profile.profile?.gender || undefined,
                specialty: profile.profile?.specialty || "",
                degree: profile.profile?.degree || "",
            });
        }
    }, [profile]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        uploadAvatar.mutate(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Profile Information
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Update your personal information and profile picture
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                            {profile?.avatarUrl ? (
                                <Image
                                    src={profile.avatarUrl}
                                    alt={profile.profile?.fullName || profile.username}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadAvatar.isPending}
                            className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
                        >
                            {uploadAvatar.isPending ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <Camera className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">JPG or PNG</p>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={profile?.username || ""}
                            disabled
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Birth Date
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                        >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Specialty
                        </label>
                        <input
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleInputChange}
                            placeholder="e.g., Web Development, Data Science"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Degree
                        </label>
                        <input
                            type="text"
                            name="degree"
                            value={formData.degree}
                            onChange={handleInputChange}
                            placeholder="e.g., M.Sc. Computer Science"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white resize-none"
                    />
                </div>

                {/* Teacher Info */}
                {profile?.profile?.teacherCode && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">
                                    Teacher Code
                                </label>
                                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                    {profile.profile.teacherCode}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">
                                    Approval Status
                                </label>
                                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                    {profile.profile.approved ? "Approved" : "Pending"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

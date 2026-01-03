"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useChangePassword } from "@/hooks/useAuth";

export const SecurityTab = () => {
    const changePassword = useChangePassword();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validateForm = () => {
        const newErrors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            newErrors.newPassword = "Password must contain uppercase, lowercase, and number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        changePassword.mutate(
            {
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            },
            {
                onSuccess: () => {
                    // Reset form
                    setFormData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                },
            }
        );
    };

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength: 1, label: "Weak", color: "bg-red-500" };
        if (strength <= 3) return { strength: 2, label: "Fair", color: "bg-yellow-500" };
        if (strength <= 4) return { strength: 3, label: "Good", color: "bg-blue-500" };
        return { strength: 4, label: "Strong", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Change Password
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Update your password to keep your account secure
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                {/* Current Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter current password"
                            className={`w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.currentPassword
                                    ? "border-red-500 dark:border-red-400"
                                    : "border-slate-200 dark:border-slate-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.currentPassword}
                        </p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            className={`w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.newPassword
                                    ? "border-red-500 dark:border-red-400"
                                    : "border-slate-200 dark:border-slate-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                            {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.newPassword}
                        </p>
                    )}

                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                    Password Strength
                                </span>
                                <span className={`text-xs font-medium ${passwordStrength.strength === 1 ? "text-red-600 dark:text-red-400" :
                                        passwordStrength.strength === 2 ? "text-yellow-600 dark:text-yellow-400" :
                                            passwordStrength.strength === 3 ? "text-blue-600 dark:text-blue-400" :
                                                "text-green-600 dark:text-green-400"
                                    }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1.5 flex-1 rounded-full transition-all ${level <= passwordStrength.strength
                                                ? passwordStrength.color
                                                : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                            className={`w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.confirmPassword
                                    ? "border-red-500 dark:border-red-400"
                                    : "border-slate-200 dark:border-slate-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={changePassword.isPending}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        {changePassword.isPending ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </form>

            {/* Security Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Password Security Tips
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Use at least 8 characters (12+ recommended)</li>
                    <li>• Mix uppercase and lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                    <li>• Avoid common words and personal information</li>
                    <li>• Don't reuse passwords from other accounts</li>
                </ul>
            </div>
        </div>
    );
};

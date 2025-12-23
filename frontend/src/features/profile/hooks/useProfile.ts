"use client";

import { useState, useEffect } from "react";
import { getProfile, updateProfile, uploadAvatar } from "../services/profile.service";
import type { AccountProfileResponse, UpdateProfileRequest } from "../types/profile.types";
import { useToastStore } from "@/lib/toast";

export function useProfile() {
  const [profile, setProfile] = useState<AccountProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load profile";
      setError(message);
      useToastStore.getState().error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (payload: UpdateProfileRequest) => {
    try {
      setSaving(true);
      setError(null);
      
      // Extract firstName/lastName from fullName if provided
      const updatePayload: UpdateProfileRequest = { ...payload };
      if (payload.firstName && payload.lastName) {
        updatePayload.fullName = `${payload.firstName} ${payload.lastName}`.trim();
        delete updatePayload.firstName;
        delete updatePayload.lastName;
      }
      
      // Remove frontend-only fields before sending to backend
      const backendPayload: any = {
        fullName: updatePayload.fullName,
        bio: updatePayload.bio,
        birthday: updatePayload.birthday,
        gender: updatePayload.gender,
      };
      
      // Remove undefined fields
      Object.keys(backendPayload).forEach((key) => {
        if (backendPayload[key] === undefined) {
          delete backendPayload[key];
        }
      });

      const updated = await updateProfile(backendPayload);
      setProfile(updated);
      useToastStore.getState().success("Profile updated successfully!");
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
      useToastStore.getState().error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatarFile = async (file: File) => {
    try {
      setSaving(true);
      setError(null);
      const result = await uploadAvatar(file);
      if (profile) {
        setProfile({ ...profile, avatarUrl: result.avatarUrl });
      }
      useToastStore.getState().success("Avatar uploaded successfully!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload avatar";
      setError(message);
      useToastStore.getState().error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    saving,
    fetchProfile,
    updateProfileData,
    uploadAvatarFile,
  };
}


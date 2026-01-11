"use client";

import { useAdmin } from "@/core/components/admin/AdminContext";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const { darkMode } = useAdmin();

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>System Settings</h2>
      
      <div className="text-center py-20">
        <Settings className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-400"} mx-auto mb-4`} />
        <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          System Settings
        </h3>
        <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} mt-2`}>
          Configure system parameters and preferences
        </p>
      </div>
    </div>
  );
}

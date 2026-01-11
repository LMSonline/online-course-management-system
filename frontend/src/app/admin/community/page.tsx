"use client";

import { useAdmin } from "@/core/components/admin/AdminContext";
import { MessageSquare } from "lucide-react";

export default function AdminCommunityPage() {
  const { darkMode } = useAdmin();

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Community Moderation</h2>
      
      <div className="text-center py-20">
        <MessageSquare className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-400"} mx-auto mb-4`} />
        <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Community Moderation
        </h3>
        <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} mt-2`}>
          Content moderation and reports will appear here
        </p>
      </div>
    </div>
  );
}

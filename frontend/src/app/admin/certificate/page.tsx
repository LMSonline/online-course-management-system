"use client";

import { useAdmin } from "@/core/components/admin/AdminContext";
import { Award } from "lucide-react";

export default function AdminCertificatesPage() {
  const { darkMode } = useAdmin();

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Certificates Management</h2>
      
      <div className="text-center py-20">
        <Award className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-400"} mx-auto mb-4`} />
        <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Certificates Management
        </h3>
        <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} mt-2`}>
          Certificate verification and management will appear here
        </p>
      </div>
    </div>
  );
}

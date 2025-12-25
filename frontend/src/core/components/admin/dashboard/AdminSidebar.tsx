import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  MessageSquare,
  Settings,
  Shield,
  Award,
  FileText,
} from "lucide-react";

type Props = {
  currentView: string;
  setCurrentView: (view: any) => void;
  stats: any;
};

export function AdminSidebar({ currentView, setCurrentView, stats }: Props) {
  return (
    <aside className="w-64 bg-[#0a0f1e] border-r border-gray-800 min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-[#00ff00]">ADMIN DASHBOARD</h1>
      </div>
      <nav className="p-4">
        <div className="space-y-1">
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "dashboard"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView("users")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "users"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">User Management</span>
          </button>
          <button
            onClick={() => setCurrentView("courses")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "courses"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">Course Approval</span>
            {stats.pendingApproval > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                {stats.pendingApproval}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView("payments")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "payments"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <DollarSign className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">Payments & Revenue</span>
          </button>
          <button
            onClick={() => setCurrentView("certificates")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "certificates"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Award className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">Certificates</span>
          </button>
          <button
            onClick={() => setCurrentView("community")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "community"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">Content Moderation</span>
          </button>
          <button
            onClick={() => setCurrentView("reports")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "reports"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">Reports & Analytics</span>
          </button>
          <button
            onClick={() => setCurrentView("settings")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === "settings"
                ? "bg-[#00ff00]/10 text-[#00ff00]"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1 text-left ml-3">System Settings</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

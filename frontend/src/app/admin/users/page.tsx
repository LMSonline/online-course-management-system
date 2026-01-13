"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetAllAccounts,
  useSuspendAccount,
  useUnlockAccount,
  useApproveTeacherAccount,
  useDeactivateAccount,
  useRejectTeacherAccount,
} from "@/hooks/useAdminAccounts";
import { AccountResponse } from "@/services/account/account.types";
import AdminExportUsersScreen from "./export/page";
import { AdminUserStatsScreen } from "./stats/page";

import { UserHeader ,UserStatsCards,
  UserSearchBar,
  UserTabs,
  UserTable,
  UserActionModal, } from "@/core/components/admin/users";
export default function AdminUsersScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get page and size from URL query params
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  const initialPage = pageParam ? Number(pageParam) - 1 : 0;
  const initialSize = sizeParam ? Number(sizeParam) : 50;

  // State management
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [showStatsView, setShowStatsView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AccountResponse | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  // export type AccountActionType =
  // | "APPROVE"
  // | "REJECT"
  // | "SUSPEND"
  // | "UNLOCK"
  // | "DEACTIVATE"
  // | "UNKNOWN";

  const [actionType, setActionType] = useState<"approve" | "reject" | "deactivate" | null>(null);
  const [actionReason, setActionReason] = useState("");

  // Build filter params based on selected tab
  const filterParams = useMemo(() => {
    const params: any = { page, size: initialSize, searchQuery };

    if (selectedTab === "learners") {
      params.role = "STUDENT";
    } else if (selectedTab === "instructors") {
      params.role = "TEACHER";
    } else if (selectedTab === "suspended") {
      params.status = "SUSPENDED";
    } else if (selectedTab === "pending") {
      params.status = "PENDING_APPROVAL";
    }

    return params;
  }, [selectedTab, page, searchQuery, initialSize]);

  // API hooks
  const { data, isLoading, error } = useGetAllAccounts(filterParams);
  const suspendMutation = useSuspendAccount();
  const unlockMutation = useUnlockAccount();
  const approveMutation = useApproveTeacherAccount();
  const rejectMutation = useRejectTeacherAccount();
  const deactivateMutation = useDeactivateAccount();

  const users = data?.items || [];

/**
 * Status of user accounts in the system
 */
// (alias) type AccountStatus = "ACTIVE" | "PENDING_APPROVAL" | "PENDING_EMAIL" | "SUSPENDED" | "INACTIVE"
  // Calculate stats
// const stats = useMemo(() => ({
//   total: users.length,
//   learners: users.filter(u => u.role === "STUDENT").length,
//   instructors: users.filter(u => u.role === "TEACHER").length,
//   pending: users.filter(u => u.status === "PENDING_APPROVAL").length,
//   suspended: users.filter(u => u.status === "SUSPENDED").length,
// }), [users]);
const stats = useMemo(() => ({
  totalUsers: users.length,
  learners: users.filter(u => u.role === "STUDENT").length,
  instructors: users.filter(u => u.role === "TEACHER").length,
  suspended: users.filter(u => u.status === "SUSPENDED").length,
  pending: users.filter(u => u.status === "PENDING_APPROVAL").length,
}), [data, users]);


  // Filter users by tab
  // const filteredUsers = useMemo(() => {
  //   return users.filter((user: AccountResponse) => {
  //     if (selectedTab === "all") return true;
  //     if (selectedTab === "learners") return user.role === "STUDENT";
  //     if (selectedTab === "instructors") return user.role === "TEACHER";
  //     if (selectedTab === "suspended") return user.status === "SUSPENDED";
  //     if (selectedTab === "pending") return user.status === "PENDING_APPROVAL";
  //     return true;
  //   });
  // }, [users, selectedTab]);

  // Action handlers
  const handleLock = async (userId: number) => {
    suspendMutation.mutate({ id: userId });
  };

  const handleUnlock = async (userId: number) => {
    unlockMutation.mutate({ id: userId });
  };

  const openActionModal = (user: AccountResponse, type: "approve" | "reject" | "deactivate") => {
    setSelectedUser(user);
    setActionType(type);
    setActionReason("");
    setShowActionModal(true);
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedUser(null);
    setActionType(null);
    setActionReason("");
  };

  const handleActionConfirm = () => {
    if (!selectedUser || !actionType) return;

    if (actionType === "approve") {
      approveMutation.mutate(selectedUser.accountId, {
        onSuccess: () => closeActionModal(),
      });
    } else if (actionType === "reject") {
      rejectMutation.mutate(
        { id: selectedUser.accountId, reason: actionReason },
        { onSuccess: () => closeActionModal() }
      );
    } else if (actionType === "deactivate") {
      deactivateMutation.mutate(
        { id: selectedUser.accountId, payload: { reason: actionReason } },
        { onSuccess: () => closeActionModal() }
      );
    }
  };

  const isProcessing =
    suspendMutation.isPending || unlockMutation.isPending;

  const isModalProcessing =
    approveMutation.isPending || rejectMutation.isPending || deactivateMutation.isPending;

  // Show stats view
  if (showStatsView) {
    return (
      <div className="min-h-screen bg-[#0a1123]">
        <AdminUserStatsScreen />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Action Modal */}
      <UserActionModal
        isOpen={showActionModal}
        selectedUser={selectedUser}
        actionType={actionType}
        actionReason={actionReason}
        isProcessing={isModalProcessing}
        onReasonChange={setActionReason}
        onConfirm={handleActionConfirm}
        onClose={closeActionModal}
      />

      {/* Export Popup */}
      {showExportPopup && (
        <AdminExportUsersScreen
          open={showExportPopup}
          onClose={() => setShowExportPopup(false)}
        />
      )}

      {/* Header */}
      <UserHeader
        onShowStats={() => setShowStatsView(true)}
        onShowExport={() => setShowExportPopup(true)}
      />

      {/* Stats Cards */}
      <UserStatsCards stats={stats} />

      {/* Search Bar */}
      <UserSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Tabs */}
      <UserTabs selectedTab={selectedTab} onTabChange={setSelectedTab} stats={stats} />

      {/* Users Table */}
      <UserTable
        users={users}
        loading={isLoading}
        error={error}
        isProcessing={isProcessing}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onApprove={(user) => openActionModal(user, "approve")}
        onReject={(user) => openActionModal(user, "reject")}
        onDeactivate={(user) => openActionModal(user, "deactivate")}
      />
    </div>
  );
}

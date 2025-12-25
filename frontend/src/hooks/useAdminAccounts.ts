import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppError } from "@/lib/api/api.error";
import { accountService } from "@/services/account/account.service";
import {
  AccountResponse,
  AccountProfileResponse,
  AccountActionRequest,
} from "@/services/account/account.types";
import { PageResponse } from "@/lib/api/api.types";
import { sfAnd, sfOr, sfEqual, sfLike } from "spring-filter-query-builder";

// Types for filters
export interface AccountsFilterParams {
  role?: string;
  status?: string;
  searchQuery?: string;
  page?: number;
  size?: number;
}

// Build filter string using spring-filter-query-builder
function buildAccountsFilter(params: AccountsFilterParams): string | undefined {
  const filters: any[] = [];

  if (params.role) {
    filters.push(sfEqual("role", params.role));
  }

  if (params.status) {
    filters.push(sfEqual("status", params.status));
  }

  if (params.searchQuery && params.searchQuery.trim()) {
    const searchTerm = params.searchQuery.trim();
    filters.push(
      sfOr([
        sfLike("username", `*${searchTerm}*`, true),
        sfLike("email", `*${searchTerm}*`, true),
        sfLike("profile.fullName", `*${searchTerm}*`, true),
      ])
    );
  }

  if (filters.length === 0) return undefined;
  if (filters.length === 1) return filters[0].toString();
  return sfAnd(filters).toString();
}

// Get all accounts hook
export const useGetAllAccounts = (params: AccountsFilterParams = {}) => {
  const { page = 0, size = 20, ...filterParams } = params;
  const filter = buildAccountsFilter(filterParams);

  return useQuery<PageResponse<AccountResponse>, AppError>({
    queryKey: ["adminAccounts", page, size, filter],
    queryFn: () => accountService.getAllAccounts(page, size, filter),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get account by ID hook
export const useGetAccountById = (id: number, enabled: boolean = true) => {
  return useQuery<AccountProfileResponse, AppError>({
    queryKey: ["adminAccount", id],
    queryFn: () => accountService.getAccountById(id),
    enabled: enabled && !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Suspend account hook
export const useSuspendAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AccountProfileResponse,
    AppError,
    { id: number; payload?: AccountActionRequest }
  >({
    mutationFn: ({ id, payload }) => accountService.suspendAccount(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminAccount", variables.id],
      });
      toast.success("Account suspended successfully");
    },
    onError: (error) => {
      console.error("Suspend account error:", error);
      toast.error(error.message || "Failed to suspend account");
    },
  });
};

// Unlock account hook
export const useUnlockAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AccountProfileResponse,
    AppError,
    { id: number; payload?: AccountActionRequest }
  >({
    mutationFn: ({ id, payload }) => accountService.unlockAccount(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminAccount", variables.id],
      });
      toast.success("Account unlocked successfully");
    },
    onError: (error) => {
      console.error("Unlock account error:", error);
      toast.error(error.message || "Failed to unlock account");
    },
  });
};

// Approve teacher account hook
export const useApproveTeacherAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<AccountProfileResponse, AppError, number>({
    mutationFn: (id) => accountService.approveTeacherAccount(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["adminAccount", id] });
      toast.success("Teacher account approved successfully");
    },
    onError: (error) => {
      console.error("Approve teacher error:", error);
      toast.error(error.message || "Failed to approve teacher account");
    },
  });
};

// Reject teacher account hook
export const useRejectTeacherAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AccountProfileResponse,
    AppError,
    { id: number; reason?: string }
  >({
    mutationFn: ({ id, reason }) =>
      accountService.rejectTeacherAccount(id, { reason }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminAccount", variables.id],
      });
      toast.success("Teacher account rejected");
    },
    onError: (error) => {
      console.error("Reject teacher error:", error);
      toast.error(error.message || "Failed to reject teacher account");
    },
  });
};

// Deactivate account hook
export const useDeactivateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AccountProfileResponse,
    AppError,
    { id: number; payload?: AccountActionRequest }
  >({
    mutationFn: ({ id, payload }) =>
      accountService.deactivateAccount(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminAccount", variables.id],
      });
      toast.success("Account deactivated successfully");
    },
    onError: (error) => {
      console.error("Deactivate account error:", error);
      toast.error(error.message || "Failed to deactivate account");
    },
  });
};

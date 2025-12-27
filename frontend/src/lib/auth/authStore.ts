import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InternalRole } from "./roleMap";

export interface AuthState {
  // Account info (from AUTH_ME)
  accountId: number | null;
  role: InternalRole | null;
  email: string | null;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;

  // Domain IDs (from STUDENT_GET_ME / TEACHER_GET_ME)
  studentId: number | null;
  teacherId: number | null;

  // Actions
  setAuth: (data: {
    accountId: number;
    role: InternalRole;
    email: string;
    fullName?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
  }) => void;
  setStudentId: (studentId: number) => void;
  setTeacherId: (teacherId: number) => void;
  clear: () => void;

  // Getters
  isAuthenticated: () => boolean;
  isStudent: () => boolean;
  isTeacher: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      accountId: null,
      role: null,
      email: null,
      fullName: null,
      username: null,
      avatarUrl: null,
      studentId: null,
      teacherId: null,

      // Actions
      setAuth: (data) =>
        set({
          accountId: data.accountId,
          role: data.role,
          email: data.email,
          fullName: data.fullName ?? null,
          username: data.username ?? null,
          avatarUrl: data.avatarUrl ?? null,
        }),

      setStudentId: (studentId) => set({ studentId }),

      setTeacherId: (teacherId) => set({ teacherId }),

      clear: () =>
        set({
          accountId: null,
          role: null,
          email: null,
          fullName: null,
          username: null,
          avatarUrl: null,
          studentId: null,
          teacherId: null,
        }),

      // Getters
      isAuthenticated: () => !!get().accountId,

      isStudent: () => {
        const state = get();
        return state.role === "STUDENT" && !!state.studentId;
      },

      isTeacher: () => {
        const state = get();
        return state.role === "TEACHER" && !!state.teacherId;
      },

      isAdmin: () => {
        const state = get();
        return state.role === "ADMIN";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accountId: state.accountId,
        role: state.role,
        email: state.email,
        fullName: state.fullName,
        username: state.username,
        avatarUrl: state.avatarUrl,
        studentId: state.studentId,
        teacherId: state.teacherId,
      }),
    }
  )
);


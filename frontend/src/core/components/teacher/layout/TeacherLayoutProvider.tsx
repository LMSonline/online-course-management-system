"use client";

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";

interface TeacherLayoutContextType {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    setIsCollapsed: (value: boolean) => void;
    setIsMobileOpen: (value: boolean) => void;
    toggleCollapsed: () => void;
    openMobile: () => void;
    closeMobile: () => void;
}

const TeacherLayoutContext = createContext<TeacherLayoutContextType | undefined>(undefined);

export function TeacherLayoutProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => setIsCollapsed((prev) => !prev), []);
    const openMobile = useCallback(() => setIsMobileOpen(true), []);
    const closeMobile = useCallback(() => setIsMobileOpen(false), []);

    const value = useMemo(() => ({
        isCollapsed,
        isMobileOpen,
        setIsCollapsed,
        setIsMobileOpen,
        toggleCollapsed,
        openMobile,
        closeMobile,
    }), [isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile]);

    return (
        <TeacherLayoutContext.Provider value={value}>
            {children}
        </TeacherLayoutContext.Provider>
    );
}

export function useTeacherLayout() {
    const context = useContext(TeacherLayoutContext);
    if (!context) {
        throw new Error("useTeacherLayout must be used within TeacherLayoutProvider");
    }
    return context;
}

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AdminContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AdminContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}

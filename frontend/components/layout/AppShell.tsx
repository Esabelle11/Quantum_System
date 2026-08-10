
// frontend/components/layout/AppShell.tsx

"use client";

import {
  useState,
  type ReactNode
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppShellProps {
  children: ReactNode;

  title?: string;

  description?: string;
}

export default function AppShell({
  children,
  title,
  description,
}: AppShellProps) {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen
  ] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        mobileOpen={
          mobileSidebarOpen
        }
        onClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      <div className="lg:pl-64">
        <Topbar
          title={title}
          description={description}
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}


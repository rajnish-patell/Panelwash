"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check on the login page itself
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true); // Don't gate the login page
      return;
    }

    // Check if user has a valid admin session
    fetch("/api/admin/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        router.replace("/admin/login");
      });
  }, [isLoginPage, router]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-solar-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-solar-yellow border-t-transparent animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Verifying access...</span>
        </div>
      </div>
    );
  }

  // Not authenticated and not login page — will redirect
  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="min-h-screen bg-solar-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

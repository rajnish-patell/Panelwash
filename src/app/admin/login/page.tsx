"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid password. Access denied.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-solar-dark flex items-center justify-center px-4">
      {/* Background glow effects */}
      <div className="fixed top-[20%] left-[30%] w-[400px] h-[400px] bg-solar-yellow/5 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-solar-bright/5 rounded-full filter blur-[150px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-black text-white hover:text-solar-yellow transition-all cursor-pointer">
              PANEL<span className="text-solar-yellow">WASH</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-semibold">
            Admin Control Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl glassmorphism border border-solar-border">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-solar-yellow/10 border border-solar-yellow/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-solar-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-1">Admin Access</h2>
          <p className="text-xs text-gray-400 text-center mb-6">
            Enter your admin password to access the dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="admin-password" className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl bg-solar-deep/60 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow focus:ring-1 focus:ring-solar-yellow/30 transition-all placeholder:text-gray-600"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 bg-gradient-sun text-solar-deep font-extrabold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Unlock Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-all">
            ← Back to PanelWash Website
          </Link>
        </div>
      </div>
    </div>
  );
}

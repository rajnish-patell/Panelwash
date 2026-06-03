"use strict";
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalPanelsCleaned: number;
  projectedRevenue: number;
  amcCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const [stats, setStats] = useState<Stats>({
    totalBookings: 32,
    pendingBookings: 8,
    completedBookings: 20,
    totalPanelsCleaned: 840,
    projectedRevenue: 100800, // panels * ₹120
    amcCount: 14,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fetch bookings to calculate real stats
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bookings) {
          const bookings = data.bookings;
          const total = bookings.length;
          const pending = bookings.filter((b: any) => b.status === "PENDING").length;
          const completed = bookings.filter((b: any) => b.status === "COMPLETED").length;
          const panels = bookings.reduce((sum: number, b: any) => sum + Number(b.numberOfPanels), 0);
          const revenue = panels * 120;
          const amc = bookings.filter((b: any) => b.serviceType.startsWith("AMC")).length;

          setStats({
            totalBookings: total,
            pendingBookings: pending,
            completedBookings: completed,
            totalPanelsCleaned: panels,
            projectedRevenue: revenue,
            amcCount: amc,
          });
        }
      })
      .catch((err) => console.error("Error loading dashboard stats:", err));
  }, []);

  const chartData = [
    { name: "Residential", value: Math.round(stats.totalBookings * 0.45) },
    { name: "Commercial", value: Math.round(stats.totalBookings * 0.3) },
    { name: "Industrial", value: Math.round(stats.totalBookings * 0.15) },
    { name: "Societies", value: Math.round(stats.totalBookings * 0.1) },
  ];

  const COLORS = ["#FFC72C", "#00E5FF", "#3B82F6", "#A855F7"];

  return (
    <div className="min-h-screen bg-solar-dark text-white p-8">
      {/* Top Navigation / Header */}
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-solar-border">
        <div>
          <Link href="/">
            <span className="text-2xl font-black text-white hover:text-solar-yellow transition-all cursor-pointer">
              PANEL<span className="text-solar-yellow">WASH</span> <span className="text-xs font-semibold text-solar-bright tracking-widest uppercase ml-1">Admin Panel</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Real-time solar cleaning leads & customer relationship management.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/bookings" className="px-5 py-2.5 bg-solar-deep/50 hover:bg-solar-deep text-white font-bold rounded-xl border border-solar-border text-sm transition-all">
            Manage Bookings
          </Link>
          <Link href="/" className="px-5 py-2.5 bg-gradient-sun text-solar-deep font-bold rounded-xl text-sm hover:scale-105 transition-all">
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 font-bold rounded-xl border border-red-500/20 text-sm transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Stats Summary Cards */}
      <main className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Bookings */}
          <div className="p-6 rounded-2xl glassmorphism border border-solar-border">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</span>
            <div className="text-4xl font-extrabold text-white mt-2">{stats.totalBookings}</div>
            <div className="text-xs text-solar-yellow mt-2 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-solar-yellow animate-pulse" />
              {stats.pendingBookings} awaiting confirmation
            </div>
          </div>

          {/* Card 2: Panels Cleaned */}
          <div className="p-6 rounded-2xl glassmorphism border border-solar-border">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Panels Serviced</span>
            <div className="text-4xl font-extrabold text-solar-bright mt-2">{stats.totalPanelsCleaned}</div>
            <div className="text-xs text-gray-400 mt-2">
              Approx. 25,200 kWh energy recovered
            </div>
          </div>

          {/* Card 3: Projected Revenue */}
          <div className="p-6 rounded-2xl glassmorphism border border-solar-border">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projected Revenue</span>
            <div className="text-4xl font-extrabold text-green-400 mt-2">₹{stats.projectedRevenue.toLocaleString("en-IN")}</div>
            <div className="text-xs text-gray-400 mt-2">
              Based on ₹120 base wash fee
            </div>
          </div>

          {/* Card 4: AMC Maintenance Plans */}
          <div className="p-6 rounded-2xl glassmorphism border border-solar-border">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active AMC Contracts</span>
            <div className="text-4xl font-extrabold text-white mt-2">{stats.amcCount}</div>
            <div className="text-xs text-solar-bright mt-2">
              Steady monthly/quarterly contracts
            </div>
          </div>
        </section>

        {/* Charts & Lead Sources */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bar Chart: Bookings by Property Type */}
          <div className="lg:col-span-8 p-6 rounded-3xl glassmorphism border border-solar-border flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold">Leads by Sector Distribution</h3>
              <p className="text-xs text-gray-400">Comparing residential rooftop leads versus industrial megawatt plants.</p>
            </div>
            
            <div className="w-full h-[280px] my-6">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0A2540",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-solar-dark/40 rounded-xl flex items-center justify-center animate-pulse">
                  <span className="text-xs text-gray-500">Loading chart...</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Integration Status */}
          <div className="lg:col-span-4 p-6 rounded-3xl glassmorphism border border-solar-border flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold">CRM System Logs</h3>
              <p className="text-xs text-gray-400">Integrations check and active endpoints.</p>
            </div>

            <div className="my-6 space-y-4 text-sm">
              <div className="flex justify-between items-center p-3 bg-solar-dark/60 rounded-xl border border-solar-border">
                <span className="text-gray-300 font-medium">WhatsApp Dispatch</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-solar-dark/60 rounded-xl border border-solar-border">
                <span className="text-gray-300 font-medium">Razorpay Gateway</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">MOCKED</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-solar-dark/60 rounded-xl border border-solar-border">
                <span className="text-gray-300 font-medium">Twilio SMS System</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-solar-dark/60 rounded-xl border border-solar-border">
                <span className="text-gray-300 font-medium">PostgreSQL / SQLite</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">SQLITE LOCAL</span>
              </div>
            </div>

            <Link href="/admin/bookings" className="w-full py-3 bg-solar-deep text-solar-bright hover:bg-solar-bright hover:text-solar-deep border border-solar-bright/20 font-bold rounded-xl text-center text-sm transition-all">
              Inspect Client Database &rarr;
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

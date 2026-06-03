"use strict";
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  city: string;
  address: string;
  numberOfPanels: number;
  propertyType: string;
  serviceType: string;
  preferredDate: string;
  notes: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: string, updates: { status?: string; paymentStatus?: string }) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, ...updates } : null));
        }
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobileNumber.includes(searchQuery);

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "APPROVED":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "IN_PROGRESS":
        return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
      case "COMPLETED":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "CANCELLED":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-solar-dark text-white p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-6 border-b border-solar-border">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <span className="text-gray-400 hover:text-white transition-all text-sm font-semibold">&larr; Admin Main</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm font-bold text-solar-yellow">Bookings Database</span>
          </div>
          <h1 className="text-3xl font-black mt-2">Manage Bookings</h1>
        </div>
        
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-solar-deep/50 hover:bg-solar-deep border border-solar-border rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
          </svg>
          Refresh Data
        </button>
      </header>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, city, or phone number..."
            className="w-full px-4 py-3 rounded-xl bg-solar-deep/40 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-solar-deep/40 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved / Scheduled</option>
            <option value="IN_PROGRESS">Washing Panel</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bookings Table */}
        <div className="lg:col-span-8 rounded-2xl glassmorphism border border-solar-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-solar-deep/80 text-gray-400 text-xs border-b border-solar-border">
                <tr>
                  <th className="p-4 font-bold">Customer Details</th>
                  <th className="p-4 font-bold">City</th>
                  <th className="p-4 font-bold text-center">Panels</th>
                  <th className="p-4 font-bold">Preferred Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solar-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Loading bookings list...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No matching bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`hover:bg-solar-deep/30 transition-all cursor-pointer ${
                        selectedBooking?.id === booking.id ? "bg-solar-deep/50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-semibold text-white">{booking.name}</div>
                        <div className="text-xs text-gray-400">{booking.mobileNumber}</div>
                      </td>
                      <td className="p-4 text-gray-300">{booking.city}</td>
                      <td className="p-4 text-center font-bold text-solar-yellow">{booking.numberOfPanels}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(booking.preferredDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold ${booking.paymentStatus === "PAID" ? "text-green-400" : "text-gray-400"}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details / Actions Panel */}
        <div className="lg:col-span-4">
          {selectedBooking ? (
            <div className="p-6 rounded-2xl glassmorphism border border-solar-border space-y-6">
              <div>
                <span className="text-[10px] font-bold text-solar-yellow uppercase tracking-widest">Selected Booking</span>
                <h3 className="text-xl font-bold mt-1 text-white">{selectedBooking.name}</h3>
                <p className="text-xs text-gray-400 mt-1">ID: {selectedBooking.id}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Contact Details</div>
                  <div className="mt-1 text-white">{selectedBooking.mobileNumber}</div>
                  <div className="text-xs text-gray-400">{selectedBooking.email}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 font-semibold">Clean Address</div>
                  <div className="mt-1 text-white text-xs leading-relaxed">{selectedBooking.address}, {selectedBooking.city}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Property Type</div>
                    <div className="mt-1 text-white text-xs">{selectedBooking.propertyType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Service Type</div>
                    <div className="mt-1 text-white text-xs">{selectedBooking.serviceType}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 font-semibold">Special Request Notes</div>
                  <div className="mt-1 p-2.5 rounded-lg bg-solar-dark/80 border border-solar-border text-xs text-gray-300 italic">
                    {selectedBooking.notes || "No special requests mentioned."}
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-solar-border space-y-3">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Update Order Status</div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, { status: "APPROVED" })}
                    className="py-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-300 hover:text-white transition-all"
                  >
                    Approve/Schedule
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, { status: "IN_PROGRESS" })}
                    className="py-2 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 hover:text-white transition-all"
                  >
                    Start Washing
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, { status: "COMPLETED", paymentStatus: "PAID" })}
                    className="py-2 bg-green-600/20 hover:bg-green-600 border border-green-500/30 rounded-xl text-xs font-bold text-green-300 hover:text-white transition-all"
                  >
                    Complete Job
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, { status: "CANCELLED" })}
                    className="py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 hover:text-white transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl glassmorphism border border-solar-border text-center text-gray-500 py-12 text-sm">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Select a customer booking to inspect details, schedule visits, or trigger clean updates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

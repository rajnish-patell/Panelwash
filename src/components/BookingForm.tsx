"use strict";
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  name: string;
  mobileNumber: string;
  email: string;
  city: string;
  address: string;
  numberOfPanels: string;
  propertyType: string;
  serviceType: string;
  preferredDate: string;
  notes: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  mobileNumber: "",
  email: "",
  city: "",
  address: "",
  numberOfPanels: "",
  propertyType: "RESIDENTIAL",
  serviceType: "ONE_TIME",
  preferredDate: "",
  notes: "",
};

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return false;
    }
    if (!formData.mobileNumber.match(/^[6-9]\d{9}$/)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!formData.city.trim()) {
      setErrorMessage("Please enter your city.");
      return false;
    }
    if (!formData.address.trim()) {
      setErrorMessage("Please enter your installation address.");
      return false;
    }
    if (Number(formData.numberOfPanels) <= 0) {
      setErrorMessage("Please specify a valid number of panels.");
      return false;
    }
    if (!formData.preferredDate) {
      setErrorMessage("Please select a preferred date for cleaning.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          numberOfPanels: parseInt(formData.numberOfPanels, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking. Please try again.");
      }

      setStatus("success");
      setFormData(INITIAL_FORM_DATA);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 rounded-3xl glassmorphism border border-solar-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-solar-deep/30 to-solar-dark -z-10" />

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 px-4"
          >
            <div className="w-20 h-20 bg-solar-bright/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-solar-bright/40">
              <svg className="w-10 h-10 text-solar-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Booking Success!</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
              Aapka booking received ho gaya hai. Our cleaning technicians will review details and confirm slot on WhatsApp / Call in 15 minutes.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="px-6 py-2.5 bg-solar-yellow text-solar-deep font-bold rounded-xl hover:bg-white transition-all shadow-md"
            >
              Book Another Service
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block px-2.5 py-1 text-xs font-bold bg-solar-yellow/20 text-solar-yellow rounded-full border border-solar-yellow/30 mb-2">
                Instant Scheduling
              </span>
              <h3 className="text-2xl font-black text-white">Book a Saaf Clean Today</h3>
              <p className="text-xs text-gray-400 mt-1">
                Fill details below. Get free efficiency report & water-quality reading included.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Mobile Number (WhatsApp)</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rajesh@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Gurugram, Gujarat"
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                  required
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                >
                  <option value="RESIDENTIAL">Residential (Villas/Rooftops)</option>
                  <option value="COMMERCIAL">Commercial (Offices/Hospitals)</option>
                  <option value="INDUSTRIAL">Industrial (Factories/Warehouses)</option>
                  <option value="SOCIETY">Housing Society / Apartments</option>
                </select>
              </div>

              {/* Service Plan */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Service Plan</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                >
                  <option value="ONE_TIME">One-Time Clean Wash</option>
                  <option value="AMC_MONTHLY">AMC - Monthly Cleaning</option>
                  <option value="AMC_QUARTERLY">AMC - Quarterly Cleaning</option>
                </select>
              </div>

              {/* Number of Panels */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Number of Solar Panels</label>
                <input
                  type="number"
                  name="numberOfPanels"
                  value={formData.numberOfPanels}
                  onChange={handleChange}
                  placeholder="e.g. 16"
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                  required
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Installation Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Plot No 42, DLF Phase 3, Landmark near Metro station..."
                className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all resize-none"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Special Notes / Requests (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Panels are high on 3rd floor rooftop, safety harness required."
                className="w-full px-4 py-2.5 rounded-xl bg-solar-dark/80 border border-solar-border text-white text-sm focus:outline-none focus:border-solar-yellow transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-gradient-sun hover:bg-none hover:bg-white text-solar-deep font-black rounded-2xl transition-all shadow-lg hover:shadow-solar flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-solar-deep" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing Booking...
                </>
              ) : (
                "Book a Saaf Clean Today"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

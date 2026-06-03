"use strict";
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type DirtLevel = "light" | "medium" | "heavy";

export default function RoiCalculator() {
  const [monthlyBill, setMonthlyBill] = useState<number>(8000);
  const [panelCount, setPanelCount] = useState<number>(16);
  const [dirtLevel, setDirtLevel] = useState<DirtLevel>("medium");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Efficiency loss factor based on dirt level
  const lossFactors = {
    light: 0.15,  // 15% loss
    medium: 0.25, // 25% loss
    heavy: 0.35,  // 35% loss
  };

  const currentLossFactor = lossFactors[dirtLevel];

  // Estimation:
  // Let's assume a typical solar system offsets a portion of their bill.
  // If the panels are dirty, they are losing currentLossFactor % of their generation.
  // Generation loss (in INR) = monthlyBill * currentLossFactor
  const monthlyLoss = Math.round(monthlyBill * currentLossFactor);
  const annualSavings = Math.round(monthlyLoss * 12);
  const cleaningCost = Math.round(panelCount * 120); // Rs 120 per panel wash
  const netFirstYearSavings = Math.max(0, annualSavings - (cleaningCost * 4)); // assuming 4 cleanings a year (quarterly)

  // Generate chart data for 12 months cumulative savings
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Cumulative gross savings
    const gross = monthlyLoss * month;
    // Cumulative cleaning cost (quarterly: months 1, 4, 7, 10)
    const cleans = Math.floor((month - 1) / 3) + 1;
    const cost = cleans * cleaningCost;
    const net = Math.max(0, gross - cost);
    return {
      name: `Month ${month}`,
      "Loss Without Cleaning": gross,
      "Net Savings With PanelWash": net,
    };
  });

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Inputs / Sliders */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl glassmorphism border border-solar-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-solar-deep/20 to-transparent -z-10 rounded-3xl" />

        <div>
          <h3 className="text-2xl font-extrabold text-white mb-6">Calculate Your Bachat</h3>

          {/* Monthly Bill Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-gray-300">Monthly Electricity Bill</span>
              <span className="text-solar-yellow">₹{monthlyBill.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full h-1.5 bg-solar-dark rounded-lg appearance-none cursor-pointer accent-solar-yellow"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>₹2,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Number of Solar Panels Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-gray-300">Number of Solar Panels Installed</span>
              <span className="text-solar-yellow">{panelCount} Panels</span>
            </div>
            <input
              type="range"
              min="4"
              max="150"
              step="2"
              value={panelCount}
              onChange={(e) => setPanelCount(Number(e.target.value))}
              className="w-full h-1.5 bg-solar-dark rounded-lg appearance-none cursor-pointer accent-solar-yellow"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>4 Panels</span>
              <span>75 Panels</span>
              <span>150 Panels</span>
            </div>
          </div>

          {/* Dirt level selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Panel Dust & Pollution Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["light", "medium", "heavy"] as DirtLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDirtLevel(level)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${dirtLevel === level
                    ? "bg-solar-yellow/20 border-solar-yellow text-solar-yellow"
                    : "bg-solar-dark/50 border-solar-border text-gray-400 hover:text-white"
                    }`}
                >
                  {level === "light" && "Halka (15% Loss)"}
                  {level === "medium" && "Medium (25% Loss)"}
                  {level === "heavy" && "Bhaari (35% Loss)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic summary block */}
        <div className="p-4 rounded-2xl bg-solar-dark/80 border border-solar-border mt-4">
          <div className="text-xs text-gray-400">Estimated Annual Net Bachat</div>
          <motion.div
            key={netFirstYearSavings}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-3xl font-black text-solar-bright mt-1"
          >
            ₹{netFirstYearSavings.toLocaleString("en-IN")}
          </motion.div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            After deducting quarterly cleaning charges of ₹{(cleaningCost).toLocaleString("en-IN")} per wash.
          </p>
        </div>
      </div>

      {/* Output / Chart */}
      <div className="lg:col-span-7 sm:p-8 p-4 rounded-3xl glassmorphism border border-solar-border flex flex-col justify-between">
        <div>
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-solar-bright/20 text-solar-bright rounded-full border border-solar-bright/30 mb-3">
            Bachat Analytics
          </span>
          <h4 className="text-xl font-bold text-white mb-2">Suraj Ki Shakti Bachao, Paisa Bachao!</h4>
          <p className="text-sm text-gray-400">
            Compare what you lose due to dust versus the net savings you retain with professional scheduled cleaning.
          </p>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-[240px] my-6">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A2540",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Loss Without Cleaning"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorLoss)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="Net Savings With PanelWash"
                  stroke="#00E5FF"
                  fillOpacity={1}
                  fill="url(#colorSave)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-solar-dark/40 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-xs text-gray-500">Loading charts...</span>
            </div>
          )}
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-solar-border">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Efficiency Loss</div>
            <motion.div
              key={currentLossFactor}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-lg font-bold text-red-400 mt-1"
            >
              -{currentLossFactor * 100}%
            </motion.div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Monthly Wastage</div>
            <motion.div
              key={monthlyLoss}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-lg font-bold text-white mt-1"
            >
              ₹{monthlyLoss.toLocaleString("en-IN")}
            </motion.div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Annual Recovered</div>
            <motion.div
              key={annualSavings}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-lg font-bold text-solar-yellow mt-1"
            >
              ₹{annualSavings.toLocaleString("en-IN")}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

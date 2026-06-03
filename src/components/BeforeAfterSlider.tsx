"use strict";
"use client";

import React, { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { motion } from "framer-motion";

interface ProjectExample {
  id: string;
  title: string;
  location: string;
  efficiencyGain: string;
  dustLevel: string;
}

const PROJECTS: ProjectExample[] = [
  {
    id: "residence-delhi",
    title: "Residential Rooftop - New Delhi",
    location: "Vasant Kunj, New Delhi",
    efficiencyGain: "+28.4%",
    dustLevel: "Extreme (Coal Soot & Dust)",
  },
  {
    id: "factory-gujarat",
    title: "Industrial Solar Plant - Gujarat",
    location: "Morbi, Gujarat",
    efficiencyGain: "+32.1%",
    dustLevel: "High (Ceramic Factory Pollution)",
  },
  {
    id: "society-mumbai",
    title: "Housing Society - Mumbai",
    location: "Goregaon East, Mumbai",
    efficiencyGain: "+24.8%",
    dustLevel: "Medium (Construction Dust & Salt)",
  },
];

export default function BeforeAfterSlider() {
  const [activeProject, setActiveProject] = useState<ProjectExample>(PROJECTS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial width
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 bg-solar-deep/40 p-1.5 rounded-xl border border-solar-border">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            onClick={() => setActiveProject(project)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeProject.id === project.id
                ? "bg-solar-yellow text-solar-deep shadow-md font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {project.title.split(" - ")[0]}
          </button>
        ))}
      </div>

      {/* Main Slider Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className="relative w-full max-w-4xl h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border border-solar-border select-none shadow-2xl cursor-ew-resize"
      >
        {/* AFTER STATE (Clean panel - Deep blue, fully active) - BOTTOM LAYER */}
        <div className="absolute inset-0 w-full h-full bg-[#051124] flex items-center justify-center">
          {/* Procedural Clean Grid */}
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="relative text-center w-full h-full flex flex-col justify-between p-4 sm:p-8">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-solar-bright/20 text-solar-bright font-bold text-xs rounded-full border border-solar-bright/30 backdrop-blur-md">
                AFZAL CLEAN (After PanelWash)
              </span>
              <span className="text-xs sm:text-sm text-gray-400 font-medium">{activeProject.location}</span>
            </div>
            
            {/* Visual representation of clean solar panel */}
            <div className="my-auto max-w-md mx-auto p-4 sm:p-6 rounded-2xl bg-solar-deep/30 border border-solar-bright/20 backdrop-blur-md">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-solar-bright/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-solar-bright/30">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-solar-bright animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5 sm:mb-2">{activeProject.efficiencyGain}</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Suraj Ki Shakti fully restored. Maximum energy absorption!</p>
            </div>
            
            <div className="text-left text-[10px] sm:text-xs text-gray-500">
              *Tested on site using industrial performance analysers.
            </div>
          </div>
        </div>

        {/* BEFORE STATE (Dirty panel - Grey, dusty, bird droppings) - TOP LAYER (CLIPPED) */}
        <div
          className="absolute inset-0 w-full h-full bg-[#20232A] flex items-center justify-center overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          {/* Procedural Dirty Grid */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* simulated brown dirt patches */}
          <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-950/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-amber-950/30 rounded-full filter blur-2xl" />
          <div className="absolute top-1/3 right-10 w-32 h-32 bg-amber-900/10 rounded-full filter blur-xl" />

          <div className="relative text-center w-full h-full flex flex-col justify-between p-4 sm:p-8" style={{ width: containerWidth }}>
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 font-bold text-xs rounded-full border border-red-500/30 backdrop-blur-md">
                DIRTY PANEL (Before Cleaning)
              </span>
            </div>

            {/* Visual representation of dirty solar panel */}
            <div className="my-auto max-w-md mx-auto p-4 sm:p-6 rounded-2xl bg-black/40 border border-amber-900/20 backdrop-blur-md">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-red-500/30">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-gray-400 mb-1.5 sm:mb-2">Up to 30% Loss</h4>
              <p className="text-gray-400 text-xs sm:text-sm">Covered in soot, dust & industrial pollution. {activeProject.dustLevel}</p>
            </div>

            <div className="text-left text-[10px] sm:text-xs text-gray-500">
              Dust blocks the sunlight cells, degrading your ROI.
            </div>
          </div>
        </div>

        {/* Drag Handle Indicator */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 w-1 bg-solar-yellow hover:w-2 active:w-2 transition-all cursor-ew-resize z-20 flex items-center justify-center"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-10 h-10 bg-solar-yellow text-solar-deep rounded-full flex items-center justify-center shadow-lg border border-white/20 select-none">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l-4 4 4 4m8 0l4-4-4-4" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Bottom stats callout */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:flex sm:gap-6 text-center w-full max-w-4xl px-4 justify-center">
        <div>
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Dust Level</div>
          <div className="text-xs sm:text-sm font-bold text-white mt-1">{activeProject.dustLevel.split(" (")[0]}</div>
        </div>
        <div className="hidden sm:block w-px h-8 bg-solar-border" />
        <div>
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Restored Gain</div>
          <div className="text-xs sm:text-sm font-bold text-solar-yellow mt-1">{activeProject.efficiencyGain}</div>
        </div>
        <div className="hidden sm:block w-px h-8 bg-solar-border" />
        <div>
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Cleaning Cycle</div>
          <div className="text-xs sm:text-sm font-bold text-white mt-1">Recommended Monthly</div>
        </div>
      </div>
    </div>
  );
}

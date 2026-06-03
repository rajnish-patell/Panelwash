"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Dynamic import of 3D Scene to prevent SSR errors
const Solar3DScene = dynamic(() => import("@/components/Solar3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-3xl bg-solar-deep/20 border border-solar-border flex flex-col items-center justify-center animate-pulse">
      <div className="w-12 h-12 rounded-full border-4 border-solar-yellow border-t-transparent animate-spin mb-4" />
      <span className="text-sm text-gray-400">Loading 3D Solar Panel Environment...</span>
    </div>
  ),
});

const RoiCalculator = dynamic(() => import("@/components/RoiCalculator"), { ssr: false });
const BeforeAfterSlider = dynamic(() => import("@/components/BeforeAfterSlider"), { ssr: false });
const BookingForm = dynamic(() => import("@/components/BookingForm"), { ssr: false });

// Icons for features
import {
  Shield,
  Droplet,
  Zap,
  Activity,
  UserCheck,
  TrendingUp,
  Clock,
  Flame,
  Award,
  ChevronDown,
} from "lucide-react";

// Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

// Animated Hamburger Icon Component
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-7 h-7 relative flex flex-col items-center justify-center">
    <motion.span
      className="block absolute h-[2.5px] w-6 bg-current rounded-full"
      animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -7 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
    />
    <motion.span
      className="block absolute h-[2.5px] w-6 bg-current rounded-full"
      animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    />
    <motion.span
      className="block absolute h-[2.5px] w-6 bg-current rounded-full"
      animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 7 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
    />
  </div>
);

// Off-canvas menu link animation variants
const menuLinkVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  }),
  exit: { opacity: 0, x: 30, transition: { duration: 0.15 } },
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [whatsappExpanded, setWhatsappExpanded] = useState<boolean>(false);

  // Lock body scroll when off-canvas menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleScrollToBooking = () => {
    const bookingSec = document.getElementById("booking-section");
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-solar-dark text-white selection:bg-solar-yellow selection:text-solar-deep overflow-x-hidden">
      {/* Dynamic Solar Background Glows - clamped for mobile */}
      <div className="fixed top-0 left-0 sm:left-[15%] w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-solar-yellow/5 rounded-full filter blur-[80px] sm:blur-[120px] -z-10 animate-pulse-slow pointer-events-none" />
      <div className="fixed top-[30%] right-0 sm:right-[15%] w-[200px] h-[200px] sm:w-[600px] sm:h-[600px] bg-solar-bright/5 rounded-full filter blur-[80px] sm:blur-[150px] -z-10 pointer-events-none" />

      {/* FLOATING WHATSAPP BUTTON - Mobile: tap to expand, Desktop: vertical pill */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Desktop: always-visible vertical pill link */}
        <a
          href="https://wa.me/918349655888?text=Hi%20PanelWash,%20I%20want%20to%20book%20a%20solar%20panel%20cleaning%20inspection."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex flex-col items-center justify-center w-16 py-4 px-2 bg-[#25D366] text-white rounded-2xl shadow-2xl border border-white/20 gap-2 hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.067 5.348 5.411.004 11.97.004c3.179.002 6.167 1.24 8.416 3.49s3.482 5.242 3.48 8.423c-.004 6.557-5.348 11.9-11.91 11.9-2.004-.001-3.974-.507-5.729-1.472L0 24zm6.59-4.846c1.6.95 3.18 1.448 4.74 1.449 5.418 0 9.827-4.407 9.83-9.825.002-2.624-1.018-5.09-2.871-6.945S14.072 1.097 11.969 1.097c-5.424 0-9.834 4.41-9.838 9.829-.001 1.62.464 3.206 1.346 4.636l-1.019 3.722 3.82-.998z" />
          </svg>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-center leading-tight max-w-[48px]">Chat<br />On<br />WhatsApp</span>
        </a>

        {/* Mobile: tap-to-expand floating button */}
        <div className="md:hidden">
          <AnimatePresence>
            {whatsappExpanded && (
              <motion.a
                href="https://wa.me/918349655888?text=Hi%20PanelWash,%20I%20want%20to%20book%20a%20solar%20panel%20cleaning%20inspection."
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 flex items-center gap-2 bg-[#25D366] text-white rounded-full px-5 py-3 shadow-2xl border border-white/20 whitespace-nowrap text-sm font-bold"
                onClick={() => setWhatsappExpanded(false)}
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.067 5.348 5.411.004 11.97.004c3.179.002 6.167 1.24 8.416 3.49s3.482 5.242 3.48 8.423c-.004 6.557-5.348 11.9-11.91 11.9-2.004-.001-3.974-.507-5.729-1.472L0 24zm6.59-4.846c1.6.95 3.18 1.448 4.74 1.449 5.418 0 9.827-4.407 9.83-9.825.002-2.624-1.018-5.09-2.871-6.945S14.072 1.097 11.969 1.097c-5.424 0-9.834 4.41-9.838 9.829-.001 1.62.464 3.206 1.346 4.636l-1.019 3.722 3.82-.998z" />
                </svg>
                Chat on WhatsApp
              </motion.a>
            )}
          </AnimatePresence>
          <button
            onClick={() => setWhatsappExpanded(!whatsappExpanded)}
            className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl border border-white/20 flex items-center justify-center active:scale-90 transition-transform duration-150"
            aria-label="WhatsApp Chat"
          >
            <motion.svg
              className="w-7 h-7 fill-current"
              viewBox="0 0 24 24"
              animate={{ rotate: whatsappExpanded ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.067 5.348 5.411.004 11.97.004c3.179.002 6.167 1.24 8.416 3.49s3.482 5.242 3.48 8.423c-.004 6.557-5.348 11.9-11.91 11.9-2.004-.001-3.974-.507-5.729-1.472L0 24zm6.59-4.846c1.6.95 3.18 1.448 4.74 1.449 5.418 0 9.827-4.407 9.83-9.825.002-2.624-1.018-5.09-2.871-6.945S14.072 1.097 11.969 1.097c-5.424 0-9.834 4.41-9.838 9.829-.001 1.62.464 3.206 1.346 4.636l-1.019 3.722 3.82-.998z" />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* TOP NAVBAR */}
      <header className="w-full py-4 sm:py-6 px-4 sm:px-12 border-b border-solar-border glassmorphism sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-lg sm:text-2xl font-black text-white hover:text-solar-yellow transition-all cursor-pointer">
              PANEL<span className="text-solar-yellow">WASH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
            <a href="#roi-section" className="hover:text-white transition-all">ROI Calculator</a>
            <a href="#problem-section" className="hover:text-white transition-all">Before & After</a>
            <a href="#services-section" className="hover:text-white transition-all">Our Services</a>
            <a href="#why-us-section" className="hover:text-white transition-all">Why PanelWash</a>
            <a href="#faq-section" className="hover:text-white transition-all">FAQs</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={handleScrollToBooking}
              className="px-5 py-2.5 bg-gradient-sun text-solar-deep text-sm font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Book a Saaf Clean
            </button>
          </div>

          {/* Animated Hamburger Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-2 text-gray-300 hover:text-solar-yellow focus:outline-none transition-colors z-50"
            aria-label="Toggle Menu"
          >
            <HamburgerIcon isOpen={mobileMenuOpen} />
          </button>
        </div>
      </header>

      {/* OFF-CANVAS MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in panel from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 w-[85%] max-w-[360px] h-full z-50 md:hidden flex flex-col"
              style={{
                background: "linear-gradient(180deg, #0A2540 0%, #030D1A 100%)",
              }}
            >
              {/* Off-canvas header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-solar-border/30">
                <span className="text-xl font-black text-white">
                  PANEL<span className="text-solar-yellow">WASH</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close Menu"
                >
                  <HamburgerIcon isOpen={true} />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 flex flex-col px-6 py-8 gap-1 overflow-y-auto">
                {[
                  { href: "#roi-section", label: "ROI Calculator", icon: "📊" },
                  { href: "#problem-section", label: "Before & After", icon: "🔄" },
                  { href: "#services-section", label: "Our Services", icon: "⚡" },
                  { href: "#why-us-section", label: "Why PanelWash", icon: "🛡️" },
                  { href: "#faq-section", label: "FAQs", icon: "❓" },
                ].map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    custom={i}
                    variants={menuLinkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-4 px-4 rounded-xl text-base font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition-all border-b border-solar-border/15"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </motion.a>
                ))}


              </nav>

              {/* Bottom CTA */}
              <motion.div
                custom={6}
                variants={menuLinkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="px-6 pb-8"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(handleScrollToBooking, 300);
                  }}
                  className="w-full py-4 bg-gradient-sun text-solar-deep font-extrabold text-base rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Book a Saaf Clean ☀️
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3">
                  Free inspection & RO water demo
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <motion.section
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
        className="relative min-h-[90vh] flex items-center py-12 px-6 sm:px-12 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          {/* Hero Copy */}
          <motion.div
            variants={staggerContainer}
            className="lg:col-span-6 space-y-6"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-3 py-1 bg-solar-yellow/20 text-solar-yellow font-bold text-xs rounded-full border border-solar-yellow/30 uppercase tracking-widest"
            >
              ⚡ Save Up To 30% Solar Output Loss
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl font-black text-white leading-tight"
            >
              Dirty Panels = Lost Power. <br />
              <span className="text-solar-yellow text-glow-yellow">Restore Your Suraj Ki Shakti.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed"
            >
              Dust, sand, and pollution block sun rays, degrading your solar cell efficiency. Clean panels absorb maximum light to lower your bills. Book our water-purified cleaning wash today.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={handleScrollToBooking}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-sun text-solar-deep font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-solar"
              >
                Book a Saaf Clean Today
              </button>
              <button
                onClick={handleScrollToBooking}
                className="w-full sm:w-auto px-6 py-3.5 bg-solar-deep hover:bg-solar-deep/70 text-white font-extrabold rounded-2xl border border-solar-border transition-all"
              >
                Get Free Inspection
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-solar-border"
            >
              {[
                { icon: UserCheck, text: "Trained Pros", color: "text-solar-yellow" },
                { icon: Droplet, text: "RO Water Clean", color: "text-solar-bright" },
                { icon: Shield, text: "No Chemicals", color: "text-green-400" },
                { icon: Activity, text: "Free Report", color: "text-purple-400" }
              ].map((badge, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="flex items-center gap-2">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="text-xs text-gray-300 font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero 3D Scene */}
          <motion.div
            variants={fadeInRight}
            className="lg:col-span-6 w-full"
          >
            <Solar3DScene />
          </motion.div>
        </div>
      </motion.section>

      {/* ROI CALCULATOR SECTION */}
      <motion.section
        id="roi-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 bg-solar-deep/10 border-t border-b border-solar-border"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-solar-yellow uppercase tracking-widest">Interactive Calculator</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Kitna Paisa Waste Ho Raha Hai?</h2>
            <p className="text-sm text-gray-400 mt-2">
              Use our interactive savings estimator to see how much electricity generation and money you regain with proper cleaning cycles.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <RoiCalculator />
          </motion.div>
        </div>
      </motion.section>

      {/* BEFORE & AFTER SHOWCASE */}
      <motion.section
        id="problem-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 max-w-7xl mx-auto space-y-12"
      >
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-solar-bright uppercase tracking-widest text-glow">Real-Life Case Studies</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Witness the Transformation</h2>
          <p className="text-sm text-gray-400 mt-2">
            Drag the slider to see the difference between panels layered in soot, cement particles, or sand and our chemical-free RO wash finish.
          </p>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <BeforeAfterSlider />
        </motion.div>
      </motion.section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 bg-solar-deep/20 border-t border-b border-solar-border"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Copy info */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-solar-yellow uppercase tracking-widest">Science of Dust</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Why Simple Water Spraying Fails</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Standard pipe water has high TDS (Total Dissolved Solids). When you spray local borewell water, it evaporates and leaves a hard, white scaling layer on the panels, making them even worse!
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              PanelWash uses custom trailer-mounted industrial RO water systems (TDS &lt; 10 ppm) with soft micro-fiber rotating solar brushes to dissolve soot, cement dust, and bird droppings safely without scratching the tempered solar glass.
            </p>
            <div className="flex gap-4">
              <div className="p-4 rounded-xl bg-solar-dark/80 border border-solar-border flex-1">
                <span className="text-xs text-gray-400 font-bold">Rain Water Cleaning?</span>
                <p className="text-xs text-solar-yellow mt-1">Myth. Rainwater is polluted and creates muddy spots, cement scale blocks.</p>
              </div>
              <div className="p-4 rounded-xl bg-solar-dark/80 border border-solar-border flex-1">
                <span className="text-xs text-gray-400 font-bold">Standard Chemicals?</span>
                <p className="text-xs text-solar-bright mt-1">Warranty Risk. Harsh soaps erode anti-reflective glass coatings.</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Graphic Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 rounded-2xl glassmorphism border border-red-500/10 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
                ✕
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white">Dirty/Scattered Panels</h4>
                <ul className="text-xs text-gray-400 space-y-2 mt-2">
                  <li>• High TDS scale block formation</li>
                  <li>• Dust hotspots leading to cell burn</li>
                  <li>• 20% to 35% performance loss</li>
                  <li>• Shortens system warranty life</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 rounded-2xl glassmorphism border border-solar-bright/10 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-solar-bright/15 border border-solar-bright/30 flex items-center justify-center text-solar-bright font-bold">
                ✓
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white">PanelWash RO Care</h4>
                <ul className="text-xs text-gray-400 space-y-2 mt-2">
                  <li>• De-mineralized pure water wash</li>
                  <li>• Soft scratch-free polymer brushes</li>
                  <li>• Restores 100% manufacturer rating</li>
                  <li>• Regular AMC reports & telemetry</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SERVICES SECTION */}
      <motion.section
        id="services-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 max-w-7xl mx-auto space-y-12"
      >
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-solar-yellow uppercase tracking-widest">Our Tailored Services</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Comprehensive Wash Plans</h2>
          <p className="text-sm text-gray-400 mt-2">
            No matter the size - from residential rooftops to massive multi-megawatt warehouses - we have specialized systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "Residential Cleaning",
              desc: "Perfect for villas, homes, and society penthouses. Safely reaches high roofs to clean panels with mineral-free water.",
              btn: "Book Home Wash →",
              color: "text-solar-yellow",
              bgColor: "bg-solar-yellow/20",
              borderColor: "border-solar-yellow/30"
            },
            {
              icon: Shield,
              title: "Commercial Cleaning",
              desc: "Tailored for IT parks, malls, hospitals, and schools. We schedule operations off-hours so business isn't interrupted.",
              btn: "Get Commercial Quote →",
              color: "text-solar-bright",
              bgColor: "bg-solar-bright/20",
              borderColor: "border-solar-bright/30"
            },
            {
              icon: Activity,
              title: "Industrial Megawatt",
              desc: "For manufacturing plants, factories, and airports. Harnesses safety compliance, heavy trailers, and high-efficiency brushes.",
              btn: "Get Industrial Quote →",
              color: "text-purple-400",
              bgColor: "bg-purple-500/20",
              borderColor: "border-purple-500/30"
            },
            {
              icon: Clock,
              title: "AMC Maintenance",
              desc: "Scheduled monthly or quarterly cleaning visits. Includes pre/post efficiency telemetry reports and Priority WhatsApp support.",
              btn: "Subscribe AMC →",
              color: "text-green-400",
              bgColor: "bg-green-500/20",
              borderColor: "border-green-500/30"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-6 rounded-2xl glassmorphism border border-solar-border hover:border-solar-bright/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 ${service.bgColor} rounded-xl border ${service.borderColor} flex items-center justify-center mb-6`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {service.desc}
                </p>
              </div>
              <button onClick={handleScrollToBooking} className={`text-xs font-bold ${service.color} hover:underline text-left`}>
                {service.btn}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* WHY CHOOSE PANELWASH */}
      <motion.section
        id="why-us-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 bg-solar-deep/10 border-t border-b border-solar-border"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-solar-yellow uppercase tracking-widest">Why PanelWash</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">High Standards, Maximum Yield</h2>
            <p className="text-sm text-gray-400 mt-2">
              Our methods are designed and aligned with solar panel manufacturer warranties. No damage, just pure output.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: UserCheck, title: "Certified Technicians", desc: "Engineers trained for high altitude rooftop safety and delicate electrical checks.", color: "text-solar-yellow" },
              { icon: Droplet, title: "RO Water Tech", desc: "Custom pure RO water trailer-mounted tanks to eliminate scaling and hard-water deposits.", color: "text-solar-bright" },
              { icon: Shield, title: "No Chemicals", desc: "Zero acids or detergents. Protects the glass, the environment, and structural paint.", color: "text-green-400" },
              { icon: Activity, title: "Efficiency Reports", desc: "Detailed before/after smart electrical analysis reports demonstrating generation increase.", color: "text-purple-400" }
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl glassmorphism border border-solar-border hover:border-solar-yellow/30 transition-all"
              >
                <card.icon className={`w-8 h-8 ${card.color} mb-4`} />
                <h4 className="text-base font-bold text-white">{card.title}</h4>
                <p className="text-xs text-gray-400 mt-2">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 max-w-7xl mx-auto space-y-12"
      >
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-solar-bright uppercase tracking-widest text-glow">Simplicity in 4 Steps</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">How PanelWash Works</h2>
          <p className="text-sm text-gray-400 mt-2">
            A seamless experience from booking to verified generation recovery reports.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line for larger screens */}
          <div className="hidden md:block absolute top-16 left-16 right-16 h-0.5 bg-solar-border -z-10" />

          {[
            { step: "1", title: "Book Online", desc: "Fill out our simple form with your city, panel count, and preferred date slot.", border: "border-solar-yellow", color: "text-solar-yellow" },
            { step: "2", title: "Site Inspection", desc: "Our technicians visit to analyze angle, structure safety, and check panel temperatures.", border: "border-solar-bright", color: "text-solar-bright" },
            { step: "3", title: "Pro RO Wash", desc: "Gentle washing using trailer-mounted demineralized water and specialized micro-fiber scrubbers.", border: "border-purple-400", color: "text-purple-400" },
            { step: "4", title: "Bachat Report", desc: "Receive a customized report showing pre/post electrical parameters and generation recovery.", border: "border-green-400", color: "text-green-400" }
          ].map((item, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center space-y-4">
              <div className={`w-16 h-16 bg-solar-dark border-2 ${item.border} rounded-full flex items-center justify-center ${item.color} font-black text-xl mx-auto shadow-lg`}>
                {item.step}
              </div>
              <h4 className="text-lg font-bold text-white">{item.title}</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CUSTOMER TESTIMONIALS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 bg-solar-deep/20 border-t border-b border-solar-border"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-solar-yellow uppercase tracking-widest">Happy Customers</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">What Solar Owners Say</h2>
            <p className="text-sm text-gray-400 mt-2">
              Hear from homeowners and business managers who restored their Suraj Ki Shakti.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { init: "VK", name: "Vikram Kulkarni", role: "Homeowner, Pune", text: "Mere rooftop systems pe borewell water se solid scale blocks ban gaye the. Output dropped by 30%. PanelWash team did an amazing job using RO water. Bachat start ho gayi!", color: "text-solar-yellow", bg: "bg-solar-yellow/20" },
              { init: "AM", name: "Anand Mehta", role: "Plant Manager, Gujarat", text: "We have a 120kW system at our factory in Morbi. Due to local ceramic dust, generation was very low. We subscribed to PanelWash AMC plan, monthly cleaning is super reliable.", color: "text-solar-bright", bg: "bg-solar-bright/20" },
              { init: "RS", name: "Rohan Sharma", role: "Villa Owner, Gurugram", text: "Professional team. They brought their own harness safety lines, RO trailers, and left no residue behind. Best solar service in Delhi NCR region.", color: "text-purple-400", bg: "bg-purple-500/20" }
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl glassmorphism border border-solar-border flex flex-col justify-between hover:border-solar-bright/30 transition-all"
              >
                <div>
                  <div className="text-solar-yellow text-lg mb-4">★★★★★</div>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center ${t.color} font-bold`}>
                    {t.init}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t.name}</h4>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section
        id="faq-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 max-w-4xl mx-auto space-y-12"
      >
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-solar-bright uppercase tracking-widest text-glow">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-400 mt-2">
            Clear your doubts about solar washing cycles and warranty safety.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          {[
            {
              q: "Can I clean solar panels using standard borewell tap water?",
              a: "No! Tap or borewell water has high TDS, which leaves minerals, salts, and white scales on panels. This creates hard crust layers that reduce sunlight absorption and damage anti-reflective coatings. We use mineral-free RO water below 10ppm TDS.",
            },
            {
              q: "How often should solar panels be cleaned in India?",
              a: "Due to high dust levels, vehicular soot, and pollution in India, cleaning panels every 3 to 4 weeks is highly recommended to prevent efficiency drops. Commercial plants usually clean bi-weekly.",
            },
            {
              q: "Will cleaning void my solar panel manufacturer warranty?",
              a: "Absolutely not. We follow strict warranty guidelines: we use chemical-free RO water, soft non-scratching polymer brushes, and never wash hot panels during mid-day (to prevent thermal shock cracks). We clean early morning or evening.",
            },
            {
              q: "Is there any danger of electrical shock during wash?",
              a: "Our technicians check cables and MC4 connectors for wear before starting. Demineralized RO water is also a very poor conductor compared to tap water, but we practice safety standards with insulated handles and gear.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-solar-border bg-solar-deep/10 overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-solar-deep/20 transition-all"
              >
                <span className="font-semibold text-sm sm:text-base text-white">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-solar-yellow transition-all ${openFaq === idx ? "rotate-185" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-solar-border/50">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* BOOKING SYSTEM SECTION */}
      <motion.section
        id="booking-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-16 md:py-24 px-4 sm:px-12 bg-gradient-to-b from-solar-dark to-solar-deep/30 border-t border-solar-border"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-solar-yellow uppercase tracking-widest">Schedule Slot</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Let's Clean Your Panels</h2>
            <p className="text-sm text-gray-400 mt-2">
              Fill in your contact and installation details to request slots. Free quote and RO testing on-site!
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <BookingForm />
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-16 px-6 sm:px-12 bg-solar-dark border-t border-solar-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Details */}
          <div className="space-y-4">
            <span className="text-2xl font-black text-white">
              PANEL<span className="text-solar-yellow">WASH</span>
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Premium water-purified solar panel cleaning services. Maximizing India's rooftop solar energy efficiency.
            </p>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} PanelWash India. All Rights Reserved.
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Service Cities</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li>Delhi NCR (Gurugram, Noida)</li>
              <li>Gujarat (Ahmedabad, Morbi, Surat)</li>
              <li>Maharashtra (Mumbai, Pune)</li>
              <li>Karnataka (Bengaluru)</li>
              <li>Telangana (Hyderabad)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li>📍 119, Avighar apartment, Goyal Nagar, Indore</li>
              <li>📞 Phone: +91 8349655888</li>
              <li>✉ Email: support@panelwash.in</li>
              <li>💬 WhatsApp: +91 8349655888</li>
            </ul>
          </div>

          {/* Social and Legals */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company Details</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li><a href="#roi-section" className="hover:underline">Bachat Calculator</a></li>
              <li><a href="#services-section" className="hover:underline">AMC Contracts</a></li>

              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

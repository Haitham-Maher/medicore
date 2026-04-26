"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import DevTeam from "@/components/landing/Team";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020c10] text-foreground selection:bg-emerald-500/30 overflow-x-hidden font-sans scroll-smooth" dir="rtl">

      {/* Emerald Radial Glow — light: soft mint / dark: strong emerald */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dots Grid */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Glow blob */}
        <div className="absolute -bottom-32 -left-32 w-[700px] h-[700px] rounded-full
          bg-emerald-100 dark:bg-emerald-500/10
          blur-[120px] opacity-70 dark:opacity-40" />
        <div className="absolute top-0 left-0 w-[500px] h-[400px] rounded-full
          bg-emerald-50 dark:bg-transparent
          blur-[80px] opacity-60" />
      </div>

      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section Component */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Footer / Features could be added here later */}
      <DevTeam />
      <Footer />
    </div>
  );
}

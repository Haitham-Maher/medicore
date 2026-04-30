"use client";

import { Activity, Menu } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion, animate } from "framer-motion";

export function Navbar() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    
    if (elem) {
      const targetPosition = elem.getBoundingClientRect().top + window.scrollY;
      
      // انيميشن مخصص للتمرير (سرعة وتحكم أكبر)
      animate(window.scrollY, targetPosition, {
        duration: 1.2, // مدة الانتقال (اجعلها أكبر ليكون أبطأ وأنعيم)
        ease: [0.22, 1, 0.36, 1], // منحنى انسيابي احترافي
        onUpdate: (value) => window.scrollTo(0, value),
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#020c10]/80 backdrop-blur-md px-6 py-4" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="size-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">ميدي كور</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "الرئيسية", href: "#hero" },
            { name: "المميزات", href: "#features" },
            { name: "الفريق", href: "#team" },
            { name: "تواصل معنا", href: "#contact" }
          ].map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={(e) => handleScroll(e, item.href)}
              className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/auth" className="hidden sm:block text-sm font-bold text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white transition-colors border-1 border-gray-100 dark:border-white/20 px-7 py-2.5 rounded-xl hover:border-emerald-400 dark:hover:border-white/50">
            تسجيل الدخول
          </Link>
          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

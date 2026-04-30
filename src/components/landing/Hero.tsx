"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrbVisual } from "./OrbVisual";

export function Hero() {
  return (
    <section id="hero" className="relative pt-22 pb-20 px-6 max-w-7xl mx-auto lg:min-h-screen lg:flex lg:items-center lg:justify-between" dir="rtl">
        
        {/* Right Content */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6 text-foreground">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">منصة إدارة النقاط الطبية الذكية</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.2] mb-6 text-gray-900 dark:text-white">
            منصة ذكية لإدارة <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
              النقاط الطبية
            </span> <br />
            المتكاملة
          </h1>

          <p className="text-lg text-gray-500 dark:text-slate-400 leading-relaxed mb-10 max-w-lg">
            أدِر النقاط الطبية، الأطباء، الأقسام، ومخزون الأدوية من لوحة تحكم واحدة قوية وبسيطة. صُممت خصيصاً للمؤسسات الصحية الحديثة.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/auth?view=register" className="bg-emerald-500 hover:bg-emerald-600 dark:text-gray-900 text-white/90 font-black px-8 py-4 rounded-xl transition-all flex items-center gap-2 group shadow-xl shadow-emerald-500/20">
              ابدأ رحلتك الآن <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-slate-200">
              عرض تجريبي (Demo)
            </button>
          </div>

          <div className="mt-8 flex items-center gap-8 text-gray-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] sm:text-xs font-bold">إدارة نقاط متعددة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] sm:text-xs font-bold">تتبع لحظي للمخزون</span>
            </div>
          </div>
        </motion.div>

        {/* Left Visual Component */}
        <OrbVisual />

    </section>
  );
}

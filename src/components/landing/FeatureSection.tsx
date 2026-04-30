"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface FeatureSectionProps {
  badgeLabel: string;
  badgeIcon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean; // خاصية لتبديل مكان النص والصورة
}

export function FeatureSection({
  badgeLabel,
  badgeIcon,
  title,
  description,
  bullets,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <div className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? "lg:flex-row-reverse" : ""}`} dir="rtl">

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`space-y-6 ${reverse ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
          <span className="text-emerald-500">{badgeIcon}</span>
          <span className="text-xs font-bold text-emerald-500">{badgeLabel}</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
          {title}
        </h3>

        <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-lg">
          {description}
        </p>

        <ul className="grid sm:grid-cols-2 gap-4">
          {bullets.map((bullet, i) => (
            <motion.li
              key={bullet}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 text-sm font-semibold text-gray-700 dark:text-slate-300"
            >
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
              {bullet}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Image Content with Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: reverse ? -5 : 5 }}
        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`relative group perspective-[1000px] ${reverse ? "lg:order-1" : "lg:order-2"}`}
      >
        {/* Glow - slightly wider to peek from behind the frame */}
        <div className="absolute -inset-6 bg-emerald-500/10 blur-[80px] rounded-[4rem] opacity-70 dark:opacity-40" />
        
        {/* The Frame Container */}
        <div className="relative p-2 sm:p-4 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-4xl shadow-xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-white/10">
          
          {/* Inner Image Container */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#020c10]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1400}
              height={900}
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              priority={true}
            />
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
          </div>

        </div>
      </motion.div>
    </div>
  );
}

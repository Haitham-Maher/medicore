"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Building2, LayoutDashboard, Stethoscope, User } from "lucide-react";
import BodyRole from "./bodyRole";

const roles = [
  {
    id: "Super Admin",
    label: "مدير النظام",
    icon: Shield,
    activeColor: "#8b5cf6",
  },
  {
    id: "point-manager",
    label: "مدير النقطة",
    icon: Building2,
    activeColor: "#00b894",
  },
  {
    id: "dept-manager",
    label: "مدير القسم",
    icon: LayoutDashboard,
    activeColor: "#0984e3",
  },
  {
    id: "doctor",
    label: "الطبيب",
    icon: Stethoscope,
    activeColor: "#10b981",
  },
  {
    id: "patient",
    label: "المريض",
    icon: User,
    activeColor: "#ff1e56",
  },
];

export default function RoleHeader() {
  const [activeTab, setActiveTab] = useState("Super Admin");

  return (
    <div className="flex flex-col items-center text-center px-6 pt-20 pb-10" dir="rtl">
      {/* Badge - animate triggers only once on mount */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold mb-8"
      >
        <ShieldCheck size={16} />
        <span>نظام الصلاحيات الذكي</span>
      </motion.div>

      {/* Main Title - animate triggers only once on mount */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-6xl font-black text-[hsl(var(--foreground))] leading-tight mb-6 max-w-4xl"
      >
        صلاحية مختلفة لكل <span className="text-emerald-500">دور في المنظومة</span>
      </motion.h2>

      {/* Description - Static animation on mount */}
      <div className="min-h-[100px] flex items-center justify-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl max-w-3xl leading-relaxed"
        >
          كل مستخدم يرى ما يحتاجه فقط — نظام صلاحيات بسيط، دقيق، يضمن الأمان ويسهّل العمل لكل فريق دون تعقيد.
        </motion.p>
      </div>

      {/* Roles Tabs - animate triggers only once on mount */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {roles.map((role) => {
          const isActive = activeTab === role.id;

          return (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              style={{
                backgroundColor: isActive ? role.activeColor : "transparent",
                borderColor: isActive ? role.activeColor : "hsl(var(--border))",
                boxShadow: isActive ? `0 0 20px ${role.activeColor}44` : "none"
              }}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-full border transition-all duration-300 group cursor-pointer
                ${isActive
                  ? "text-white scale-105"
                  : "bg-[hsl(var(--secondary)/0.5)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
                }`}
            >
              <span className="text-lg font-bold">{role.label}</span>
              <role.icon
                size={20}
                className={`${isActive ? "text-white" : "text-emerald-500 group-hover:scale-110 transition-transform"}`}
              />
            </button>
          );
        })}
      </motion.div>

      <BodyRole activeTab={activeTab} />
    </div>
  );
}

"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Shield, Building2, LayoutDashboard, Stethoscope, User,
  Settings, Package, Users, Calendar, CheckCircle2, Lock
} from "lucide-react";

interface Permission {
  label: string;
  icon: any;
  locked?: boolean;
}

interface RoleDetails {
  id: string;
  title: string;
  badge: string;
  icon: any;
  color: string;
  summary: string;
  permissions: Permission[];
}

const roleDetails: Record<string, RoleDetails> = {
  "Super Admin": {
    id: "Super Admin",
    title: "مدير النظام",
    badge: "Super Admin",
    icon: Shield,
    color: "#8b5cf6",
    summary: "تحكم كامل بجميع النقاط، المستخدمين، والمستودع المركزي. وصول لجميع التقارير والإعدادات.",
    permissions: [
      { label: "المستودع والأدوية", icon: Package, locked: false },
      { label: "إدارة الفروع والعيادات", icon: Building2, locked: false },
      { label: "إعدادات النظام", icon: Settings, locked: false },
      { label: "المواعيد والوصفات", icon: Calendar, locked: false },
      { label: "سجلات المرضى", icon: Users, locked: false },
      { label: "إدارة الكوادر الطبية", icon: Stethoscope, locked: false },
    ],
  },
  "point-manager": {
    id: "point-manager",
    title: "مدير النقطة",
    badge: "Point Manager",
    icon: Building2,
    color: "#00b894",
    summary: "إدارة شاملة لنقطة طبية واحدة بما في ذلك أقسامها، أطبائها، ومخزونها المحلي.",
    permissions: [
      { label: "المستودع والأدوية", icon: Package, locked: false },
      { label: "إدارة الفروع والعيادات", icon: Building2, locked: false },
      { label: "إعدادات النظام", icon: Settings, locked: true },
      { label: "المواعيد والوصفات", icon: Calendar, locked: false },
      { label: "سجلات المرضى", icon: Users, locked: false },
      { label: "إدارة الكوادر الطبية", icon: Stethoscope, locked: false },
    ],
  },
  "dept-manager": {
    id: "dept-manager",
    title: "مدير القسم",
    badge: "Department Head",
    icon: LayoutDashboard,
    color: "#0984e3",
    summary: "الإشراف على العمليات داخل القسم الطبي وتوزيع المهام بين الأطباء لضمان جودة الخدمة.",
    permissions: [
      { label: "المستودع والأدوية", icon: Package, locked: true },
      { label: "إدارة الفروع والعيادات", icon: Building2, locked: true },
      { label: "إعدادات النظام", icon: Settings, locked: true },
      { label: "المواعيد والوصفات", icon: Calendar, locked: false },
      { label: "سجلات المرضى", icon: Users, locked: false },
      { label: "إدارة الكوادر الطبية", icon: Stethoscope, locked: false },
    ],
  },
  "doctor": {
    id: "doctor",
    title: "الطبيب",
    badge: "Medical Doctor",
    icon: Stethoscope,
    color: "#10b981",
    summary: "الوصول إلى سجلات المرضى المباشرة وكتابة الوصفات الطبية وإدارة جدول المواعيد الشخصي.",
    permissions: [
      { label: "المستودع والأدوية", icon: Package, locked: true },
      { label: "إدارة الفروع والعيادات", icon: Building2, locked: true },
      { label: "إعدادات النظام", icon: Settings, locked: true },
      { label: "المواعيد والوصفات", icon: Calendar, locked: false },
      { label: "سجلات المرضى", icon: Users, locked: false },
      { label: "إدارة الكوادر الطبية", icon: Stethoscope, locked: true },
    ],
  },
  "patient": {
    id: "patient",
    title: "المريض",
    badge: "Patient Access",
    icon: User,
    color: "#ff1e56",
    summary: "الوصول الشخصي للنتائج الطبية وحجز المواعيد وتتبع الحالة الصحية بكل خصوصية.",
    permissions: [
      { label: "المستودع والأدوية", icon: Package, locked: true },
      { label: "إدارة الفروع والعيادات", icon: Building2, locked: true },
      { label: "إعدادات النظام", icon: Settings, locked: true },
      { label: "المواعيد والوصفات", icon: Calendar, locked: false },
      { label: "سجلات المرضى", icon: Users, locked: false },
      { label: "إدارة الكوادر الطبية", icon: Stethoscope, locked: true },
    ],
  },
};

export default function BodyRole({ activeTab }: { activeTab: string }) {
  const role = roleDetails[activeTab] ?? roleDetails["patient"];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        onMouseMove={handleMouseMove}
        key={activeTab}
        initial={{ opacity: 0, x: 40, filter: "blur(8px)", }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
        transition={{ duration: .3 }}
        className="group w-full max-w-5xl mx-auto rounded-4xl md:rounded-4xl border overflow-hidden backdrop-blur-sm mt-6 md:mt-10 bg-[hsl(var(--card)/0.5)] shadow-2xl relative"
        dir="rtl"
        style={{ border: `2px solid ${role.color}50` }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[40px] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, transparent 60%)`
            ),
          }}
        />
        <div className="p-6 md:p-10">
          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 text-center md:text-right">
            {/* Role icon box */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="shrink-0 p-3 md:p-4 rounded-2xl bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border))]"
              style={{ color: role.color }}
            >
              <role.icon size={36} className="md:w-[42px] md:h-[42px]" strokeWidth={1.5} />
            </motion.div>

            {/* Content: title + badge + summary */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 mb-3 md:mb-2">
                <h3 className="text-2xl md:text-3xl font-black text-[hsl(var(--foreground))]">{role.title}</h3>
                <span
                  className="text-[10px] md:text-[11px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-md"
                  style={{
                    backgroundColor: `${role.color}22`,
                    color: role.color,
                    border: `1px solid ${role.color}44`,
                  }}
                >
                  {role.badge}
                </span>
              </div>
              <p className="text-[hsl(var(--muted-foreground))] text-base md:text-lg leading-relaxed max-w-2xl">
                {role.summary}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[hsl(var(--border))] w-full mb-8 opacity-50" />

          {/* ── Permissions ────────────────────────────────────── */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6">
              الصلاحيات ومستوى الوصول:
            </h4>

            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
              {role.permissions.map((perm, idx) => (
                <motion.div
                  key={perm.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-colors duration-200 snap-center shrink-0 w-[85%] sm:w-full
                    ${perm.locked
                      ? "bg-[hsl(var(--secondary)/0.2)] border-[hsl(var(--border))] opacity-50"
                      : "bg-[hsl(var(--secondary)/0.5)] border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary)/0.8)]"
                    }`}
                >
                  {/* Left: check or lock */}
                  {perm.locked
                    ? <Lock size={17} className="text-[hsl(var(--muted-foreground))] shrink-0" />
                    : <CheckCircle2 size={17} className="shrink-0" style={{ color: role.color }} />
                  }

                  {/* Center: label */}
                  <span className={`flex-1 text-center font-semibold text-sm ${perm.locked ? "text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--foreground))]"}`}>
                    {perm.label}
                  </span>

                  {/* Right: icon box */}
                  <div
                    className="shrink-0 p-2 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
                    style={{ color: perm.locked ? "hsl(var(--muted-foreground))" : role.color }}
                  >
                    <perm.icon size={18} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

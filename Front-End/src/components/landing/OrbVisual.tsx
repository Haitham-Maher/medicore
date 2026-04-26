"use client";

import { motion } from "framer-motion";
import { Pill, Users, Building2, RefreshCw, ArrowUpRight, CheckCircle2 } from "lucide-react";



// ─── Main Component ───────────────────────────────────────────────────────────
export function OrbVisual() {
  return (
    <div className="relative ml-10 h-full" dir="rtl">
      {/* خلفية منقطة خفيفة كما في الصورة */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] bg-size-[20px_20px]"></div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ scale: .3, opacity: 0, x: -50 }} // أضفنا y هنا
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            y: [0, -12, 0] // مصفوفة القيم تجعلها تتحرك من نقطة الصفر إلى -15 ثم تعود
          }}
          transition={{
            // إعدادات ظهور البطاقة لأول مرة
            opacity: { duration: 0.7, delay: 0.3 },
            x: { duration: 0.7, delay: 0.3 },
            scale: { duration: 0.7, delay: 0.3 },
            // إعدادات الحركة المستمرة (الأعلى والأسفل)
            y: {
              duration: 2,         // سرعة الحركة (كلما زاد الرقم كانت أهدأ)
              repeat: Infinity,    // تكرار لا نهائي
              ease: "easeInOut",   // حركة ناعمة في البداية والنهاية
            }
          }}
          className="absolute top-0 -left-20 z-20 w-64 p-6 rounded-4xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-xl shadow-black/25"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium opacity-70">الصيدليات النشطة</span>
            <div className="p-2 bg-[hsl(var(--primary)/0.1)] rounded-lg">
              <Pill className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-bold text-[hsl(var(--primary))]">450</h2>
            <div className="flex items-center text-[hsl(var(--success))] text-sm mb-1 font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
        </motion.div>

        {/* 2. البطاقة المركزية الكبرى (حالة النظام) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" bg-[hsl(var(--card))] rounded-[3rem] px-12 py-6 border border-[hsl(var(--border))] shadow-xl h-[80vh]"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold">سلامة النظام</h3>
              <p className="text-[hsl(var(--muted-foreground))]">مراقبة مباشرة</p>
            </div>
            <div className="w-3 h-3 bg-[hsl(var(--success))] rounded-full shadow-[0_0_10px_hsl(var(--success))]"></div>
          </div>

          {/* الرسم البياني الدائري (Gauge) */}
          <div className="relative flex justify-center items-center mb-6">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-[hsl(var(--secondary))]"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray="690"
                initial={{ strokeDashoffset: 690 }}
                animate={{ strokeDashoffset: 690 - (690 * 0.90) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className="text-[hsl(var(--primary))]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <span className="text-6xl font-black">90%</span>
              <span className="text-[hsl(var(--muted-foreground))] font-medium uppercase tracking-widest text-sm">الكفاءة</span>
            </div>
          </div>

          {/* الإحصائيات السفلية (الأطباء والعيادات) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[hsl(var(--secondary)/0.5)] p-6 rounded-2xl border border-[hsl(var(--border))] text-right">
              <div className="flex items-center gap-3 mb-2 opacity-70">
                <Users className="w-5 h-5" />
                <span className="font-medium">الأطباء</span>
              </div>
              <p className="text-3xl font-bold">1240</p>
            </div>
            <div className="bg-[hsl(var(--secondary)/0.5)] p-6 rounded-2xl border border-[hsl(var(--border))] text-right">
              <div className="flex items-center gap-3 mb-2 opacity-70">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">العيادات</span>
              </div>
              <p className="text-3xl font-bold">142</p>
            </div>
          </div>
        </motion.div>

        {/* 3. بطاقة مزامنة النقاط اليومية (عادت للجهة السفلية اليمنى كما في الأصل) */}
        <motion.div
          initial={{ opacity: 0, scale: .3 }}
          animate={{ opacity: 1, y: [0, 12, 0], scale: 1 }}
          transition={{
            opacity: { duration: .7, ease: "easeOut", delay: .3 },
            scale: { duration: .7, ease: "easeOut", delay: .3 },
            y: {
              duration: 2,         // سرعة الحركة (كلما زاد الرقم كانت أهدأ)
              repeat: Infinity,    // تكرار لا نهائي
              ease: "easeInOut",  // حركة ناعمة في البداية والنهاية
            }
          }}
          className="absolute bottom-10 -right-53 z-20 w-70 p-6 rounded-4xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[hsl(var(--success)/0.1)] rounded-full">
              <CheckCircle2 className="w-6 h-6 text-[hsl(var(--success))]" />
            </div>
            <div>
              <h4 className="font-bold">مزامنة النقاط اليومية</h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">تم التحديث الآن</p>
            </div>
          </div>

          {/* مخطط أعمدة بسيط */}
          <div className="flex items-end gap-2 h-16 justify-between px-2 flex-row-reverse">
            {[40, 60, 45, 80, 50, 70, 90, 65].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="w-full rounded-t-md bg-[hsl(var(--primary))]"
              />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

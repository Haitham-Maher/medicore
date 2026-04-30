"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Check, LayoutDashboard, Stethoscope, ClipboardList, User } from "lucide-react";

export function BrandPanel() {
    return (
        <div className="flex flex-col justify-between h-full p-10 xl:p-14 overflow-hidden relative"
            style={{ background: "linear-gradient(145deg, #0d2e28 0%, #0f4035 40%, #0a3530 70%, #072920 100%)" }}>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

            {/* Glow blobs */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

            {/* Logo */}
            <div className="flex items-center gap-2.5 relative z-10 mb-3">
                <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Activity className="size-5 text-emerald-400" />
                </div>
                <span className="font-black text-white text-lg">Medicore</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 space-y-6">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/70 font-medium">
                        منصة طبية موثوقة
                    </span>
                </div>

                {/* ... (باقي الكود هو نفسه) ... */}
                <div>
                    <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
                        أدِر نقاطك الطبية
                    </h2>
                    <p className="text-2xl xl:text-3xl font-black text-emerald-400 leading-tight mt-1">
                        بذكاء وكفاءة
                    </p>
                    <p className="text-sm text-white/50 mt-3 leading-relaxed max-w-xs">
                        نظام متكامل لإدارة النقاط الطبية وتتبع الأطباء والأدوية والأقسام — كل شيء في مكان واحد.
                    </p>
                </div>

                {/* /* Stats */}
                <div className="flex items-center gap-8">
                    {[{ v: "+12 ألف", l: "مريض" }, { v: "+340", l: "طبيب" }, { v: "98٪", l: "وقت التشغيل" }].map(s => (
                        <div key={s.l}>
                            <p className="text-2xl font-black text-white">{s.v}</p>
                            <p className="text-xs text-white/40 mt-0.5">{s.l}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xs">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="size-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">نظرة اليوم</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium">• مباشر</span>
                    </div>
                    {[{ l: "المرضى النشطون", v: "247" }, { l: "المواعيد", v: "83" }, { l: "الأدوية الصادرة", v: "1024" }].map((r, i) => (
                        <div key={r.l} className="flex items-center justify-between py-1.5 border-t border-white/5 first:border-0">
                            <span className="text-xs text-white/40">{r.l}</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1 rounded-full bg-emerald-500/30 overflow-hidden" style={{ width: 60 }}>
                                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${[75, 40, 90][i]}%` }} />
                                </div>
                                <span className="text-xs font-bold text-white">{r.v}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Footer */}
            <p className="text-[10px] text-white/25 relative z-10">© 2026 Medicore · بُني بواسطة الفريق الطبي</p>
        </div>
    );
}

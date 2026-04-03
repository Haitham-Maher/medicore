"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Check, LayoutDashboard, Stethoscope, ClipboardList, User } from "lucide-react";

type AuthView = "login" | "register";

export function BrandPanel({ view }: { view: AuthView }) {
    const isLogin = view === "login";
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

            {/* Middle content */}
            <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
                    className="relative z-10 space-y-6">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                        <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-white/70 font-medium">
                            {isLogin ? "منصة طبية موثوقة" : "انضم إلى شبكتنا الطبية"}
                        </span>
                    </div>

                    {/* ... (باقي الكود هو نفسه) ... */}
                    <div>
                        <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
                            {isLogin ? "أدِر نقاطك الطبية" : "ابدأ رحلتك"}
                        </h2>
                        <p className="text-2xl xl:text-3xl font-black text-emerald-400 leading-tight mt-1">
                            {isLogin ? "بذكاء وكفاءة" : "مع Medicore"}
                        </p>
                        <p className="text-sm text-white/50 mt-3 leading-relaxed max-w-xs">
                            {isLogin
                                ? "نظام متكامل لإدارة النقاط الطبية وتتبع الأطباء والأدوية والأقسام — كل شيء في مكان واحد."
                                : "انضم إلى آلاف المهنيين الصحيين الذين يثقون بـ Medicore لتبسيط عملياتهم اليومية."}
                        </p>
                    </div>

                    {isLogin ? (
                        /* Stats */
                        <div className="flex items-center gap-8">
                            {[{ v: "+١٢ألف", l: "مريض" }, { v: "+٣٤٠", l: "طبيب" }, { v: "٩٨٪", l: "وقت التشغيل" }].map(s => (
                                <div key={s.l}>
                                    <p className="text-2xl font-black text-white">{s.v}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{s.l}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Features */
                        <ul className="space-y-2.5">
                            {["لوحة تحكم لحظية وتحليلات متقدمة", "صلاحيات وصول حسب الدور", "تتبع الدواء والمخزون", "إدارة متعددة الأقسام", "تنبيهات وإشعارات آلية"].map(f => (
                                <li key={f} className="flex items-center gap-2.5">
                                    <div className="size-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                                        <Check className="size-2.5 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-white/60">{f}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {isLogin ? (
                        /* Dashboard card */
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xs">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <LayoutDashboard className="size-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-white">نظرة اليوم</span>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-medium">• مباشر</span>
                            </div>
                            {[{ l: "المرضى النشطون", v: "٢٤٧" }, { l: "المواعيد", v: "٨٣" }, { l: "الأدوية الصادرة", v: "١٬٠٢٤" }].map((r, i) => (
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
                    ) : (
                        /* Testimonial */
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xs">
                            <p className="text-sm text-white/60 leading-relaxed italic">
                                "غيّر Medicore طريقة إدارة عيادتنا. لوحة التحكم ذكية وصلاحيات الفريق تعمل بالضبط كما نحتاج."
                            </p>
                            <div className="flex items-center gap-2.5 mt-3">
                                <div className="size-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs font-black text-emerald-300">د.ر</div>
                                <div>
                                    <p className="text-xs font-bold text-white">د. رانيا حسن</p>
                                    <p className="text-[10px] text-white/40">رئيسة قسم الطب الداخلي</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <p className="text-[10px] text-white/25 relative z-10">© 2026 Medicore · بُني بواسطة الفريق الطبي</p>
        </div>
    );
}

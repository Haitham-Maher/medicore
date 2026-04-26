"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Check, ShieldCheck } from "lucide-react";

interface WelcomeScreenProps {
    userName?: string;
    role?: string;
    onComplete: () => void;
}

export function WelcomeScreen({
    userName = "المستخدم",
    role = "مدير النظام",
    onComplete,
}: WelcomeScreenProps) {
    const [progress, setProgress] = useState(0);
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        const checkTimer = setTimeout(() => setShowCheck(true), 400);
        return () => clearTimeout(checkTimer);
    }, []);

    useEffect(() => {
        if (!showCheck) return;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 300);
                    return 100;
                }
                return prev + 1.4;
            });
        }, 28);
        return () => clearInterval(interval);
    }, [showCheck, onComplete]);

    return (
        <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            dir="rtl"
            style={{ background: "linear-gradient(145deg, #022c22 0%, #064e3b 30%, #065f46 55%, #022c22 100%)" }}
        >
            {/* Dot Grid */}
            <div className="absolute inset-0 opacity-[0.15]"
                style={{ backgroundImage: "radial-gradient(circle, #6ee7b7 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* Glow blobs */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-green-500/15 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-900/20 blur-[100px] pointer-events-none" />

            {/* Geometric lines */}
            <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center text-center px-8 w-full max-w-sm"
            >
                {/* Logo / Header icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="mb-8 p-4 rounded-2xl border border-white/10 shadow-2xl"
                    style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
                >
                    <Activity className="size-9 text-white" />
                </motion.div>

                {/* Check circle */}
                <div className="relative mb-8">
                    {/* Spinning ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 size-20 rounded-full"
                        style={{ border: "2px solid transparent", borderTopColor: "#6ee7b7", borderRightColor: "#10b981" }}
                    />
                    {/* Outer glow ring */}
                    <div className="size-20 rounded-full border border-white/10 flex items-center justify-center"
                        style={{ boxShadow: "0 0 30px rgba(16,185,129,0.3)" }}>
                        <AnimatePresence>
                            {showCheck && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                >
                                    <Check className="size-9 text-white stroke-[2.5px]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Verified badge */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold"
                    style={{ background: "rgba(16,185,129,0.12)", backdropFilter: "blur(8px)" }}
                >
                    <Check className="size-3" /> تم التحقق بنجاح
                </motion.div>

                {/* Name & subtitle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2 mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        أهلاً وسهلاً،<br />
                        <span className="text-emerald-300">{userName}</span>
                    </h1>
                    <p className="text-emerald-200/60 text-sm font-medium">
                        مرحباً بك في لوحة التحكم الكاملة
                    </p>
                </motion.div>

                {/* Role Card — Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.75, type: "spring", stiffness: 180 }}
                    className="w-full mb-10 p-4 rounded-2xl border border-white/10 flex items-center gap-3"
                    style={{ background: "rgba(16,185,129,0.06)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(110,231,183,0.1)" }}
                >
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)" }}>
                        <ShieldCheck className="size-5 text-emerald-300" />
                    </div>
                    <div className="text-right flex-1">
                        <p className="text-white font-black text-sm">{role}</p>
                        <p className="text-emerald-300/50 text-xs">الإدارة العامة • MedPoints</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-[10px] font-bold">نشط</span>
                    </div>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="w-full space-y-2"
                >
                    <div className="flex justify-between items-center text-[11px] px-0.5">
                        <span className="text-emerald-300/60 font-bold">جارٍ التوجيه...</span>
                        <span className="text-emerald-300/60 font-black">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden border border-white/5"
                        style={{ background: "rgba(255,255,255,0.07)" }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #059669, #10b981, #6ee7b7)",
                                boxShadow: "0 0 12px rgba(16,185,129,0.6)",
                            }}
                        />
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-8 text-[10px] tracking-[0.2em] text-white/15 uppercase"
                >
                    MEDICORE • نظام إدارة النقاط الطبية
                </motion.p>
            </motion.div>
        </motion.div>
    );
}
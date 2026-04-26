"use client";

import Link from "next/link";
import { Home, ArrowRight, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function NotFound() {

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center relative">
            {/* Theme Toggle Button - Positioned to match dashboard header (left side in RTL) */}
            <div className="absolute top-4 left-8 z-50">
                <ThemeToggle />
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
            >
                {/* Decorative background glow */}
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />

                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-card border border-border/50 rounded-3xl shadow-xl flex items-center justify-center mb-6 mx-auto group hover:border-primary/30 transition-colors duration-500">
                        <FileQuestion className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4 max-w-md"
            >
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    404
                </h1>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    عذراً، الصفحة غير موجودة
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    يبدو أنك سلكت طريقاً خاطئاً. الصفحة التي تبحث عنها ربما تم نقلها، حذفها، أو أنها لم تكن موجودة من الأساس.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                    <Home size={20} />
                    العودة للرئيسية
                </Link>

                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-2xl font-bold border border-border/50 hover:bg-secondary/80 transition-all duration-300 cursor-pointer"
                >
                    رجوع للوراء
                    <ArrowRight size={20} className="rotate-180 sm:rotate-0" />
                </button>
            </motion.div>

            {/* Subtle background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/4 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
}

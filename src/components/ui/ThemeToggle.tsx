"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return <div className="w-14 h-7 rounded-full bg-muted border border-border" />;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            className="relative w-14 h-7 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
            {/* Track */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                    backgroundColor: isDark ? "#1e1b4b" : "#fde68a",
                    borderColor: isDark ? "#3730a3" : "#fbbf24",
                }}
                style={{ border: "1.5px solid" }}
                transition={{ duration: 0.2 }}
            />

            {/* Knob */}
            <motion.div
                className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full shadow-md flex items-center justify-center z-10"
                animate={{
                    x: isDark ? 0 : 29,
                    backgroundColor: isDark ? "#6366f1" : "#f59e0b",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
                <motion.span
                    key={isDark ? "moon" : "sun"}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-white leading-none flex items-center justify-center"
                >
                    {isDark ? (
                        // Moon
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    ) : (
                        // Sun
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                            <circle cx="12" cy="12" r="4" fill="white" />
                            <line x1="12" y1="2" x2="12" y2="5" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                            <line x1="2" y1="12" x2="5" y2="12" />
                            <line x1="19" y1="12" x2="22" y2="12" />
                            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                        </svg>
                    )}
                </motion.span>
            </motion.div>

            {/* Stars (dark) or rays (light) in track — decorative */}
            <motion.div
                className="absolute inset-0 rounded-full flex items-center pointer-events-none"
                animate={{ opacity: isDark ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {/* small stars */}
                <span className="absolute right-[7px] top-[5px] w-1 h-1 rounded-full bg-white/60" />
                <span className="absolute right-[12px] top-[12px] w-0.5 h-0.5 rounded-full bg-white/40" />
                <span className="absolute right-[6px] bottom-[5px] w-0.5 h-0.5 rounded-full bg-white/50" />
            </motion.div>

            <motion.div
                className="absolute inset-0 rounded-full flex items-center pointer-events-none"
                animate={{ opacity: isDark ? 0 : 1 }}
                transition={{ duration: 0.2 }}
            >
                {/* small clouds suggestion */}
                <span className="absolute left-[7px] top-[7px] w-2 h-1 rounded-full bg-white/50" />
                <span className="absolute left-[6px] bottom-[6px] w-1.5 h-0.5 rounded-full bg-white/40" />
            </motion.div>
        </button>
    );
}

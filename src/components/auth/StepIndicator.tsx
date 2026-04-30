"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export function StepIndicator({ step }: { step: number }) {
    const steps = [1, 2, 3, 4]
    const total = 4;
    const progress = ((step - 1) / (total - 1)) * 100;

    return (
        <div className="mb-7">
            {/* Circles row */}
            <div className="relative flex items-center justify-between">

                {/* Background track */}
                <div className="absolute inset-x-3.5 top-1/2 -translate-y-1/2 h-0.5 bg-border/30 rounded-full" />

                {/* Animated fill */}
                <div className="absolute top-1/2 -translate-y-1/2 h-0.5 rounded-full overflow-hidden" style={{ left: "0.875rem", right: "0.875rem" }}>
                    <motion.div
                        className="h-full bg-emerald-500 origin-left rounded-full -mr-4"
                        initial={false}
                        animate={{ scaleX: progress / 100 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        style={{ width: "100%", transformOrigin: "right" }}
                    />
                </div>

                {/* Step circles */}
                {(steps).map(s => (
                    <motion.div key={s}
                        animate={{
                            scale: s === step ? 1.15 : 1,
                            backgroundColor:
                                s < step ? "hsl(152 76% 42%)" : "transparent",
                            borderColor:
                                s <= step ? "hsl(152 76% 42%)" : "hsl(var(--border))",
                            color:
                                s < step ? "#fff"
                                    : s === step ? "hsl(152 76% 42%)"
                                        : "hsl(var(--muted-foreground))",
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 22 }}
                        className="relative z-10 size-7 rounded-full border-2 flex items-center justify-center text-xs font-black bg-background"
                    >
                        <AnimatePresence mode="wait">
                            {s < step ? (
                                <motion.span key="check"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                    <Check className="size-3.5" />
                                </motion.span>
                            ) : (
                                <motion.span key="num"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                    {s}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmation({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "حذف",
    cancelText = "إلغاء",
    isLoading = false,
}: DeleteConfirmationProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 cursor-default">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-10 "
                    >
                        {/* Header */}
                        <div className="p-6 pb-0 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="text-red-600 dark:text-red-500 w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors absolute top-4 left-4 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 flex items-center justify-end gap-3 mt-4 bg-muted/30">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                            >
                                {isLoading ? "جاري الحذف..." : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

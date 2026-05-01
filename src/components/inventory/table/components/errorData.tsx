"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorDataProps {
    refetch?: () => void;
    message?: string;
}

export default function ErrorData({ refetch, message }: ErrorDataProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center p-8"
        >
            <motion.div
                animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                }}
                className="p-6 rounded-3xl bg-destructive/10 text-destructive shadow-2xl shadow-destructive/20 border border-destructive/20"
            >
                <AlertCircle size={48} />
            </motion.div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-foreground">عذراً، حدث خطأ غير متوقع</h2>
                <p className="text-muted-foreground font-medium max-w-md">
                    {message || "لم نتمكن من جلب البيانات حالياً. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى."}
                </p>
            </div>

            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch?.()}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-colors group cursor-pointer"
            >
                <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                إعادة تحميل البيانات
            </motion.button>
        </motion.div>
    );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";

interface LoginFormProps {
    onSuccess: () => void;
}

const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string[]>>({});


    const loginMutation = useMutation({
        // هذه الدالة هي التي تنفذ الاتصال الفعلي
        mutationFn: async (credentials: z.infer<typeof loginSchema>) => {
            const response = await api.post("/login", credentials);
            return response.data;
        },
        // ماذا نفعل عند نجاح الدخول؟
        onSuccess: (data) => {
            localStorage.setItem("access_token", data.access_token); // تخزين التوكن
            localStorage.setItem("user_role", data.roles[0]); // تخزين الرتبة (Admin مثلاً)
            setSuccess(true);
            setTimeout(() => onSuccess(), 600); // الانتقال للخطوة التالية في الواجهة
        },
        // ماذا نفعل عند فشل الدخول؟
        onError: (error: any) => {
            const serverError = error.response?.data?.message || "البريد أو كلمة المرور غير صحيحة";
            setErrors({ server: [serverError] }); // عرض الخطأ القادم من لارافيل
        }
    });



    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // 1. التأكد من صحة البيانات عبر Zod
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            setErrors(validation.error.flatten().fieldErrors);
            return;
        }

        // 2. تصفير الأخطاء السابقة والبدء في الإرسال الحقيقي
        setErrors({});
        loginMutation.mutate({ email, password });
    }

    return (
        <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">مرحباً بعودتك</h1>
            <p className="text-sm text-muted-foreground mb-7">سجّل دخولك إلى حسابك في Medicore</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* ─── Server Error Display ─── */}
                <AnimatePresence>
                    {errors.server && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
                        >
                            {errors.server[0]}
                        </motion.div>
                    )}
                </AnimatePresence>
                <AuthField
                    label="البريد الإلكتروني"
                    id="lemail"
                    type="email"
                    placeholder="doctor@medicore.app"
                    value={email}
                    onChange={(v) => { setEmail(v); setErrors({ ...errors, email: [] }); }}
                    icon={Mail}
                    error={errors.email?.[0]}
                    disabled={loginMutation.isPending}
                />

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="lpass" className="text-sm font-bold text-foreground/80">كلمة المرور</label>
                    </div>
                    <AuthField
                        label=""
                        id="lpass"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(v) => { setPassword(v); setErrors({ ...errors, password: [] }); }}
                        icon={Lock}
                        error={errors.password?.[0]}
                        disabled={loginMutation.isPending}
                    />
                </div>

                {/* ─── Submit Button ─── */}
                <motion.button
                    type="submit"
                    disabled={loginMutation.isPending || success}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full py-3 rounded-xl font-black text-sm text-white overflow-hidden cursor-pointer disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)" }}
                >
                    {/* Shimmer layer */}
                    {!loginMutation.isPending && !success && (
                        <motion.span
                            className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                        />
                    )}

                    {/* Shadow glow */}
                    <span className="absolute inset-0 rounded-xl shadow-lg shadow-emerald-500/30 pointer-events-none" />

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {loginMutation.isPending && (
                            <motion.span key="loading"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                className="flex items-center justify-center gap-2 relative z-10">
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>جارٍ التحقق...</span>
                            </motion.span>
                        )}
                        {success && !loginMutation.isPending && (
                            <motion.span key="success"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center gap-2 relative z-10">
                                <CheckCircle2 className="size-4" />
                                <span>تم الدخول!</span>
                            </motion.span>
                        )}
                        {!loginMutation.isPending && !success && (
                            <motion.span key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2 relative z-10">
                                <span>تسجيل الدخول</span>
                                <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                                    <ArrowLeft className="size-4" />
                                </motion.span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>


            </form>

            <p className="text-center text-xs text-muted-foreground/40 mt-8">🔒 مشفر 256-bit · متوافق مع معايير HIPAA</p>
        </motion.div>
    );
}

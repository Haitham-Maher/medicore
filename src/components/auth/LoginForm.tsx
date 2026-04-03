"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { z } from "zod";

interface LoginFormProps {
    onSuccess: () => void;
    onSwitch: () => void;
}

const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export function LoginForm({ onSuccess, onSwitch }: LoginFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            setErrors(validation.error.flatten().fieldErrors);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => onSuccess(), 600);
        }, 1300);
    }

    return (
        <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">مرحباً بعودتك</h1>
            <p className="text-sm text-muted-foreground mb-7">سجّل دخولك إلى حسابك في Medicore</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <AuthField
                    label="البريد الإلكتروني"
                    id="lemail"
                    type="email"
                    placeholder="doctor@medicore.app"
                    value={email}
                    onChange={(v) => { setEmail(v); setErrors({ ...errors, email: [] }); }}
                    icon={Mail}
                    error={errors.email?.[0]}
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
                    />
                </div>

                {/* ─── Submit Button ─── */}
                <motion.button
                    type="submit"
                    disabled={loading || success}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full py-3 rounded-xl font-black text-sm text-white overflow-hidden cursor-pointer disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)" }}
                >
                    {/* Shimmer layer */}
                    {!loading && !success && (
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
                        {loading && (
                            <motion.span key="loading"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                className="flex items-center justify-center gap-2 relative z-10">
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>جارٍ التحقق...</span>
                            </motion.span>
                        )}
                        {success && !loading && (
                            <motion.span key="success"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center gap-2 relative z-10">
                                <CheckCircle2 className="size-4" />
                                <span>تم الدخول!</span>
                            </motion.span>
                        )}
                        {!loading && !success && (
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

                <p className="text-center text-sm text-muted-foreground">
                    ليس لديك حساب؟{" "}
                    <button type="button" onClick={onSwitch} className="text-emerald-500 font-bold hover:underline cursor-pointer">
                        أنشئ حساباً الآن
                    </button>
                </p>
            </form>

            <p className="text-center text-xs text-muted-foreground/40 mt-8">🔒 مشفر 256-bit · متوافق مع معايير HIPAA</p>
        </motion.div>
    );
}

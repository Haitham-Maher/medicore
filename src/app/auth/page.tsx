"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Components ──
import { BrandPanel } from "@/components/auth/BrandPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { roles } from "@/components/auth/RoleSelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { WelcomeScreen } from "@/components/auth/wel";

type AuthView = "login" | "register";

export default function AuthPage() {
    const router = useRouter();
    const [view, setView] = useState<AuthView>("login");
    const [done, setDone] = useState(false);
    const [finalRole, setFinalRole] = useState("doctor");

    const roleData = roles.find((r) => r.id === finalRole)!;

    function handleSuccess(roleId?: string) {
        if (roleId) setFinalRole(roleId);
        setDone(true);
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden" dir="rtl">

            {/* Left Branding */}
            <div className="lg:w-[42%] xl:w-[45%] h-full shrink hidden lg:block">
                <BrandPanel view={view} />
            </div>

            {/* Right Side */}
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">

                {/* Navbar (Mobile) */}
                <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-border/30">
                    <div className="flex items-center gap-2 lg:invisible pointer-events-none">
                        <Activity className="size-4 text-emerald-500" />
                        <span className="font-black text-sm text-foreground">Medicore</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {!done && (
                            <button
                                onClick={() => setView(view === "login" ? "register" : "login")}
                                className="text-sm font-bold text-foreground/70 hover:text-foreground border border-border/50 rounded-xl px-4 py-1.5 hover:border-border transition-all cursor-pointer"
                            >
                                {view === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
                    <div className="w-full max-w-md">
                        <AnimatePresence mode="wait">
                            {done ?
                            <WelcomeScreen userName={roleData.label} role={roleData.label} onComplete={() => router.push(roleData.href)} />
                            : view === "login" ? (
                                <LoginForm
                                    onSuccess={() => handleSuccess()}
                                    onSwitch={() => setView("register")}
                                />
                            ) : (
                                <RegisterForm
                                    onSuccess={(id) => handleSuccess(id)}
                                    onSwitch={() => setView("login")}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
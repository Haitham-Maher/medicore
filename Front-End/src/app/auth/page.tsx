"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthSkeleton } from "./loading";

import { BrandPanel } from "@/components/auth/BrandPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { roles } from "@/components/auth/RoleSelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { WelcomeScreen } from "@/components/auth/wel";

export default function AuthPage() {
    const router = useRouter();
    const [done, setDone] = useState(false);
    const [finalRole, setFinalRole] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        // Safe access to localStorage after mounting
        const savedRole = localStorage.getItem("user_role");
        if (savedRole) setFinalRole(savedRole);

        // Artificial delay for Skeleton
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (isInitialLoading) return <AuthSkeleton />;

    // Find role data safely
    const roleData = roles.find((r) => r.id === finalRole);

    function handleSuccess(roleId?: string) {
        const freshlySavedRole = localStorage.getItem("user_role");
        if (freshlySavedRole) {
            // نستخدم toLowerCase() لأن لارافيل يرسلها "Admin" ونحن نريدها "admin"
            setFinalRole(freshlySavedRole.toLowerCase());
        }
        setDone(true);
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden" dir="rtl">

            {/* Left Branding */}
            <div className="lg:w-[42%] xl:w-[45%] h-full shrink hidden lg:block">
                <BrandPanel />
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
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
                    <div className="w-full max-w-md">
                        <AnimatePresence mode="wait">
                            {done ?
                                <WelcomeScreen
                                    userName={roleData?.label || "المستخدم"}
                                    role={roleData?.label || "عضو فريق"}
                                    onComplete={() => {
                                        if (roleData?.href) {
                                            router.push(roleData.href);
                                        } else {
                                            router.push("/"); // Fallback
                                        }
                                    }}
                                />
                                : (
                                    <LoginForm
                                        onSuccess={() => handleSuccess()}
                                    />
                                )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
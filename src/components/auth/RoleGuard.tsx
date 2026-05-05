"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ArrowRight, Lock } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRole: string;
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isDenied, setIsDenied] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const rawRole = localStorage.getItem("user_role");
        const token = localStorage.getItem("access_token");

        if (!token || !rawRole) {
            router.replace("/auth");
            return;
        }

        const normalizedRole = rawRole.toLowerCase();
        const requiredRole = allowedRole.toLowerCase();
        setUserRole(normalizedRole);

        if (normalizedRole !== requiredRole) {
            setIsDenied(true);
            return;
        }

        setIsAuthorized(true);
    }, [allowedRole, router]);

    const dashboardUrls: Record<string, string> = {
        "admin": "/admin/dashboard",
        "manager": "/manager/dashboard",
        "department-head": "/department-head/dashboard",
        "doctor": "/doctor",
        "patient": "/patient"
    };

    const handleGoBack = () => {
        if (userRole && dashboardUrls[userRole]) {
            router.replace(dashboardUrls[userRole]);
        } else {
            router.replace("/auth");
        }
    };

    if (isDenied) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background p-6" dir="rtl">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    {/* Animated Icon Container */}
                    <div className="relative mx-auto w-24 h-24">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl"
                        />
                        <div className="relative bg-card border border-red-500/20 rounded-3xl w-24 h-24 flex items-center justify-center shadow-2xl">
                            <ShieldAlert size={48} className="text-red-500" />
                        </div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-2 -left-2 bg-background border border-border rounded-xl p-2 shadow-lg"
                        >
                            <Lock size={20} className="text-muted-foreground" />
                        </motion.div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-foreground tracking-tight">دخول غير مصرح به!</h1>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            عذراً، يبدو أنك تحاول الوصول إلى منطقة خارج صلاحيات حسابك. 
                            يرجى العودة إلى لوحة التحكم الخاصة بك.
                        </p>
                    </div>

                    <div className="pt-4">
                        <motion.button
                            onClick={handleGoBack}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full py-4 bg-foreground text-background rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(var(--foreground-rgb),0.2)]"
                        >
                            العودة للرئيسية
                            <ArrowRight size={18} className="transition-transform group-hover:-translate-x-1" />
                        </motion.button>
                        
                        <button 
                            onClick={() => { localStorage.clear(); router.replace("/auth"); }}
                            className="mt-4 text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                        >
                            تسجيل الخروج والدخول بحساب آخر
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

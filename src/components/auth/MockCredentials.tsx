"use client";

import { motion } from "framer-motion";
import { Info, Key, User, ShieldCheck, Activity, UserCircle } from "lucide-react";

interface MockCredentialsProps {
    onSelect: (email: string) => void;
}

const credentials = [
    {
        email: "admin.region2@hospital.com",
        role: "admin",
        label: "مدير النظام (Admin)",
        icon: ShieldCheck,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },

    {
        email: "ocrist@example.org",
        role: "manager",
        label: "مدير نقطة (Point Manager)",
        icon: Activity,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },

    {
        email: "scottie08@example.com",
        role: "department_manager",
        label: "رئيس الأقسام (Dept Manager)",
        icon: UserCircle,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },

    {
        email: "laury55@example.org",
        role: "doctor",
        label: "طبيب (Doctor)",
        icon: User,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        email: "hmraz@example.net",
        role: "patient",
        label: "مريض (Patient)",
        icon: User,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

export function MockCredentials({ onSelect }: MockCredentialsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-border/50"
        >
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Info className="size-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">بيانات تجريبية للاختبار</h3>
            </div>

            <div className="grid gap-2">
                {credentials.map((cred) => (
                    <button
                        key={cred.email}
                        onClick={() => onSelect(cred.email)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/50 hover:bg-accent/50 hover:border-accent transition-all group text-right cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${cred.bg} ${cred.color}`}>
                                <cred.icon className="size-4" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-bold text-foreground/80">{cred.label}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">{cred.email}</span>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Key className="size-3 text-muted-foreground" />
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-accent/30 border border-border/50">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Key className="size-3" />
                    <span>كلمة المرور لكل الحسابات: <span className="font-mono font-bold text-foreground">password</span></span>
                </div>
            </div>
        </motion.div>
    );
}

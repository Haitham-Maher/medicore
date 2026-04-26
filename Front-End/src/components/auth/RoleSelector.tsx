"use client";

import { Check, Shield, Stethoscope, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const roles = [
    { id: "admin", label: "مدير النظام", desc: "صلاحية وصول كاملة", icon: Shield, href: "/admin/dashboard" },
    { id: "doctor", label: "طبيب", desc: "إدارة المرضى", icon: Stethoscope, href: "/doctor" },
    { id: "manager", label: "مشرف القسم", desc: "إدارة الأقسام والأطباء", icon: ClipboardList, href: "/manager/dashboard" },
    { id: "patient", label: "مريض", desc: "الملف الطبي والوصفات", icon: User, href: "/patient" },
];

interface RoleSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export function RoleSelector({ selectedId, onSelect }: RoleSelectorProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">اختر الدور الذي يصف وظيفتك:</p>
            <div className="grid grid-cols-2 gap-3">
                {roles.map(r => {
                    const Icon = r.icon;
                    const isActive = selectedId === r.id;
                    return (
                        <button key={r.id} type="button" onClick={() => onSelect(r.id)}
                            className={cn(
                                "flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-right transition-all cursor-pointer relative",
                                isActive
                                    ? "border-emerald-500 bg-emerald-500/8"
                                    : "border-border/40 bg-muted/10 hover:border-border"
                            )}>
                            <div className={cn("size-9 rounded-xl flex  items-center justify-center",
                                isActive ? "bg-emerald-500/20" : "bg-muted/30")}>
                                <Icon className={cn("size-4", isActive ? "text-emerald-400" : "text-muted-foreground")} />
                            </div>
                            <div>
                                <p className={cn("text-sm font-black", isActive ? "text-foreground" : "text-foreground/80")}>{r.label}</p>
                                <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                            </div>
                            {isActive && (
                                <div className="absolute top-2 left-2">
                                    <Check className="size-3 text-emerald-500" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

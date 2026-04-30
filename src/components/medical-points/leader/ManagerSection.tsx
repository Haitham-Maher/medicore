"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
    ShieldCheck,
    UserCheck,
    CreditCard,
    Phone,
    Mail,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import ManagerSectionSkeleton from "../skeletons/ManagerSectionSkeleton";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "next/navigation";

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

export function ManagerSection({
    compact = false,
    isAdmin = true
}: {
    compact?: boolean;
    isAdmin?: boolean;
}) {
    const { id } = useParams();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsDeleting(false);
    };

    const { data: response, isLoading } = useQuery({
        queryKey: ["point-manager", id],
        queryFn: async () => {
            const res = await api.get(`/medical-points/${id}/point-manager`);
            return res.data;
        }
    });

    if (isLoading) return <ManagerSectionSkeleton />;

    const managerData = response;
    const manager = {
        name: managerData?.manager_name || "غير محدد",
        title: isAdmin ? "رئيس النقطة الطبية" : "رئيس القسم",
        idNumber: managerData?.manager_nationalID || "-----------",
        phone: managerData?.manager_phone || "-----------",
        email: managerData?.manager_email || "-----------",
        joinedDate: managerData?.assign_date || "-----------",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
    };

    if (!managerData?.manager_name) {
        return (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 bg-card rounded-3xl border border-dashed border-border/50">
                <UserCheck size={48} className="text-muted-foreground/20" />
                <p className="text-muted-foreground font-bold italic text-sm">لا يوجد مسؤول معين لهذه النقطة حالياً</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: .3 }}
            variants={itemVariants}
            className={cn(
                "bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm relative group",
                compact ? "h-full" : ""
            )}
        >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

            <div className={cn(
                "p-6 flex flex-col gap-8 items-center md:items-start relative ",
                compact ? "h-full" : "md:flex-row"
            )}>
                {/* Manager Image */}
                <div className="relative shrink-0">
                    <div className={cn(
                        "rounded-2xl overflow-hidden border-4 border-background shadow-lg group-hover:rotate-2 transition-transform duration-500",
                        compact ? "w-20 h-20" : "w-28 h-28"
                    )}>
                        <img
                            src={manager.image}
                            alt={manager.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-success text-success-foreground p-1.5 rounded-lg shadow-lg border-2 border-background">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                {/* Manager Info */}
                <div className="flex-1 space-y-4 text-center md:text-right w-full">
                    <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4 sm:w-11/12 mx-auto">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h3 className={cn("font-black text-foreground", compact ? "text-lg" : "text-xl")}>{manager.name}</h3>
                                <UserCheck size={18} className="text-primary hidden md:block" />
                            </div>
                            <p className="text-primary font-bold text-sm tracking-wide">{manager.title}</p>
                        </div>
                        <div className="flex items-center justify-center md:justify-end gap-2">
                            <div className="flex items-center justify-center md:justify-end gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
                                <CreditCard size={16} className="text-muted-foreground" />
                                <span className="text-xs font-mono font-bold text-foreground opacity-80">
                                    {manager.idNumber}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "grid grid-cols-1 items-center gap-4 pt-4 border-t border-border/30",
                        compact ? "sm:grid-cols-1" : "sm:grid-cols-3"
                    )}>
                        <div className="flex items-center gap-3 justify-start sm:justify-start w-9/12 mx-auto">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Phone size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">رقم الجوال</p>
                                <p className="text-xs font-bold text-foreground">{manager.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-start sm:justify-start w-9/12 mx-auto">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Mail size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">البريد الإلكتروني</p>
                                <p className="text-xs font-bold text-foreground">{manager.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-start sm:justify-start w-9/12 mx-auto">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Calendar size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">تاريخ الانضمام</p>
                                <p className="text-xs font-bold text-foreground">{manager.joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

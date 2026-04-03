"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Hospital,
    Package,
    Users,
    ChevronRight,
    LogOut,
    Menu,
    X,
    ClipboardList,
    Stethoscope,
    FileText,
    CalendarDays,
    LayoutDashboard as HomeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardRole = "admin" | "manager" | "department-head" | "doctor" | "patient";

const sidebarItems = [
    { name: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "إدارة النقاط الطبية", href: "/admin/medical-points", icon: Hospital },
    { name: "المخزون المركزي", href: "/admin/inventory", icon: Package },
    { name: "طلبات الإمداد", href: "/admin/reports", icon: ClipboardList },
    { name: "الأطباء", href: "/admin/doctors", icon: Users },
];

const managerSidebarItems = [
    { name: "لوحة التحكم", href: "/manager/dashboard", icon: LayoutDashboard },
    { name: "إدارة الأقسام الطبية", href: "/manager/departments", icon: Hospital },
    { name: "المخزون المركزي", href: "/manager/inventory", icon: Package },
    { name: "طلبات الإمداد", href: "/manager/reports", icon: ClipboardList },
    { name: "الأطباء", href: "/manager/doctors", icon: Users },
];

const deptHeadSidebarItems = [
    { name: "لوحة التحكم", href: "/department-head/dashboard", icon: LayoutDashboard },
    { name: "أطباء القسم", href: "/department-head/doctors", icon: Stethoscope },
    { name: "الوصفات الطبية", href: "/department-head/prescriptions", icon: ClipboardList },
];

const doctorSidebarItems = [
    { name: "الرئيسية",      href: "/doctor",          icon: LayoutDashboard },
    { name: "سجل المرضى", href: "/doctor/patients",  icon: Users           },
    { name: "جدول الدوام", href: "/doctor/schedule",  icon: CalendarDays    },
];

const patientSidebarItems = [
    { name: "ملفي الطبي",     href: "/patient",              icon: LayoutDashboard },
    { name: "وصفاتي",       href: "/patient/prescriptions", icon: ClipboardList    },
];

export interface SidebarProps {
    isAdmin?: boolean;
    role?: DashboardRole;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ 
    isAdmin = true, 
    role, 
    isMobileOpen, 
    setMobileOpen 
}: SidebarProps) {
    const effectiveRole: DashboardRole = role ?? (isAdmin ? "admin" : "manager");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const itemsToRender = effectiveRole === "admin" ? sidebarItems
        : effectiveRole === "department-head" ? deptHeadSidebarItems
        : effectiveRole === "doctor" ? doctorSidebarItems
        : effectiveRole === "patient" ? patientSidebarItems
        : managerSidebarItems;

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>


            {/* Sidebar Content */}
            <motion.aside
                dir="rtl"
                initial={false}
                animate={{
                    width: isCollapsed ? "80px" : "280px",
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? 300 : 0)
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 right-0 z-40 h-screen flex flex-col shadow-xl lg:relative lg:translate-x-0 transition-colors duration-300",
                    "bg-sidebar text-sidebar-foreground border-l border-sidebar-border"
                )}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border/50">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-sidebar-primary text-sidebar-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
                                <Hospital size={22} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-sidebar-foreground">ميدي كور</span>
                        </motion.div>
                    )}

                    {isCollapsed && (
                        <div className="w-10 h-10 bg-sidebar-primary text-sidebar-primary-foreground rounded-xl flex items-center justify-center mx-auto shadow-md">
                            <Hospital size={20} strokeWidth={2.5} />
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:flex absolute -left-3 top-20 w-6 h-6 bg-sidebar-background border border-sidebar-border rounded-full items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform z-50 text-sidebar-foreground"
                        style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}
                    >
                        <ChevronRight size={14} className={cn(isCollapsed && "rotate-180")} />
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden p-2 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">

                    {itemsToRender.map((item) => {
                        const isActive = item.href === "/doctor" || item.href === "/admin/dashboard" || item.href === "/manager/dashboard" || item.href === "/patient"
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(item.href + "/");
                        const isSoon = (item as { soon?: boolean }).soon;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative mb-1",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-sm"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                                )}>
                                    <item.icon
                                        className={cn(
                                            "shrink-0 transition-colors",
                                            isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                                        )}
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />

                                    {!isCollapsed && (
                                        <span className="whitespace-nowrap texte-sm">
                                            {item.name}
                                        </span>
                                    )}

                                    {/* Active Indicator */}
                                    {isActive && !isCollapsed && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[80%] w-1 bg-sidebar-primary rounded-r-full" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-sidebar-border bg-sidebar-background/50">
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                        <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-bold shadow-sm overflow-hidden border border-sidebar-border">
                            A
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden text-sidebar-foreground">
                                <p className="text-sm font-bold truncate text-sidebar-foreground">أحمد محمد</p>
                                <p className="text-[10px] uppercase font-bold tracking-wider opacity-50">{effectiveRole === "admin" ? "Admin" : effectiveRole === "department-head" ? "Dept Head" : effectiveRole === "doctor" ? "Doctor" : effectiveRole === "patient" ? "Patient" : "Manager"}</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button className="p-1.5 hover:bg-destructive/10 text-sidebar-foreground/50 hover:text-destructive rounded-md transition-colors cursor-pointer">
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

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
    Settings,
    ChevronRight,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    FileText,
    ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "إدارة النقاط الطبية", href: "/admin/medical-points", icon: Hospital },
    { name: "المخزون المركزي", href: "/admin/inventory", icon: Package },
    { name: "طلبات الإمداد", href: "/admin/inventory/reports", icon: ClipboardList },
    { name: "المرضى", href: "/admin/patients", icon: Users },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground lg:hidden"
                onClick={toggleMobileSidebar}
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
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
                                <p className="text-[10px] uppercase font-bold tracking-wider opacity-50">Admin</p>
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

"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/dashboard/admin/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

type DashboardRole = "admin" | "manager" | "department-head" | "doctor" | "patient";

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
    /** false = لوحة المدير (Manager) */
    isAdmin?: boolean;
    /** الدور الحالي — يتجاوز isAdmin إذا تم تعيينه */
    role?: DashboardRole;
}

export function AdminDashboardLayout({ children, isAdmin = true, role }: AdminDashboardLayoutProps) {
    const pathname = usePathname();
    const mainRef = useRef<HTMLElement>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // حساب الدور الفعلي
    const effectiveRole: DashboardRole = role ?? (isAdmin ? "admin" : "manager");

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
        setIsMobileOpen(false); // إغلاق القائمة عند تغيير المفتاح
    }, [pathname]);

    const isDepartmentPage = pathname.includes("/departments/") || pathname.includes("/clinics/") && pathname.split("/").length > 4;

    const headerTitle =
        effectiveRole === "admin"
            ? "لوحة التحكم"
            : effectiveRole === "department-head"
                ? "إدارة القسم"
                : effectiveRole === "doctor"
                    ? "بوابة الطبيب"
                    : effectiveRole === "patient"
                        ? "بوابة المريض"
                        : (isDepartmentPage ? "إدارة القسم الطبي" : "إدارة النقطة الطبية");

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden" dir="rtl">
            {/* السايدبار — يتغير محتواه حسب الدور */}
            <Sidebar 
                role={effectiveRole as Parameters<typeof Sidebar>[0]["role"]} 
                isMobileOpen={isMobileOpen}
                setMobileOpen={setIsMobileOpen}
            />

            <main
                ref={mainRef}
                className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
                <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-card/80 backdrop-blur-md px-6 sm:px-8 justify-between border-b border-border transition-colors">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-base sm:text-lg font-bold text-foreground truncate">{headerTitle}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="p-4 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

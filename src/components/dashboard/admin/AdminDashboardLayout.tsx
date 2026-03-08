"use client";

import { useEffect, useRef } from "react";
import { Sidebar } from "@/components/dashboard/admin/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
    /** false = لوحة المدير (Manager) */
    isAdmin?: boolean;
}

export function AdminDashboardLayout({ children, isAdmin = true }: AdminDashboardLayoutProps) {
    const pathname = usePathname();
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
    }, [pathname]);

    const isDepartmentPage = pathname.includes("/departments/") || pathname.includes("/clinics/") && pathname.split("/").length > 4;

    const headerTitle = isAdmin
        ? "لوحة التحكم"
        : (isDepartmentPage ? "إدارة القسم الطبي" : "إدارة النقطة الطبية");

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden" dir="rtl">
            {/* السايدبار — يتغير محتواه حسب الدور */}
            <Sidebar isAdmin={isAdmin} />

            <main
                ref={mainRef}
                className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
                <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-card/80 backdrop-blur-md px-8 justify-between border-b border-border transition-colors">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-foreground">{headerTitle}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

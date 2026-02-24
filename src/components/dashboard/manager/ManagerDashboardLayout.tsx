"use client";

import { useEffect, useRef } from "react";
// ستحتاج لاحقاً لإنشاء Sidebar خاص بالمدير، حالياً سنستخدم مكاناً محجوزاً له
import { Sidebar } from "@/components/dashboard/admin/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";

/**
 * ManagerDashboardLayout
 * هذا المكون هو الهيكل الأساسي للوحة تحكم "رئيس النقطة الطبية".
 * يقوم بتنظيم السايدبار، الهيدر، ومنطقة المحتوى الرئيسية.
 */
export function ManagerDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const mainRef = useRef<HTMLElement>(null);

    // التأكد من العودة لأعلى الصفحة عند تغيير المسار (Routing)
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
    }, [pathname]);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden" dir="rtl">
            {/* القائمة الجانبية - سنقوم بتخصيصها لاحقاً لتناسب صلاحيات المدير */}
            <Sidebar />

            {/* منطقة المحتوى الرئيسية */}
            <main
                ref={mainRef}
                className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
                {/* الجزء العلوي (Header) */}
                <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-card/80 backdrop-blur-md px-8 justify-between border-b border-border transition-colors">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-foreground">إدارة النقطة الطبية</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </header>

                {/* محتوى الصفحة المتغير */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden" dir="rtl">
            {/* Sidebar - Fixed/Responsive */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-card/80 backdrop-blur-md px-8 justify-between border-b border-border transition-colors">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-foreground">لوحة التحكم</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {mounted ? (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all shadow-sm"
                                title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
                            >
                                {theme === "dark" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-primary" />}
                            </button>
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-secondary border border-border opacity-50" />
                        )}
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

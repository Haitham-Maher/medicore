"use client";

import { Search, Users, ShieldCheck, Shield, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DoctorFiltersProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isAdmin?: boolean;
    counts: {
        all: number;
        pointHeads?: number;
        deptHeads: number;
        doctors: number;
    };
}

export default function DoctorFilters({
    activeTab,
    onTabChange,
    searchQuery,
    onSearchChange,
    counts,
    isAdmin = true
}: DoctorFiltersProps) {
    const tabs = [
        { id: "all", label: "الكل", shortLabel: "الكل", icon: Users, count: counts.all },
        { id: "dept-heads", label: "رؤساء الأقسام", shortLabel: "الأقسام", icon: Shield, count: counts.deptHeads },
        { id: "doctors", label: "الأطباء", shortLabel: "أطباء", icon: Stethoscope, count: counts.doctors },
    ];

    if (isAdmin) {
        tabs.splice(1, 0, { id: "point-heads", label: "رؤساء النقاط", shortLabel: "النقاط", icon: ShieldCheck, count: counts.pointHeads ?? 0 });
    }

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col gap-3 shadow-sm sticky z-20 backdrop-blur-xl bg-opacity-80">
            {/* Search — full width on all screen sizes */}
            <div className="relative w-full">
                <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                />
                <input
                    type="text"
                    placeholder="بحث بالاسم أو النقطة الطبية أو القسم..."
                    className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Tabs — each takes equal space (flex-1), icon-only on xs, icon+label on sm+ */}
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50 w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            title={tab.label}
                            className={cn(
                                "relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer outline-hidden group",
                                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {/* Active Background Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabDoctor"
                                    className="absolute inset-0 bg-primary rounded-lg shadow-md shadow-primary/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Content Wrapper to stay on top */}
                            <div className="relative z-10 flex items-center justify-center gap-1.5 w-full">
                                <tab.icon
                                    size={15}
                                    className={cn(
                                        "shrink-0 transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-muted-foreground/60"
                                    )}
                                />

                                {/* Short label on xs, full label on sm+ */}
                                <span className="inline sm:hidden text-[11px] font-bold">{tab.shortLabel}</span>
                                <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>

                                {/* Count badge — hidden on xs to save space */}
                                <span className={cn(
                                    "hidden sm:flex text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full items-center justify-center transition-colors",
                                    isActive
                                        ? "bg-white/20 text-white backdrop-blur-md"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    {tab.count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
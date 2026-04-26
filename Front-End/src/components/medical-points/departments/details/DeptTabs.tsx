"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui";

interface DeptTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    isLoading: boolean;
}

const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "doctors", label: "الكادر الطبي" },
    { id: "leader", label: "رئيس القسم" },
];

export default function DeptTabs({ activeTab, onTabChange, isLoading }: DeptTabsProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="bg-muted/50 p-1 rounded-xl h-auto flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                {isLoading ? (
                    tabs.map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24 rounded-lg" />
                    ))
                ) : (
                    tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "px-3 md:px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all cursor-pointer whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

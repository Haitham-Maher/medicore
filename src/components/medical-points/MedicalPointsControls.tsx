"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, Search, Table as TableIcon } from "lucide-react";

interface MedicalPointsControlsProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    viewMode: "grid" | "table";
    onViewModeChange: (mode: "grid" | "table") => void;
    isAdmin?: boolean
}

export function MedicalPointsControls({
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    isAdmin
}: MedicalPointsControlsProps) {
    return (
        <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm sticky top-0 z-20 backdrop-blur-xl bg-opacity-80">
            {/* Search & Filter */}
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                <div className="relative flex-1 md:max-w-md">
                    <Search
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder={isAdmin ? "بحث عن نقطة طبية..." : "بحث عن قسم طبي..."}
                        className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
                <button
                    onClick={() => onViewModeChange("grid")}
                    className={cn(
                        "p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer",
                        viewMode === "grid"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LayoutGrid size={18} />
                    <span className="hidden sm:inline">بطاقات</span>
                </button>
                <button
                    onClick={() => onViewModeChange("table")}
                    className={cn(
                        "p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer",
                        viewMode === "table"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <TableIcon size={18} />
                    <span className="hidden sm:inline">جدول</span>
                </button>
            </div>
        </div>
    );
}

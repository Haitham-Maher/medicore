"use client";

import { Search } from "lucide-react";

interface PrescriptionSearchProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function PrescriptionSearch({ search, setSearch }: PrescriptionSearchProps) {
    return (
        <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الدواء أو رقم الوصفة..."
                className="w-full bg-card border border-border/50 rounded-xl py-2.5 sm:py-3 pr-11 pl-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 text-right"
                dir="rtl"
            />
            {search && (
                <button
                    onClick={() => setSearch("")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground hover:text-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/40 transition-colors cursor-pointer"
                >
                    مسح
                </button>
            )}
        </div>
    );
}

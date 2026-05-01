import { Search, FileDown, Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useState } from "react";

interface InventoryToolbarProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function InventoryToolbar({ search, setSearch }: InventoryToolbarProps) {

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 p-3 rounded-2xl shadow-sm">
            <div className="relative w-full sm:max-w-[280px] md:max-w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e: any) => setSearch(e.target.value)}
                    placeholder="بحث عن صنف..."
                    className="pr-10 bg-background/50 border-border/50 focus:bg-background transition-colors h-10 rounded-xl w-full"
                />
            </div>
        </div>
    );
}

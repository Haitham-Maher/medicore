"use client";

import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";
import { motion } from "framer-motion";
import { getCategoryIcon } from "../utils";
import { LayoutGrid } from "lucide-react";

interface InventoryCategoryFiltersProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    inventoryData: InventoryItem[];
}

export default function InventoryCategoryFilters({
    categories,
    selectedCategory,
    setSelectedCategory,
    inventoryData
}: InventoryCategoryFiltersProps) {
    return (
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/50 w-full md:w-fit overflow-x-auto no-scrollbar" dir="rtl">
            {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const Icon = cat === "الكل" ? LayoutGrid : getCategoryIcon(cat);
                const count = cat === "الكل"
                    ? inventoryData.length
                    : inventoryData.filter(i => i.category === cat).length;

                return (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "relative flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-colors whitespace-nowrap cursor-pointer group outline-hidden flex-1 md:flex-none justify-center md:justify-start",
                            isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {/* Active Background Indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        {/* Button Content */}
                        <div className="relative z-10 flex items-center gap-1.5 md:gap-2">
                            <Icon
                                size={16}
                                className={cn(
                                    "size-3.5 md:size-4 transition-transform group-hover:scale-110",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-primary"
                                )}
                            />
                            <span>{cat}</span>

                            <span className={cn(
                                "px-1.5 md:px-2 py-0.5 rounded-lg text-[9px] md:text-[10px] font-black transition-colors shadow-xs",
                                isActive
                                    ? "bg-white/20 text-primary-foreground backdrop-blur-md"
                                    : "bg-muted text-muted-foreground border border-border/50 group-hover:border-primary/30"
                            )}>
                                {count}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

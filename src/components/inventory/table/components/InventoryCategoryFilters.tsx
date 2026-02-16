import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";

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
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-3">
            {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = cat === "الكل"
                    ? inventoryData.length
                    : inventoryData.filter(i => i.category === cat).length;

                return (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all whitespace-nowrap border cursor-pointer active:scale-95",
                            isActive
                                ? "bg-primary text-white border-primary"
                                : "bg-card text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        {cat}
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                            isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        )}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

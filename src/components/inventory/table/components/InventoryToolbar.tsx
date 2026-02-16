import { Search, FileDown, Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";

interface InventoryToolbarProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function InventoryToolbar({ search, setSearch }: InventoryToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 p-3 rounded-2xl shadow-sm">
            <div className="relative w-full sm:max-w-[280px] md:max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e: any) => setSearch(e.target.value)}
                    placeholder="بحث عن صنف..."
                    className="pr-10 bg-background/50 border-border/50 focus:bg-background transition-colors h-10 rounded-xl w-full"
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="h-10 px-3 md:px-4 gap-2 font-bold cursor-pointer rounded-xl border-border/50 hover:bg-muted/50 transition-all flex-1 sm:flex-none">
                        <FileDown className="h-4 w-4" />
                    </Button>
                </div>
                <Button size="sm" className="h-10 px-4 md:px-5 gap-2 font-bold cursor-pointer rounded-xl bg-primary hover:bg-primary/90 shadow-sm transition-all w-full sm:w-auto whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    إضافة صنف
                </Button>
            </div>
        </div>
    );
}

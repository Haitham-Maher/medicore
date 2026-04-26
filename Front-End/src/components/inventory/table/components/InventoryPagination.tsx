import { Button } from "@/components/ui";

interface InventoryPaginationProps {
    totalItems: number;
    filteredCount: number;
}

export default function InventoryPagination({ totalItems, filteredCount }: InventoryPaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-border/50 bg-muted/5">
            <p className="text-xs font-bold text-muted-foreground order-2 sm:order-1">
                عرض {filteredCount} من {totalItems} صنوف
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="h-8 flex-1 sm:px-4 font-bold rounded-lg border-border/50 text-[11px] hover:bg-muted/50 transition-colors">السابق</Button>
                <Button variant="outline" size="sm" className="h-8 flex-1 sm:px-4 font-bold rounded-lg border-border/50 text-[11px] hover:bg-muted/50 transition-colors">التالي</Button>
            </div>
        </div>
    );
}

import { Skeleton } from "@/components/ui";

export default function InventoryStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
                >
                    <div className="flex items-start justify-between mb-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
            ))}
        </div>
    );
}

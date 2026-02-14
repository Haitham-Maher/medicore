import { Skeleton } from "@/components/ui";

export default function InventoryTableSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Toolbar Skeleton */}
            <div className="flex flex-col gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
                <div className="w-full h-11 md:h-10 bg-muted/50 rounded-lg" />
                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                    <div className="h-10 md:h-9 bg-muted/50 rounded-lg flex-1 sm:w-24" />
                    <div className="h-10 md:h-9 bg-muted/50 rounded-lg flex-1 sm:w-24" />
                    <div className="h-10 md:h-9 bg-muted/50 rounded-lg col-span-2 sm:w-32" />
                </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
                {/* Desktop view */}
                <div className="hidden md:block">
                    <div className="bg-muted/30 h-12 border-b border-border/50 flex items-center px-6 gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="divide-y divide-border/50">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 flex items-center px-6 gap-4">
                                <Skeleton className="h-4 w-16" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile view */}
                <div className="md:hidden divide-y divide-border/50">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-3/4 rounded-md" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-12 rounded" />
                                        <Skeleton className="h-4 w-20 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-muted/20 border border-border/10">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-6 w-16 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-border/50 bg-muted/5">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Skeleton className="h-8 flex-1 sm:w-20 rounded-md" />
                        <Skeleton className="h-8 flex-1 sm:w-20 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}

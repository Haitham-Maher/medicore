import { Skeleton } from "@/components/ui";

export default function InventoryTableSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 p-3 rounded-2xl shadow-sm">
                <div className="h-10 bg-muted/50 rounded-xl w-full sm:max-w-[280px] md:max-w-sm" />
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <div className="h-10 flex-1 sm:w-24 bg-muted/50 rounded-xl" />
                        <div className="h-10 flex-1 sm:w-24 bg-muted/50 rounded-xl" />
                    </div>
                    <div className="h-10 w-full sm:w-32 bg-muted/50 rounded-xl" />
                </div>
            </div>

            {/* Category Chips Skeleton */}
            <div className="flex items-center gap-2 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-9 w-20 bg-muted/40 rounded-xl shrink-0" />
                ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Desktop view */}
                <div className="hidden md:block">
                    <div className="h-12 bg-muted/30 border-b border-border/50 flex items-center px-6 gap-6">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-20 pl-6" />
                    </div>
                    <div className="divide-y divide-border/40">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 flex items-center px-6 gap-6">
                                <Skeleton className="h-3 w-10" />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-9 w-9 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-2.5 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-20 rounded-lg text-center" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-7 w-20 rounded-xl mr-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile view */}
                <div className="md:hidden divide-y divide-border/50">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col gap-2 shrink-0">
                                    <Skeleton className="h-12 w-12 rounded-2xl" />
                                    <Skeleton className="h-10 w-12 rounded-xl" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5 space-y-2">
                                    <Skeleton className="h-5 w-3/4 rounded-md" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-12 rounded-lg" />
                                        <Skeleton className="h-4 w-20 rounded-lg" />
                                    </div>
                                </div>
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

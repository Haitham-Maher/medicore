import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function LowStockAlertsSkeleton() {
    return (
        <SkeletonCard className="overflow-hidden p-0">
            <div className="p-6 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-24 h-3" />
                        </div>
                    </div>
                    <Skeleton className="w-20 h-8 rounded-lg" />
                </div>
            </div>

            <div className="p-6 pt-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-32 h-4" />
                                <Skeleton className="w-24 h-3" />
                            </div>
                            <Skeleton className="w-20 h-6 rounded-full" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Skeleton className="w-12 h-3" />
                                <Skeleton className="w-16 h-3" />
                            </div>
                            <Skeleton className="w-full h-1.5 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonCard>
    );
}

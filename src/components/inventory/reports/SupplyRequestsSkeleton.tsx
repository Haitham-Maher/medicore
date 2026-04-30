import { Skeleton, SkeletonCard } from "@/components/ui";

export default function SupplyRequestsSkeleton() {
    return (
        <div className="space-y-6" dir="rtl">
            {/* List Container Skeleton */}
            <SkeletonCard className="border border-border/50 rounded-[2.5rem] overflow-hidden p-0">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-border/50">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <Skeleton className="w-14 h-14 rounded-2xl" />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-24 rounded-lg" />
                                        <Skeleton className="h-4 w-24 rounded-lg" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-24 rounded-2xl" />
                                <Skeleton className="h-10 w-24 rounded-2xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </SkeletonCard>
        </div>
    );
}

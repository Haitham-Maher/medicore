import { Skeleton, SkeletonCard } from "@/components/ui";

export default function MedicalPointsGridSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} className="p-0 overflow-hidden flex flex-col h-full">
                        {/* Image Skeleton with Rating Placeholder */}
                        <div className="relative w-full h-48">
                            <Skeleton className="w-full h-full rounded-none" />
                            <div className="absolute top-3 left-3">
                                <Skeleton className="w-12 h-6 rounded-lg" />
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex-1 space-y-3">
                                <Skeleton className="w-3/4 h-6" />
                                <Skeleton className="w-1/2 h-4" />
                            </div>

                            {/* Stats Grid Skeleton */}
                            <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/40 mt-6">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="flex flex-col items-center space-y-2">
                                        <Skeleton className="w-6 h-6 rounded-full" />
                                        <Skeleton className="w-12 h-3" />
                                        <Skeleton className="w-16 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SkeletonCard>
                ))}
            </div>
        </div>
    );
}

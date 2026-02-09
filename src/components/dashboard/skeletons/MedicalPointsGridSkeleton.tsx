import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function MedicalPointsGridSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-64 h-4" />
                </div>
                <Skeleton className="w-24 h-10 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <SkeletonCard key={i} className="p-0 overflow-hidden flex flex-col sm:flex-row h-full">
                        <Skeleton className="w-full sm:w-48 h-40" />
                        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                            <div className="space-y-3">
                                <Skeleton className="w-3/4 h-6" />
                                <Skeleton className="w-1/2 h-4" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/40">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="space-y-2">
                                        <Skeleton className="w-full h-4" />
                                        <Skeleton className="w-12 h-4" />
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

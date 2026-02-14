import { Skeleton, SkeletonCard } from "@/components/ui";

export default function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i}>
                    <div className="flex items-center justify-between">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <Skeleton className="w-16 h-6" />
                    </div>
                    <div className="mt-4 space-y-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-16 h-8" />
                    </div>
                </SkeletonCard>
            ))}
        </div>
    );
}

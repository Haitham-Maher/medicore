import { Skeleton, SkeletonCard } from "@/components/ui";

export default function ChartsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <SkeletonCard className="md:col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="w-40 h-6" />
                    <Skeleton className="w-24 h-8 rounded-lg" />
                </div>
                <Skeleton className="w-full h-[300px] rounded-xl" />
            </SkeletonCard>

            {/* Top Departments */}
            <SkeletonCard className="md:col-span-1 lg:col-span-1">
                <Skeleton className="w-36 h-6 mb-6" />
                <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="w-24 h-4" />
                                <Skeleton className="w-8 h-4" />
                            </div>
                            <Skeleton className="w-full h-2 rounded-full" />
                        </div>
                    ))}
                </div>
            </SkeletonCard>
        </div>
    );
}

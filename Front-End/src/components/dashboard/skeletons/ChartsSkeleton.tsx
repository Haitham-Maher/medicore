import { Skeleton, SkeletonCard } from "@/components/ui";

export default function ChartsSkeleton() {
    return (
        <div>
            <SkeletonCard className="md:col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="w-40 h-6" />
                    <Skeleton className="w-24 h-8 rounded-lg" />
                </div>
                <Skeleton className="w-full h-[300px] rounded-xl" />
            </SkeletonCard>
        </div>
    );
}

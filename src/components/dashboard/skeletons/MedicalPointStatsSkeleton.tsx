import { Skeleton, SkeletonCard } from "@/components/ui";

export default function MedicalPointStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} className="p-4 flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </SkeletonCard>
            ))}
        </div>
    );
}

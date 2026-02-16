import { Skeleton, SkeletonCard } from "@/components/ui";

export default function ClinicInventorySkeleton() {
    return (
        <SkeletonCard className="border border-border/50 rounded-2xl overflow-hidden p-0 h-full">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="p-6 space-y-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                ))}
            </div>
        </SkeletonCard>
    );
}

import { Skeleton, SkeletonCard } from "@/components/ui";

export default function RecentRequestsSkeleton() {
    return (
        <SkeletonCard className="border border-border/50 rounded-2xl overflow-hidden p-0 h-full">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 space-y-3">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-12 rounded-md" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        </SkeletonCard>
    );
}

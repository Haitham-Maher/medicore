import { Skeleton, SkeletonCard } from "@/components/ui";

export default function ClinicStaffListSkeleton() {
    return (
        <SkeletonCard className="border border-border/50 rounded-2xl overflow-hidden p-0 h-full">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="divide-y divide-border/50">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonCard>
    );
}

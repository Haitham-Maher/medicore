import { Skeleton, SkeletonCard } from "@/components/ui";

export default function ClinicStaffListSkeleton({ variant = "full" }: { variant?: "top" | "full" }) {
    return (
        <SkeletonCard className="border border-border/50 rounded-2xl overflow-hidden p-0 h-full">
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-3 w-36" />
                    </div>
                </div>
                <Skeleton className="h-7 w-16 rounded-lg" />
            </div>

            {variant === "top" ? (
                /* ── Top Variant: Simple Cards ── */
                <div className="p-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                            {/* Rank */}
                            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                            {/* Avatar */}
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            {/* Info */}
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            {/* Rating */}
                            <Skeleton className="h-4 w-10 shrink-0" />
                        </div>
                    ))}
                </div>
            ) : (
                /* ── Full Variant: List Rows ── */
                <>
                    {/* Search Bar */}
                    <div className="px-5 py-3 bg-muted/20 border-b border-border/10">
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                    <div className="divide-y divide-border/50">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-5 flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-36" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
            </div>
        </SkeletonCard>
    );
}

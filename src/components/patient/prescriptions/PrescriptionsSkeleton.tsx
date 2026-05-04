import { cn } from "@/lib/utils";

export default function PrescriptionsSkeleton() {
    const Sk = ({ className }: { className?: string }) => (
        <div className={cn("animate-pulse rounded-lg bg-muted/30", className)} />
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6" dir="rtl">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sk className="size-10 sm:size-11 rounded-2xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <Sk className="h-5 w-40 sm:w-56" />
                        <Sk className="h-3 w-28 sm:w-36" />
                    </div>
                </div>
                <Sk className="h-6 w-16 rounded-full shrink-0" />
            </div>

            {/* Search Bar Skeleton */}
            <Sk className="h-11 sm:h-12 w-full rounded-xl" />

            {/* Summary Stats Skeleton */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[1, 2].map(i => (
                    <div key={i} className="border border-border/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center space-y-2">
                        <Sk className="h-7 w-8 mx-auto" />
                        <Sk className="h-2 w-16 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Prescriptions List Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sk className="size-11 rounded-xl shrink-0" />
                            <div className="space-y-2">
                                <Sk className="h-4 w-24 sm:w-32" />
                                <Sk className="h-2.5 w-28 sm:w-36" />
                            </div>
                        </div>
                        <Sk className="size-8 rounded-xl shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

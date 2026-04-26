"use client";

import { Skeleton } from "@/components/ui";

export default function PrescriptionsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Page Header Skeleton */}
            <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-48 rounded-xl" />
                <Skeleton className="h-4 w-64 rounded-lg" />
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                {/* List Header Skeleton */}
                <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl bg-muted/50" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32 rounded-lg" />
                            <Skeleton className="h-4 w-24 rounded-lg" />
                        </div>
                    </div>

                    {/* Search Bar Skeleton */}
                    <Skeleton className="w-full md:w-80 h-10 rounded-xl" />
                </div>

                {/* List Skeleton */}
                <div className="divide-y divide-border/30">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-48 rounded-lg" />
                                    <Skeleton className="h-3 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-32 rounded-lg" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3 w-24 rounded-lg" />
                                </div>
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    ))}
                </div>

                {/* Footer Skeleton */}
                <div className="p-4 bg-muted/10 border-t border-border/50 text-center">
                    <Skeleton className="h-3 w-48 mx-auto rounded-lg" />
                </div>
            </div>
        </div>
    );
}

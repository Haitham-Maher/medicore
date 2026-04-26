"use client";

import { Skeleton } from "@/components/ui";

export default function DoctorsListSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Page Header Skeleton */}
            <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-48 rounded-xl" />
                <Skeleton className="h-4 w-64 rounded-lg" />
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                {/* List Header Skeleton */}
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 rounded-lg" />
                        <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="px-5 py-3 bg-muted/20 border-b border-border/10">
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>

                {/* List Skeleton */}
                <div className="divide-y divide-border/30">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-32 rounded-lg" />
                                    <Skeleton className="h-3 w-12 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-48 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24 rounded-lg hidden sm:block" />
                                <Skeleton className="h-5 w-12 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Skeleton */}
                <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

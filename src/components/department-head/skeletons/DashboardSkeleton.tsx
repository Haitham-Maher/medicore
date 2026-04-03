"use client";

import { Skeleton } from "@/components/ui";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between">
                            <Skeleton className="w-12 h-12 rounded-xl" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="mt-4 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Area Skeleton */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="w-full h-[300px] rounded-lg" />
                </div>

                {/* Top Doctors Skeleton */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/30">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-4 w-8 rounded-full" />
                            </div>
                        ))}
                    </div>
                    <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </div>

            {/* Recent Prescriptions Skeleton */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
                <div className="divide-y divide-border/30">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

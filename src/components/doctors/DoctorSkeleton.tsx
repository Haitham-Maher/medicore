"use client";

import { Skeleton } from "@/components/ui";

export default function DoctorSkeleton() {
    return (
        <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-14 rounded-lg" />
            </div>

            <div className="space-y-3 pt-2">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-28" />
            </div>

            <div className="border-t border-border/50 pt-4">
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}

export function DoctorSectionSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <DoctorSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

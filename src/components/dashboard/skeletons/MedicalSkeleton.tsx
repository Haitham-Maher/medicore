import React from "react";

const SkeletonCard = () => {
    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image Skeleton */}
            <div className="relative w-full h-48 shrink-0 bg-muted" />

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    {/* Title Skeleton */}
                    <div className="h-6 bg-muted rounded-md w-3/4 mb-4" />

                    {/* Location Skeleton */}
                    <div className="flex items-center gap-1.5 mb-6">
                        <div className="size-4 bg-muted rounded-full shrink-0" />
                        <div className="h-3 bg-muted rounded-md w-1/2" />
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/40 mt-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`space-y-2 text-center px-1 ${i !== 1 ? 'border-r border-border/40' : ''}`}>
                            <div className="mx-auto size-3 bg-muted rounded-full" />
                            <div className="mx-auto h-2 bg-muted rounded-md w-10" />
                            <div className="mx-auto h-3 bg-muted rounded-md w-8" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MedicalSkeleton = () => {
    return (
        <div className="space-y-6 mt-20">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 bg-muted rounded-lg w-48" />
                    <div className="h-4 bg-muted rounded-lg w-64" />
                </div>
                <div className="h-9 bg-muted rounded-lg w-24" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* يمكنك تكرار الكارد 3 أو 6 مرات كحالة تحميل */}
                {[...Array(3)].map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
};

export default MedicalSkeleton;
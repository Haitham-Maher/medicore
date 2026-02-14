import { Skeleton } from "@/components/ui";
import MedicalPointStatsSkeleton from "./MedicalPointStatsSkeleton";
import ClinicStaffListSkeleton from "./ClinicStaffListSkeleton";
import ClinicInventorySkeleton from "./ClinicInventorySkeleton";

export default function MedicalPointDetailsSkeleton() {
    return (
        <div className="space-y-8 pb-10 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Header Section Skeleton */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-muted">
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
                        <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
                    </div>
                    <div className="h-10 w-64 bg-muted-foreground/20 rounded-lg" />
                    <div className="h-5 w-48 bg-muted-foreground/20 rounded-lg" />
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-muted/50 p-1 rounded-xl h-auto flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Content Skeleton (Overview) */}
                <div className="space-y-8">
                    {/* Stats Grid Skeleton */}
                    <MedicalPointStatsSkeleton />

                    {/* Staff & Inventory Grid Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ClinicStaffListSkeleton />
                        <ClinicInventorySkeleton />
                    </div>

                    {/* Recent Requests Skeleton (Using simple placeholder here as it's a smaller component) */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

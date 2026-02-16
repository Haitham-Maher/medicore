import { Skeleton } from "@/components/ui";

export default function ManagerSectionSkeleton() {
    return (
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm p-6 flex flex-col md:flex-row gap-8 items-center md:items-start animate-pulse">
            <Skeleton className="w-28 h-28 rounded-2xl shrink-0" />

            <div className="flex-1 space-y-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border/30">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

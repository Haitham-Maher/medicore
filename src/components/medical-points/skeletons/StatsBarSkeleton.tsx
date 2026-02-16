import { Skeleton } from "@/components/ui";

export default function StatsBarSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 shadow-sm"
                >
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}

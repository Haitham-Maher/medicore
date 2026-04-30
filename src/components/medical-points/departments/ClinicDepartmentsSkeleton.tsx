import { Skeleton } from "@/components/ui";

export default function ClinicDepartmentsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4"
                >
                    <div className="flex items-start justify-between mb-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>

                    <Skeleton className="h-6 w-3/4" />

                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

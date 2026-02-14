import { Skeleton } from "@/components/ui";

export default function MedicalPointsTableSkeleton() {
    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden animate-pulse">
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-muted/30 border-b border-border/50">
                        <tr>
                            {[...Array(7)].map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-8" />
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

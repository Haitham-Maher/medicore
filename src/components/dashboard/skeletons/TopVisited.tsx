import { motion } from "framer-motion";

export default function TopVisitedSkeleton() {
    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6">النقاط الطبية الأكثر زيارة</h3>
            <div className="flex-1 flex flex-col justify-between">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-10 h-10 rounded-lg bg-secondary animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium"></span>
                                <span className="text-muted-foreground text-xs"></span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-muted-foreground/10 animate-pulse rounded-full"
                                    style={{ width: i === 0 ? "70%" : i === 1 ? "45%" : i === 2 ? "60%" : "30%" }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
"use client";

import { AlertTriangle, ArrowLeft, PackageCheck, PackageX, Boxes, Pill, Droplets, Thermometer, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    max: number;
    status: "good" | "low" | "critical";
    icon: any;
}

const mockInventory: InventoryItem[] = [
    { id: "1", name: "قفازات طبية", stock: 85, max: 100, status: "good", icon: Boxes },
    { id: "2", name: "شاش معقم", stock: 15, max: 100, status: "low", icon: Droplets },
    { id: "3", name: "حقن أنسولين", stock: 5, max: 50, status: "critical", icon: Thermometer },
    { id: "4", name: "مسكنات (باندول)", stock: 140, max: 200, status: "good", icon: Pill },
];

export default function ClinicInventory() {
    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-bold text-lg">حالة المخزون</h3>
                <span className="text-sm text-muted-foreground">
                    {mockInventory.length} أصناف
                </span>
            </div>

            <div className="divide-y divide-border/50 flex-1">
                {mockInventory.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
                    >
                        {/* Icon to match Staff Avatar */}
                        <div className={cn(
                            "h-12 w-12 rounded-xl border border-border/50 bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                            item.status === "critical" ? "text-red-500 bg-red-500/5 border-red-500/10" :
                                item.status === "low" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                                    "text-green-500 bg-green-500/5 border-green-500/10"
                        )}>
                            <item.icon size={22} />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                <div className="flex items-center gap-1.5">
                                    {item.status === "critical" && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {item.stock} / {item.max}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar inside the list item */}
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700",
                                        item.status === "good" ? "bg-green-500" :
                                            item.status === "low" ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${(item.stock / item.max) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                <History size={16} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                <ArrowLeft size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simplified Footer to maintain clean look */}
            <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
                <div className="flex items-center gap-2">
                    <PackageCheck size={16} className="text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">مكتملة</span>
                        <span className="text-sm font-black text-foreground">12</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-border/50" />
                <div className="flex items-center gap-2">
                    <PackageX size={16} className="text-red-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">نفد</span>
                        <span className="text-sm font-black text-foreground">03</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

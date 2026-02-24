"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    color: string;
    icon: LucideIcon;
}

export function StatsCard({
    title,
    value,
    color,
    icon: Icon,
}: StatsCardProps) {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
            >
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            </div>
        </div>
    );
}

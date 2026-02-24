"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import DoctorCard from "./DoctorCard";

interface DoctorSectionProps {
    title: string;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    data: any[];
    type: "point-head" | "dept-head" | "doctor";
    onDelete: (person: any) => void;
}

export default function DoctorSection({
    title,
    icon: Icon,
    iconColor,
    iconBg,
    data,
    type,
    onDelete
}: DoctorSectionProps) {
    if (data.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
                    <Icon size={16} className={iconColor} />
                </div>
                <h2 className="font-bold text-lg text-foreground">{title}</h2>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {data.length}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((person, i) => (
                    <DoctorCard
                        key={person.id}
                        person={person}
                        type={type}
                        index={i}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}


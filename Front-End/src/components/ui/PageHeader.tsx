"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description: string;
    icon: LucideIcon;
    className?: string;
    regionName?: string;
}

export default function PageHeader({ title, description, icon: Icon, className, regionName }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("space-y-2", className)}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">{title}
                </h1>
                {regionName ?

                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                        {regionName}
                    </span> :

                    <div className="animate-pulse bg-border/50 rounded-md h-[26px] w-24 inline-block align-middle" />
                }
            </div>
            <p className="text-muted-foreground font-medium text-sm md:text-base mr-15">
                {description}
            </p>
        </motion.div>
    );
}

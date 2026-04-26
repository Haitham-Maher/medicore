"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";

interface MedicalPointCardProps {
    point: {
        id: string;
        name: string;
        location: string;
        manager_name: string;
        rating: number;
        doctorsCount: number;
        departmentsCount: number;
        status: string;
        image: string;
    };
    onDelete: (point: any) => void;
    isAdmin?: boolean;
}

export function MedicalPointCard({ point, onDelete, isAdmin = true }: MedicalPointCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={isAdmin ? `/admin/medical-points/clinics/${point.id}` : `/manager/departments/${point.id}`}
            className="block h-full"
        >
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-colors h-full flex flex-col group cursor-pointer"
            >
                <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
                    {imageError ? (
                        <div className="w-full h-full bg-linear-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <span className="text-4xl font-black text-emerald-500/40 select-none">
                                {point.name.charAt(0)}
                            </span>
                        </div>
                    ) : (
                        <Image
                            src={"/images/hospital.jpg"}
                            alt={point.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-150 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    )}
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-2 py-1 rounded-lg border border-border/50 flex items-center gap-1 shadow-sm z-10">
                        <span className="text-xs font-bold">{point.rating}</span>
                        <Star size={12} className="text-orange-400 fill-orange-400" />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                        <StatusBadge status={point.status} />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(point);
                            }}
                            className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg border border-red-500/30 backdrop-blur-md transition-all cursor-pointer"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {point.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{point.location}</span>
                    </div>

                    <div className="mt-auto grid grid-cols-3 gap-2 py-4 border-t border-border/50 text-center">
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                                {isAdmin ? "المسؤول" : "رئيس القسم"}
                            </p>
                            <p className="text-xs font-bold truncate">
                                {point.manager_name.split(" ").slice(-1)[0]}
                            </p>
                        </div>
                        <div className="border-r border-border/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                                الأطباء
                            </p>
                            <p className="text-xs font-bold">
                                {point.doctorsCount}
                            </p>
                        </div>
                        <div className="border-r border-border/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                                {isAdmin ? "الأقسام" : "الغرف"}
                            </p>
                            <p className="text-xs font-bold">
                                {point.departmentsCount}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

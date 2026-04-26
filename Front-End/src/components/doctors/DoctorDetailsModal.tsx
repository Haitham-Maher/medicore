"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Phone, MapPin, Building2, Stethoscope, Calendar, Clock, ShieldCheck, Mail, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctorDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: {
        id: string;
        name: string;
        role: string;
        pointName: string;
        image: string;
        rating: number;
        phone: string;
        department?: string;
        specialize?: string;
        location?: string;
        salary?: string;
    } | null;
    type: "point-head" | "dept-head" | "doctor";
}

export default function DoctorDetailsModal({ isOpen, onClose, person, type }: DoctorDetailsModalProps) {
    if (!person) return null;

    const roleBadgeColor =
        type === "point-head"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : type === "dept-head"
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                : "bg-purple-500/10 text-purple-600 border-purple-500/20";

    const roleLabel =
        type === "point-head"
            ? "رئيس نقطة طبية"
            : type === "dept-head"
                ? "رئيس قسم"
                : "طبيب";

    const getInitials = (name: string) => {
        const cleanName = name.replace(/^(د\.|م\.)\s+/, "");
        return cleanName.charAt(0);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-4xl overflow-hidden"
                    >
                        {/* Header Image/Banner */}
                        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-transparent relative">
                            <button
                                onClick={onClose}
                                className="absolute left-4 top-4 p-2 rounded-full bg-background/50 hover:bg-background text-foreground transition-all cursor-pointer z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 pb-8 -mt-12 relative">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Large Avatar */}
                                <div className="shrink-0">
                                    <div className="w-32 h-32 rounded-3xl border-4 border-card shadow-xl overflow-hidden bg-muted flex items-center justify-center">
                                        {person.image && person.image.length > 1 ? (
                                            <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-black text-primary/40 leading-none">
                                                {getInitials(person.name)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 space-y-4 pt-12 md:pt-0">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-black text-foreground leading-tight">{person.name}</h2>
                                            <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider", roleBadgeColor)}>
                                                {roleLabel}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-amber-500 mb-4">
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                                                <span className="text-sm font-black">{person.rating}</span>
                                                <Star size={14} className="fill-amber-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {type === "doctor" ? (
                                            <div className="bg-muted/30 p-3 rounded-2xl border border-border/50">
                                                <div className="text-[10px] text-muted-foreground font-bold mb-1">المرضى</div>
                                                <div className="text-sm font-black text-foreground">1.2k+</div>
                                            </div>
                                        ) : (
                                            <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10">
                                                <div className="text-[10px] text-primary font-bold mb-1">الراتب</div>
                                                <div className="text-sm font-black text-foreground">
                                                    {person.salary || "12,500"} <span className="text-[10px]">SAR</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-muted/30 p-3 rounded-2xl border border-border/50">
                                            <div className="text-[10px] text-muted-foreground font-bold mb-1">الخبرة</div>
                                            <div className="text-sm font-black text-foreground">8 سنوات</div>
                                        </div>
                                        <div className="bg-muted/30 p-3 rounded-2xl border border-border/50">
                                            <div className="text-[10px] text-muted-foreground font-bold mb-1">العمليات</div>
                                            <div className="text-sm font-black text-foreground">450+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black text-primary flex items-center gap-2">
                                        <ShieldCheck size={16} />
                                        معلومات العمل
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailItem icon={MapPin} label="النقطة الطبية" value={person.pointName} />
                                        {person.department && <DetailItem icon={Building2} label="القسم" value={person.department} />}
                                        {person.specialize && <DetailItem icon={Stethoscope} label="التخصص" value={person.specialize} />}
                                        {person.location && <DetailItem icon={MapPin} label="العنوان" value={person.location} />}
                                        {type === "doctor" && person.salary && <DetailItem icon={Calendar} label="الراتب الشهري" value={`${person.salary} SAR`} />}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-sm font-black text-primary flex items-center gap-2">
                                        <Phone size={16} />
                                        معلومات التواصل
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailItem icon={Phone} label="رقم الهاتف" value={person.phone} valueClass="font-mono" dir="ltr" />
                                        <DetailItem icon={Mail} label="البريد الإلكتروني" value={`${person.id}@medicore.sa`} />
                                        <DetailItem icon={Globe} label="ساعات العمل" value="08:00 ص - 04:00 م" />
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function DetailItem({ icon: Icon, label, value, valueClass, dir }: { icon: any, label: string, value: string, valueClass?: string, dir?: "ltr" | "rtl" }) {
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={14} />
            </div>
            <div>
                <div className="text-[10px] text-muted-foreground font-bold">{label}</div>
                <div className={cn("text-xs font-black text-foreground", valueClass)} dir={dir}>{value}</div>
            </div>
        </div>
    );
}

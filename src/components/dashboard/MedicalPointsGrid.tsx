"use client"

import { motion } from "framer-motion";
import { Star, UserRound, Building2, Stethoscope, MapPin } from "lucide-react";

interface IMedicalPoint {
    name: string;
    location: string;
    manager: string;
    rating: number;
    doctorsCount: number;
    departmentsCount: number;
    image: string;
}

const medicalPoints: IMedicalPoint[] = [
    {
        name: "نقطة الشفاء الطبية",
        location: "الرياض - حي النسيم",
        manager: "د. أحمد محمد",
        rating: 4.8,
        doctorsCount: 12,
        departmentsCount: 6,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "مركز الأمل الصحي",
        location: "جدة - حي الروضة",
        manager: "د. سارة علي",
        rating: 4.5,
        doctorsCount: 8,
        departmentsCount: 4,
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "عيادات النور",
        location: "الدمام - حي الفيصلية",
        manager: "د. خالد عبدالله",
        rating: 4.9,
        doctorsCount: 15,
        departmentsCount: 8,
        image: "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "مجمع الرعاية الطبي",
        location: "مكة - حي العزيزية",
        manager: "د. فاطمة أحمد",
        rating: 4.3,
        doctorsCount: 6,
        departmentsCount: 3,
        image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400"
    },
];

function RatingStars({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={12}
                    className={`${i < fullStars
                        ? "text-warning fill-warning"
                        : i === fullStars && hasHalfStar
                            ? "text-warning fill-warning/50"
                            : "text-muted-foreground/30"
                        }`}
                />
            ))}
            <span className="text-xs font-semibold text-foreground mr-1">{rating}</span>
        </div>
    );
}

export default function MedicalPointsGrid() {
    return (
        <div className="space-y-6 mt-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">النقاط الطبية</h2>
                    <p className="text-muted-foreground text-sm mt-1">قائمة بجميع النقاط الطبية المسجلة في النظام</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                    عرض الكل
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {medicalPoints.map((point, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{
                            once: true,
                            amount: 0.3 // يعني: لا تشغل الانميشن إلا لما يظهر 30% من العنصر في الشاشة
                        }}

                        // التغيير هنا: لا يوجد حركة، فقط تغيير ألوان
                        whileHover={{
                            borderColor: "#3b82f6", // لون أزرق (أو استخدم لون مشروعك الأساسي)
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)", // توهج خفيف جداً بنفس اللون
                        }}

                        transition={{ delay: 0.1 * i }} // تغيير سريع وناعم
                        className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md cursor-pointer overflow-hidden flex flex-col sm:flex-row h-full group transition-colors"
                    >
                        {/* Image Section */}
                        <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden">
                            <img
                                src={point.image}
                                alt={point.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent sm:hidden" />
                            <div className="absolute bottom-3 right-3 sm:hidden">
                                <RatingStars rating={point.rating} />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {point.name}
                                    </h3>
                                    <div className="hidden sm:block">
                                        <RatingStars rating={point.rating} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                    <MapPin size={14} className="text-primary/60" />
                                    <span>{point.location}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-border/40">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <UserRound size={14} className="text-chart-1" />
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">المسؤول</span>
                                    </div>
                                    <p className="text-xs font-bold text-foreground truncate">{point.manager.split(' ').slice(1).join(' ')}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <Stethoscope size={14} className="text-chart-2" />
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">الأطباء</span>
                                    </div>
                                    <p className="text-xs font-bold text-foreground">{point.doctorsCount}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 size={14} className="text-chart-4" />
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">الأقسام</span>
                                    </div>
                                    <p className="text-xs font-bold text-foreground">{point.departmentsCount}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

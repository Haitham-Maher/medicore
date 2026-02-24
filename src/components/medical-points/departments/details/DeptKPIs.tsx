"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui";

interface DeptKPIsProps {
    isLoading?: boolean;
    stats: {
        patients: number;
        doctors: number;
        avgRating: number;
        prescriptions: number;
    };
    accentColor?: string;
}

export default function DeptKPIs({
    isLoading = false,
    stats,
    accentColor = "#14b8a6"
}: DeptKPIsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
            </div>
        );
    }

    const kpis = [
        {
            title: "كفاءة الكادر",
            value: (stats.prescriptions / stats.doctors / 30).toFixed(1),
            unit: "وصفة / يوم / طبيب",
            description: "معدل الإنجاز اليومي لكل كادر طبي",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: "+5.2%",
            isPositive: true
        },
        {
            title: "معدل الإشغال",
            value: "84%",
            unit: "نسبة مئوية",
            description: "استهلاك الموارد البشرية والزمنية",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "-2.1%",
            isPositive: false
        },
        {
            title: "وقت الانتظار",
            value: "18",
            unit: "دقيقة",
            description: "متوسط وقت انتظار المريض قبل الفحص",
            icon: Clock,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            trend: "-12%",
            isPositive: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                {kpi.trend}
                                <TrendingUp size={14} className={kpi.isPositive ? '' : 'rotate-180'} />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">{kpi.title}</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-foreground">{kpi.value}</span>
                                <span className="text-xs text-muted-foreground font-medium">{kpi.unit}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2 line-clamp-1">{kpi.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quality Analysis Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">تحليل الجودة (Quality Assurance)</h4>
                        <p className="text-xs text-muted-foreground">بناءً على تقييمات المرضى وبيانات الوصفات</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">رضا المرضى</span>
                            <span className="font-bold text-emerald-500">{(stats.avgRating * 20).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${stats.avgRating * 20}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            معدل الرضا العام للمرضى في هذا القسم يعتبر مرتفعاً مقارنة بالمتوسط العام للمنشأة.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">معدل الخطأ الطبي المتوقع</span>
                            <span className="font-bold text-blue-500">0.02%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `2%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            يتم قياس هذا المعدل بناءً على مراجعات الزملاء والتقارير الطبية المسجلة في الوصفات.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

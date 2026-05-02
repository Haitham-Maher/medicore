"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
    LayoutDashboard,
    Users,
    Star,
    Trophy,
    Activity,
    TrendingUp,
    Stethoscope,
    ClipboardList,
    ArrowLeft,
} from "lucide-react";
import ErrorData from "@/components/inventory/table/components/errorData";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";
import AgeDistributionChart from "@/components/dashboard/admin/AgeDistributionChart";
import DepartmentAgeChart from "@/components/dashboard/DepartmentAgeChart";
import Link from "next/link";
import DashboardSkeleton from "@/components/department-head/skeletons/DashboardSkeleton";
import api from "@/api/axios";

// ─── Helper ─────────────────────────────────────────────────
const getInitials = (name: string) => {
    const clean = name.replace(/^(د\.|م\.)\s+/, "");
    return clean.charAt(0);
};

// ─── Stats Card ─────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bgColor, trend }: {
    label: string; value: string | number; icon: any; color: string; bgColor: string; trend?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/20 cursor-pointer group transition-shadow duration-300"
        >
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-primary/10`}>
                    <Icon className={color} size={24} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-500 font-medium text-sm">
                        <span>{trend}</span>
                        <TrendingUp size={14} />
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
            </div>
        </motion.div>
    );
}

// ─── Page Component ─────────────────────────────────────────
export default function DepartmentHeadDashboard() {
    // جلب الإحصائيات من الـ API
    const { data: summaryResponse, isLoading: isSummaryLoading, isError, refetch } = useQuery({
        queryKey: ["department-head-summary"],
        queryFn: async () => {
            const response = await api.get("/department-head/summary");
            return response.data.data;
        },
    });

    // جلب الأطباء من الـ API
    const { data: staffResponse, isLoading: isStaffLoading } = useQuery({
        queryKey: ["department-head-staff"],
        queryFn: async () => {
            const response = await api.get("/department-head/staff");
            return response.data.data;
        },
    });

    // جلب الوصفات من الـ API
    const { data: prescriptionsResponse, isLoading: isPrescriptionsLoading } = useQuery({
        queryKey: ["department-head-prescriptions"],
        queryFn: async () => {
            const response = await api.get("/department-head/prescriptions");
            return response.data.data;
        },
    });

    const isLoading = isSummaryLoading || isStaffLoading || isPrescriptionsLoading;

    if (isLoading) return <DashboardSkeleton />;

    if (isError) {
        return <ErrorData refetch={refetch} />;
    }

    const topDoctors = Array.isArray(staffResponse)
        ? [...staffResponse].sort((a, b) => b.rating - a.rating).slice(0, 3)
        : [];
    const recentPrescriptions = Array.isArray(prescriptionsResponse)
        ? prescriptionsResponse.slice(0, 5)
        : [];
    const summaryData = summaryResponse || {};

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="لوحة رئيس القسم"
                    description={summaryData.department_name || "نقطة الشفاء الطبية"}
                    icon={LayoutDashboard}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="المرضى"
                    value={Number(summaryData.active_patients || 0).toLocaleString('en-US')}
                    icon={Users}
                    color="text-chart-2"
                    bgColor="bg-chart-2/15"
                />
                <StatCard
                    label="إجمالي الزيارات"
                    value={Number(summaryData.total_visits || 0).toLocaleString('en-US')}
                    icon={Activity}
                    color="text-chart-1"
                    bgColor="bg-chart-1/15"
                />
                <StatCard
                    label="الأطباء"
                    value={summaryData.active_doctors?.toString() || "0"}
                    icon={Stethoscope}
                    color="text-chart-4"
                    bgColor="bg-chart-4/15"
                />
                <StatCard
                    label="متوسط التقييم"
                    value={summaryData.average_rating?.toString() || "0"}
                    icon={Star}
                    color="text-chart-3"
                    bgColor="bg-chart-3/15"
                />
            </div>

            <motion.div
                initial={{ translateY: 30 }}
                animate={{ translateY: 0 }}
                transition={{ duration: .5 }}
                className="w-full"
            >
                <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 xl:grid-cols-3 lg:gap-4 gap-y-8">
                        <div className="bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col xl:col-span-2">
                            <DepartmentAgeChart />
                        </div>

                        {/* Top Doctors */}
                        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col ">
                            <div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between bg-linear-to-br from-primary/5 to-transparent gap-2">
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <div className="size-8 md:size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                                        <Trophy className="size-4 md:size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-sm md:text-lg text-foreground truncate">أفضل الأطباء</h3>
                                        <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold truncate">الأعلى تقييماً في القسم</p>
                                    </div>
                                </div>
                                <Link href={"/department-head/doctors"} className="shrink-0">
                                    <button
                                        className="text-[10px] md:text-sm text-primary hover:text-primary/80 font-black flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 whitespace-nowrap  md:bg-transparent"
                                    >
                                        عرض الكل <ArrowLeft className="size-3 md:size-[14px]" />
                                    </button>
                                </Link>

                            </div>
                            <div className="p-4 space-y-3 flex-1">
                                {topDoctors.map((doctor: any, index) => {
                                    const rankColors = [
                                        "bg-amber-500/15 text-amber-600 border-amber-500/20",
                                        "bg-slate-400/15 text-slate-500 border-slate-400/20",
                                        "bg-orange-500/15 text-orange-500 border-orange-400/20",
                                    ];
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                            className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer"
                                        >
                                            <div className={cn("size-6 md:size-8 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-black border shrink-0", rankColors[index] ?? rankColors[2])}>
                                                {index + 1}
                                            </div>
                                            <div className="size-7 md:size-9 rounded-full bg-primary/10 items-center justify-center shrink-0 hidden sm:flex">
                                                <span className="text-primary font-black text-[10px] md:text-xs">{getInitials(doctor.name)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[11px] md:text-sm text-foreground truncate">{doctor.name}</h4>
                                                <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{doctor.specialize}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 md:px-2 py-0.5 rounded-full shrink-0">
                                                <Star className="size-2.5 md:size-[10px] text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black text-amber-600">{doctor.rating}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground italic">التقييم العام للقسم</p>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    <span>متوسط التقييم: <span className="font-black text-foreground">{summaryData.average_rating || 0}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Prescriptions */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-sm">
                                    <ClipboardList size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-foreground">آخر الوصفات الطبية ({summaryData.total_prescriptions || 0})</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold">الوصفات الصادرة حديثاً من القسم</p>
                                </div>
                            </div>
                            <Link href={"/department-head/prescriptions"}>
                                <button
                                    className="text-[10px] md:text-sm text-primary hover:text-primary/80 font-black flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 whitespace-nowrap  md:bg-transparent"
                                >
                                    عرض الكل <ArrowLeft className="size-3 md:size-[14px]" />
                                </button>
                            </Link>
                        </div>
                        <div className="divide-y divide-border/30">
                            {recentPrescriptions.map((rx: any) => (
                                <div key={rx.prescription_number} className="px-6 py-4 flex items-center gap-4 hover:bg-muted/20 transition-all group cursor-pointer">
                                    <div className="size-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/5 group-hover:scale-110 transition-transform">
                                        <ClipboardList size={16} className="text-violet-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <h4 className="font-bold text-sm text-foreground truncate">{rx.doctor_name}</h4>
                                            <span className={cn(
                                                "text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tight",
                                                rx.status === "Dispensed"
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                            )}>
                                                {rx.status === "Dispensed" ? "تم الصرف" : "قيد الانتظار"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <p className="text-[11px] text-muted-foreground font-bold truncate">المريض: {rx.patient_name}</p>
                                            <span className="size-1 rounded-full bg-muted-foreground/30" />
                                            <p className="text-[10px] text-muted-foreground/60 font-medium whitespace-nowrap">{rx.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className="text-[10px] font-black text-violet-600 bg-violet-500/5 px-2 py-1 rounded-lg border border-violet-500/10">
                                            {rx.medicines_count} أدوية
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentPrescriptions.length === 0 && (
                                <div className="p-12 text-center text-muted-foreground font-bold italic">
                                    لا توجد وصفات طبية مسجلة حالياً
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
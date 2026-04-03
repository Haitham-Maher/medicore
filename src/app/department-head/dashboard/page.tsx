"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";
import AgeDistributionChart from "@/components/dashboard/admin/AgeDistributionChart";
import Link from "next/link";
import DashboardSkeleton from "@/components/department-head/skeletons/DashboardSkeleton";

// ─── Mock Data ──────────────────────────────────────────────
interface Doctor {
    id: string;
    name: string;
    specialty: string;
    status: "available" | "busy" | "off-duty";
    rating: number;
    patients: number;
    visits: number;
    phone: string;
}

const departmentInfo = {
    name: "قسم الجراحة العامة",
    pointName: "نقطة الشفاء الطبية",
    totalPatients: "342",
    totalVisits: 1280,
    activeDoctors: 6,
    totalDoctors: 8,
    avgRating: 4.7,
    monthlyGrowth: 12,
};

const mockDoctors: Doctor[] = [
    { id: "1", name: "د. أحمد كمال", specialty: "استشاري جراحة عامة", status: "available", rating: 4.9, patients: 85, visits: 320, phone: "+966 50 111 2222" },
    { id: "2", name: "د. سارة علي", specialty: "أخصائية جراحة أطفال", status: "busy", rating: 4.8, patients: 62, visits: 245, phone: "+966 50 333 4444" },
    { id: "3", name: "د. خالد منصور", specialty: "جراح عظام", status: "available", rating: 4.7, patients: 54, visits: 198, phone: "+966 50 555 6666" },
    { id: "4", name: "د. فاطمة حسين", specialty: "جراحة تجميل", status: "available", rating: 4.6, patients: 48, visits: 176, phone: "+966 50 777 8888" },
    { id: "5", name: "د. عمر يوسف", specialty: "جراحة قلب", status: "off-duty", rating: 4.5, patients: 40, visits: 152, phone: "+966 50 999 0000" },
    { id: "6", name: "د. نور الدين", specialty: "جراحة أعصاب", status: "busy", rating: 4.4, patients: 35, visits: 128, phone: "+966 50 222 3333" },
    { id: "7", name: "د. ليلى محمود", specialty: "جراحة مسالك", status: "available", rating: 4.3, patients: 28, visits: 98, phone: "+966 50 444 5555" },
    { id: "8", name: "د. حسن إبراهيم", specialty: "جراحة صدر", status: "off-duty", rating: 4.2, patients: 22, visits: 72, phone: "+966 50 666 7777" },
];

const recentPrescriptions = [
    { id: "1", doctor: "د. أحمد كمال", patient: "محمد علي", date: "2026-03-10", items: 3, status: "مكتملة" },
    { id: "2", doctor: "د. سارة علي", patient: "فاطمة حسن", date: "2026-03-09", items: 2, status: "قيد المراجعة" },
    { id: "3", doctor: "د. خالد منصور", patient: "أحمد سالم", date: "2026-03-08", items: 5, status: "نشطة" },
];

const deptHeadProfile = {
    name: "د. محمد أحمد",
    role: "رئيس قسم الجراحة",
    email: "mohammad.ahmed@medicore.com",
    phone: "+966 50 123 4567",
    department: "الجراحة العامة",
    joinDate: "15 يناير 2022",
    salary: "25,000 ريال",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
    bio: "استشاري جراحة عامة بخبرة تزيد عن 15 عاماً في العمليات الجراحية الدقيقة وإدارة الأقسام الطبية.",
    achievements: [
        "تطوير بروتوكول السلامة الجراحية للقسم",
        "تدريب أكثر من 50 طبيب مقيم",
        "الحصول على جائزة التميز الطبي لعام 2025"
    ]
};

// ─── Helper ─────────────────────────────────────────────────
const getInitials = (name: string) => {
    const clean = name.replace(/^(د\.|م\.)\s+/, "");
    return clean.charAt(0);
};

// ─── Stats Card ─────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bgColor, trend }: {
    label: string; value: string; icon: any; color: string; bgColor: string; trend?: string;
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
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <DashboardSkeleton />;

    const topDoctors = [...mockDoctors].sort((a, b) => b.rating - a.rating).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="لوحة رئيس القسم"
                    description={`${departmentInfo.name} — ${departmentInfo.pointName}`}
                    icon={LayoutDashboard}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="إجمالي المرضى" value={Number(departmentInfo.totalPatients).toLocaleString('en-US')} icon={Users} color="text-chart-2" bgColor="bg-chart-2/15" trend={`+${departmentInfo.monthlyGrowth}%`} />
                <StatCard label="إجمالي الزيارات" value={departmentInfo.totalVisits.toLocaleString('en-US')} icon={Activity} color="text-chart-1" bgColor="bg-chart-1/15" trend="+8%" />
                <StatCard label="الأطباء النشطين" value={`${departmentInfo.activeDoctors} / ${departmentInfo.totalDoctors}`} icon={Stethoscope} color="text-chart-4" bgColor="bg-chart-4/15" />
                <StatCard label="متوسط التقييم" value={departmentInfo.avgRating.toString()} icon={Star} color="text-chart-3" bgColor="bg-chart-3/15" />
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
                            <AgeDistributionChart />
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
                                {topDoctors.map((doctor, index) => {
                                    const rankColors = [
                                        "bg-amber-500/15 text-amber-600 border-amber-500/20",
                                        "bg-slate-400/15 text-slate-500 border-slate-400/20",
                                        "bg-orange-500/15 text-orange-500 border-orange-400/20",
                                    ];
                                    return (
                                        <Link href={`/department-head/doctors/${doctor.id}`} key={doctor.id}>
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
                                                    <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{doctor.specialty}</p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 md:px-2 py-0.5 rounded-full shrink-0">
                                                    <Star className="size-2.5 md:size-[10px] text-amber-500 fill-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-600">{doctor.rating}</span>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground italic">تقييمات شهرية</p>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    <span>متوسط التقييم: <span className="font-black text-foreground">{departmentInfo.avgRating}</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats & Prescriptions Panel */}

                    </div>

                    {/* Recent Prescriptions */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-sm">
                                    <ClipboardList size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-foreground">آخر الوصفات الطبية</h3>
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
                            {recentPrescriptions.map((rx) => (
                                <div key={rx.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-muted/20 transition-all cursor-pointer">
                                    <div className="h-9 w-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                        <ClipboardList size={14} className="text-violet-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-[13px] text-foreground truncate">{rx.doctor}</h4>
                                            <span className="text-[8px] px-1.5 py-px rounded-full border font-bold bg-muted text-muted-foreground border-border shrink-0">
                                                {rx.items} أدوية
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">المريض: {rx.patient} · {rx.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

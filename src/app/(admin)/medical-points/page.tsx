"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  MapPin,
  Filter,
  MoreHorizontal,
  Building2,
  Stethoscope,
  UserRound,
  Star,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data
const medicalPoints = [
  {
    id: "1",
    name: "نقطة الشفاء الطبية",
    location: "الرياض - حي النسيم",
    manager: "د. أحمد محمد",
    rating: 4.8,
    doctorsCount: 12,
    departmentsCount: 6,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    name: "مركز الأمل الصحي",
    location: "جدة - حي الروضة",
    manager: "د. سارة علي",
    rating: 4.5,
    doctorsCount: 8,
    departmentsCount: 4,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    name: "عيادات النور",
    location: "الدمام - حي الفيصلية",
    manager: "د. خالد عبدالله",
    rating: 4.9,
    doctorsCount: 15,
    departmentsCount: 8,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    name: "مجمع الرعاية الطبي",
    location: "مكة - حي العزيزية",
    manager: "د. فاطمة أحمد",
    rating: 4.3,
    doctorsCount: 6,
    departmentsCount: 3,
    status: "maintenance",
    image:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "5",
    name: "مركز الغربية الطبي",
    location: "جدة - حي الشاطئ",
    manager: "د. عمر فاروق",
    rating: 4.7,
    doctorsCount: 10,
    departmentsCount: 5,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1587351021759-3e566b9af922?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "6",
    name: "مستوصف السلام",
    location: "الرياض - حي الملز",
    manager: "د. يوسف العتيبي",
    rating: 4.2,
    doctorsCount: 5,
    departmentsCount: 2,
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=400",
  },
];

// Components
function StatsCard({
  title,
  value,
  color,
  icon: Icon,
}: {
  title: string;
  value: string;
  color: string;
  icon: any;
}) {
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

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
          نشط
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border w-16">
          غير نشط
        </span>
      );
    case "maintenance":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/20">
          صيانة
        </span>
      );
    default:
      return null;
  }
}

export default function MedicalPointsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPoints = medicalPoints.filter((point) => {
    // تحويل نص البحث إلى حروف صغيرة (لو كان إنجليزي) وتنظيف الفراغات
    const query = searchQuery.toLowerCase().trim();

    return (
      point.name.toLowerCase().includes(query) ||
      point.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="text-primary" />
            إدارة النقاط الطبية
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة ومتابعة جميع الفروع والعيادات الطبية
          </p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer">
          <Plus size={20} />
          إضافة نقطة جديدة
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="إجمالي النقاط"
          value={medicalPoints.length.toString()}
          color="bg-primary/10 text-primary"
          icon={Building2}
        />
        <StatsCard
          title="النقاط النشطة"
          value={medicalPoints
            .filter((p) => p.status === "active")
            .length.toString()}
          color="bg-success/10 text-success"
          icon={Star}
        />
        <StatsCard
          title="تحت الصيانة"
          value={medicalPoints
            .filter((p) => p.status === "maintenance")
            .length.toString()}
          color="bg-warning/10 text-warning"
          icon={Filter}
        />
      </div>

      {/* Controls Bar */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm sticky top-0 z-20 backdrop-blur-xl bg-opacity-80">
        {/* Search & Filter */}
        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
          <div className="relative flex-1 md:max-w-md">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="بحث عن نقطة طبية..."
              className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="bg-background border border-border hover:bg-muted/50 p-2.5 rounded-xl text-muted-foreground transition-colors"
            title="تصفية"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid size={18} />
            <span className="hidden sm:inline">بطاقات</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TableIcon size={18} />
            <span className="hidden sm:inline">جدول</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPoints.map((point, i) => (
              <Link
                href={`/medical-points/clinics/${point.id}`}
                key={point.id}
                className="block h-full"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{duration:.2}}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-colors h-full flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={point.image}
                      alt={point.name}
                      className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-2 py-1 rounded-lg border border-border/50 flex items-center gap-1 shadow-sm">
                      <span className="text-xs font-bold">{point.rating}</span>
                      <Star
                        size={12}
                        className="text-amber-400 fill-amber-400"
                      />
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={point.status} />
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
                          المسؤول
                        </p>
                        <p className="text-xs font-bold truncate">
                          {point.manager.split(" ")[1]}
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
                          الأقسام
                        </p>
                        <p className="text-xs font-bold">
                          {point.departmentsCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">
                      اسم النقطة
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm">الموقع</th>
                    <th className="px-6 py-4 font-semibold text-sm">المسؤول</th>
                    <th className="px-6 py-4 font-semibold text-sm">الحالة</th>
                    <th className="px-6 py-4 font-semibold text-sm">التقييم</th>
                    <th className="px-6 py-4 font-semibold text-sm">
                      الإحصائيات
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredPoints.map((point) => (
                    <tr
                      key={point.id}
                      className="group hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={point.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-semibold text-foreground">
                            {point.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {point.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {point.manager}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={point.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-sm">
                          {point.rating}
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {point.doctorsCount} طبيب • {point.departmentsCount} قسم
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/medical-points/clinics/${point.id}`}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          >
                            <ArrowRight size={18} className="rotate-180" />
                          </Link>
                          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

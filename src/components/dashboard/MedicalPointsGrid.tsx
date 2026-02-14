"use client";

import { motion } from "framer-motion";
import {
  Star,
  UserRound,
  Building2,
  Stethoscope,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

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
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "مركز الأمل الصحي",
    location: "جدة - حي الروضة",
    manager: "د. سارة علي",
    rating: 4.5,
    doctorsCount: 8,
    departmentsCount: 4,
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "عيادات النور",
    location: "الدمام - حي الفيصلية",
    manager: "د. خالد عبدالله",
    rating: 4.9,
    doctorsCount: 15,
    departmentsCount: 8,
    image:
      "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "مجمع الرعاية الطبي",
    location: "مكة - حي العزيزية",
    manager: "د. فاطمة أحمد",
    rating: 4.3,
    doctorsCount: 6,
    departmentsCount: 3,
    image:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400",
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
      <span className="text-xs font-semibold text-foreground mr-1">
        {rating}
      </span>
    </div>
  );
}

export default function MedicalPointsGrid() {
  return (
    <div className="space-y-6 mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            النقاط الطبية
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            قائمة بجميع النقاط الطبية المسجلة في النظام
          </p>
        </div>
        <Link href="/admin/medical-points">
          <button className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0">
            عرض الكل <ArrowLeft size={14} />
          </button>
        </Link>
      </div>

      {/* تعديل الشبكة لتناسب البطاقات العمودية (3 أعمدة في الشاشات الكبيرة) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicalPoints.map((point, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: i * 0.05 },
            }}
            viewport={{ once: true }}
            // استخدام transition بسيطة جداً وسريعة للهوفر
            whileHover={{
              y: -3,
              borderColor: "#3b82f6",
            }}
            transition={{
              type: "tween", // التبديل لـ tween أحياناً يكون أخف على المتصفح من spring
              ease: "easeOut",
              duration: 0.15, // سرعة خاطفة
            }}
            // هنا التغيير الأساسي: flex-col دائماً
            className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md cursor-pointer overflow-hidden flex flex-col h-full group"
          >
            {/* Image Section - جعلناها عريضة وبارتفاع ثابت */}
            <div className="relative w-full h-48 shrink-0 overflow-hidden">
              <img
                src={point.image}
                alt={point.name}
                className="w-full h-full object-cover duration-300 group-hover:scale-105"
              />

              {/* التقييم يظهر فوق الصورة بشكل جميل */}
              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold">{point.rating}</span>
                  <Star size={10} className="fill-orange-400 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {point.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground text-xs md:text-sm mb-4">
                  <MapPin size={14} className="text-primary/60 shrink-0" />
                  <span className="truncate">{point.location}</span>
                </div>
              </div>

              {/* Stats Grid - تم تحسين المسافات للوضع العمودي */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/40 mt-auto">
                <div className="space-y-1 text-center px-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <UserRound size={12} className="text-chart-1" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    المسؤول
                  </p>
                  <p className="text-xs font-bold text-foreground truncate w-full">
                    {point.manager.split(" ").slice(0, 1).join(" ")}{" "}
                    {/* الاسم الأول فقط لتوفير المساحة */}
                  </p>
                </div>

                <div className="space-y-1 text-center px-1 border-r border-border/40">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Stethoscope size={12} className="text-chart-2" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    الأطباء
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {point.doctorsCount}
                  </p>
                </div>

                <div className="space-y-1 text-center px-1 border-r border-border/40">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Building2 size={12} className="text-chart-4" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    الأقسام
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {point.departmentsCount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

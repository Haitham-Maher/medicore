"use client";

import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
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
import MedicalSkeleton from "../skeletons/MedicalSkeleton";

interface IMedicalPoint {
  name: string;
  location: string;
  manager: string;
  rating: number;
  doctorsCount: number;
  departmentsCount: number;
  image: string;
}

export default function MedicalPointsGrid({
  isAdmin,
  title = "النقاط الطبية",
  desc = "قائمة ببعض النقاط الطبية المسجلة في النظام"
}: {
  isAdmin: boolean,
  title?: string,
  desc?: string
}) {


  const { data: response, isLoading } = useQuery({
    queryKey: ["medical-points"],
    queryFn: async () => {
      const res = await api(isAdmin ? `/dashboard/medical-points?limit=5` : "/dashboard/departments?limit=5")
      return res.data
    }
  })

  if (isLoading) {
    return <MedicalSkeleton />
  }

  const data = response?.data;



  return (
    <div className="space-y-6 mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            {desc}
          </p>
        </div>
        <Link href={isAdmin ? "/admin/medical-points" : "/manager/departments"}>
          <button
            className="text-[10px] md:text-sm text-primary hover:text-primary/80 font-black flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 whitespace-nowrap  md:bg-transparent"
          >
            عرض الكل <ArrowLeft className="size-3 md:size-[14px]" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item: any, i: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: i * 0.05 },
            }}
            viewport={{ once: true }}
            whileHover={{
              y: -3,
              borderColor: "#3b82f6",
            }}
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: 0.15,
            }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md cursor-pointer overflow-hidden flex flex-col h-full group"
          >
            {/* Image Section */}
            <div className="relative w-full h-48 shrink-0 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover duration-300 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold">{item.rating}</span>
                  <Star size={10} className="fill-orange-400 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground text-xs md:text-sm mb-4">
                  <MapPin size={14} className="text-primary/60 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/40 mt-auto">
                <div className="space-y-1 text-center px-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <UserRound size={12} className="text-chart-1" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {isAdmin ? "المسؤول" : "رئيس القسم"}
                  </p>
                  <p className="text-xs font-bold text-foreground truncate w-full">
                    {item.manager_name}
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
                    {item.doctors_count}
                  </p>
                </div>

                <div className="space-y-1 text-center px-1 border-r border-border/40">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Building2 size={12} className="text-chart-4" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {isAdmin ? "الأقسام" : "الغرف"}
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {item.departments_count}
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

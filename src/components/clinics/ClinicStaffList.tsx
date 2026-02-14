"use client";

import { MoreHorizontal, Phone, Mail, User, UserCheck, UserMinus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ClinicStaffListSkeleton from "../dashboard/skeletons/ClinicStaffListSkeleton";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: "available" | "busy" | "off-duty";
  avatar?: string;
}

const mockStaff: Doctor[] = [
  {
    id: "1",
    name: "د. أحمد كمال",
    specialty: "طبيب عام",
    status: "available",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "د. سارة علي",
    specialty: "أخصائية أطفال",
    status: "busy",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    name: "م. محمد حسن",
    specialty: "ممرض",
    status: "off-duty",
    avatar: "https://github.com/shadcn.png",
  },
];

export default function ClinicStaffList({
  onViewAll,
  isLoading = false
}: {
  onViewAll?: () => void;
  isLoading?: boolean;
}) {
  if (isLoading) return <ClinicStaffListSkeleton />;
  return (
    <motion.div
      initial={{ translateY: 30 }}
      animate={{ translateY: 0 }}
      transition={{ duration: .3 }}
      className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">الكادر الطبي</h3>
          <span className="text-sm text-muted-foreground">
            {mockStaff.length} عضو
          </span>
        </div>

        <div className="flex items-center gap-4">


          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
            >
              عرض الكل <ArrowLeft size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-border/50 flex-1">
        {mockStaff.map((staff) => (
          <div
            key={staff.id}
            className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
          >
            <div className="h-12 w-12 rounded-full border-2 border-background shadow-sm overflow-hidden bg-secondary flex items-center justify-center shrink-0">
              {staff.avatar ? (
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm truncate">{staff.name}</h4>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${staff.status === "available"
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : staff.status === "busy"
                      ? "bg-red-500/10 text-red-600 border-red-500/20 "
                      : "bg-gray-500/10 text-gray-600 border-gray-500/20 "
                    }`}
                >
                  {staff.status === "available"
                    ? "متاح"
                    : staff.status === "busy"
                      ? "مشغول"
                      : "خارج الدوام"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{staff.specialty}</p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                <Phone size={16} />
              </button>
              <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                <Mail size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
        <div className="flex items-center gap-2">
          <UserCheck size={16} className="text-green-500" />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">
              متاح
            </span>
            <span className="text-sm font-black text-foreground">
              {mockStaff.filter((s) => s.status === "available").length}
            </span>
          </div>
        </div>
        <div className="h-8 w-px bg-border/50" />
        <div className="flex items-center gap-2">
          <UserMinus size={16} className="text-red-500" />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">
              مشغول
            </span>
            <span className="text-sm font-black text-foreground">
              {mockStaff.filter((s) => s.status === "busy").length}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

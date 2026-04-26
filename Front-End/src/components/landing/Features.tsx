"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Building2, Package, ShieldCheck } from "lucide-react";
import { FeatureSection } from "./FeatureSection";
import RoleHeader from "./role/rloeHeader";
import BodyRole from "./role/bodyRole";

export function Features() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // التأكد من أن المكوّن قد تم تحميله في المتصفح لتجنب أخطاء الـ Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // تحديد الـ Theme الحالي، مع افتراض Dark كشكل افتراضي قبل التحميل
  const currentTheme = mounted ? resolvedTheme : "dark";

  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-32">

        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-black text-emerald-500 tracking-[0.2em] uppercase mb-4"
          >
            المميزات
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-5"
          >
            كل ما تحتاجه لإدارة{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
              النقاط الطبية
            </span>
          </motion.h2>
        </div>

        {/* Feature 1: Dashboard Overview */}
        <FeatureSection
          badgeLabel="نظرة عامة على لوحة التحكم"
          badgeIcon={<LayoutDashboard size={14} />}
          title="نظرة شاملة على لوحة التحكم"
          description="احصل على عرض كامل لشبكتك الطبية دفعةً واحدة مع تحليلات ورؤى فورية تساعدك في اتخاذ أسرع القرارات."
          bullets={[
            "إحصائيات لحظية ومؤشرات الأداء",
            "عدد النقاط الطبية النشطة",
            "نظرة عامة على أعداد الأطباء",
            "حالة مخزون الأدوية",
            "تنبيهات المخزون المنخفض",
          ]}
          // التبديل بين صورتين بناءً على الثيم
          imageSrc={currentTheme === "dark"
            ? "/images/dashboard_dark_mode.png"
            : "/images/dashboard_light_mode.png"
          }
          imageAlt="Dashboard Overview"
        />

        {/* Feature 2: Medical Points Management */}
        <FeatureSection
          badgeLabel="إدارة النقاط الطبية"
          badgeIcon={<Building2 size={14} />}
          title="نظام مركزي لإدارة النقاط الطبية"
          description="أدِر جميع عياداتك ومراكزك الطبية بسهولة تامة من خلال لوحة تحكم مركزية قوية وموحدة."
          bullets={[
            "إدارة العيادات والمراكز الطبية",
            "تعيين مدراء مستقلين لكل نقطة",
            "عرض قائمة الأطباء حسب النقطة",
            "مراقبة مخزون الأدوية لكل عيادة",
          ]}
          imageSrc={currentTheme === "dark"
            ? "/images/medical_point_dark_mode.png"
            : "/images/medical_point_light_mode.png"
          }
          imageAlt="Medical Points Management"
          reverse={true}
        />

        {/* Feature 3: Doctors Management */}
        <FeatureSection
          badgeLabel="إدارة الأطباء"
          badgeIcon={<Users size={14} />}
          title="تنظيم وإدارة الكوادر الطبية"
          description="نظّم طاقمك الطبي بكفاءة عالية عبر جميع النقاط الطبية والأقسام المختلفة من مكان واحد."
          bullets={[
            "إضافة وإدارة بيانات الأطباء",
            "توزيع الأطباء على الأقسام الطبية",
            "ربط الكوادر بالنقاط الطبية المختلفة",
            "تنظيم طواقم العمل بكفاءة عالية",
          ]}
          imageSrc={currentTheme === "dark"
            ? "/images/medical_staff_management_dark_mode.png"
            : "/images/medical_staff_management_light_mode.png"
          }
          imageAlt="Doctors Management"
          reverse={false}
        />

        {/* Feature 4: Departments Management */}
        <FeatureSection
          badgeLabel="إدارة الأقسام"
          badgeIcon={<LayoutDashboard size={14} />} // يمكنك تغيير الأيقونة لاحقاً إن أردت
          title="إدارة وتنظيم الأقسام الطبية"
          description="نظّم الخدمات الطبية عبر جميع النقاط الطبية من خلال نظام إدارة أقسام متطور ومرن يسهل تتبع التخصصات."
          bullets={[
            "الطب العام والتشخيص الأولي",
            "طب وجراحة الأسنان",
            "قسم طب الأطفال والخدّج",
            "قسم الطوارئ والعناية المركزة",
          ]}
          imageSrc={currentTheme === "dark"
            ? "/images/department_management_dark_mode.png"
            : "/images/department_management_light_mode.png"
          }
          imageAlt="Departments Management"
          reverse={true}
        />

        {/* Feature 5: Inventory Management */}
        <FeatureSection
          badgeLabel="إدارة المخزون والصيدلية"
          badgeIcon={<Package size={14} />}
          title="تحكّم كامل في مخزون الأدوية والمستلزمات"
          description="تابع مخزون الأدوية والمستلزمات الطبية عبر جميع النقاط الطبية. احصل على تنبيهات فورية قبل نفاد المخزون وأدِر طلبات الإمداد بكل سهولة."
          bullets={[
            "تتبع لحظي لكميات المخزون",
            "تنبيهات تلقائية للمخزون المنخفض",
            "إدارة تواريخ انتهاء الأدوية",
            "طلبات الإمداد والتوريد",
            "تقارير استهلاك دورية",
          ]}
          imageSrc={currentTheme === "dark"
            ? "/images/pharmacy_inventory_dark_mode.png"
            : "/images/pharmacy_inventory_light_mode.png"
          }
          imageAlt="Inventory Management"
          reverse={false}
        />

        {/* Feature 6: Security & Permissions */}
        <div id="roles">
          <RoleHeader />
        </div>
        
      </div>
    </section>
  );
}

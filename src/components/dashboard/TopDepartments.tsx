"use client"

// TopDepartments.tsx
import { Activity, Baby, HeartPulse, Stethoscope } from "lucide-react"; // تأكد من استيراد أيقونات
import { motion } from "framer-motion";

// أضفنا أيقونات ووصف بسيط
const departments = [
    { name: "قسم الأطفال", value: 85, count: "120 مريض", color: "bg-blue-500", icon: Baby },
    { name: "العناية المركزة", value: 62, count: "86 مريض", color: "bg-red-500", icon: Activity },
    { name: "قسم الجراحة", value: 45, count: "54 مريض", color: "bg-amber-500", icon: Stethoscope },
    { name: "قسم الطوارئ", value: 30, count: "32 مريض", color: "bg-emerald-500", icon: HeartPulse },
];

export default function TopDepartments() {
    return (
        // h-full مهم جداً هنا ليأخذ طول الأب (المساوي للمخطط الجار)
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6">الأقسام الأكثر طلباً</h3>

            {/* flex-1 وتوزيع المساحة سيجعل العناصر تتمدد لتملأ الطول المتاح */}
            <div className="flex-1 flex flex-col justify-between">
                {departments.map((dept, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 md:mb-0">

                        {/* 1. الأيقونة تضيف وزناً بصرياً وتملأ الفراغ */}
                        <div className={`w-10 h-10 rounded-lg ${dept.color} bg-opacity-10 flex items-center justify-center text-${dept.color.replace('bg-', '')}`}>
                            <dept.icon size={20} className="text-white" />
                            {/* ملاحظة: قد تحتاج ضبط لون الأيقونة حسب الثيم */}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{dept.name}</span>
                                <span className="text-muted-foreground text-xs">{dept.count} ({dept.value}%)</span>
                            </div>

                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    // 1. قمنا بإزالة كلاسات الـ transition الخاصة بـ Tailwind
                                    className={`h-full ${dept.color} rounded-full`}

                                    // 2. نقطة البداية: العرض صفر
                                    initial={{ width: 0 }}

                                    // 3. عندما يظهر العنصر في الشاشة، اجعل عرضه يساوي النسبة المئوية
                                    whileInView={{ width: `${dept.value}%` }}

                                    // هذا السطر يضمن تشغيل الانيميشن مرة واحدة فقط عند الظهور الأول
                                    viewport={{ once: true }}

                                    // 4. إعدادات الحركة: مدة ثانية ونصف، ونوع حركة ناعم (easeOut)
                                    // يمكنك إضافة delay: i * 0.1 إذا أردت ظهوراً متتابعاً للأشرطة
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
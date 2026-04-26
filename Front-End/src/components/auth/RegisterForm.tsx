"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Building2, ArrowLeft, ArrowRight, Camera, X } from "lucide-react";
import { AuthField } from "./AuthField";
import { StepIndicator } from "./StepIndicator";
import { RoleSelector, roles } from "./RoleSelector";
import z from "zod";

interface RegisterFormProps {
    onSuccess: (roleId: string) => void;
    onSwitch: () => void;
}

const stepLabels: Record<number, string> = {
    1: "بيانات الحساب",
    2: "المعلومات الشخصية",
    3: "الدور والقسم",
    4: "المراجعة والتأكيد",
};

// تعريف الـ Schema الكلية
const registerSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    pass: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirm: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    firstName: z.string().min(1, "الاسم الأول مطلوب"),
    lastName: z.string().min(1, "اسم العائلة مطلوب"),
    phone: z.string()
        .min(9, "رقم الجوال يجب أن يكون 9 أرقام على الأقل")
        .regex(/^[0-9]+$/, "يجب إدخال أرقام فقط"),
    org: z.string().min(3, "المستشفى / المنشأة مطلوب"),
    selectedRole: z.string().min(1, "الدور مطلوب"),
    image: z.string().optional().nullable(),
}).refine((data) => data.pass === data.confirm, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirm"],
});

export function RegisterForm({ onSuccess, onSwitch }: RegisterFormProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [formData, setFormData] = useState({
        email: "",
        pass: "",
        confirm: "",
        firstName: "",
        lastName: "",
        phone: "",
        org: "",
        selectedRole: "doctor",
        image: null as string | null
    });

    const role = roles.find(r => r.id === formData.selectedRole)!;

    // دالة للتحقق من حقول الخطوة الحالية فقط
    const validateStep = (currentStep: number) => {
        const fieldsByStep: Record<number, (keyof typeof formData)[]> = {
            1: ["email", "pass", "confirm"],
            2: ["firstName", "lastName", "phone", "org", "image"],
            3: ["selectedRole"],
            4: []
        };

        const currentFields = fieldsByStep[currentStep];
        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const allFieldErrors = result.error.flatten().fieldErrors;
            // استخراج الأخطاء التي تخص الخطوة الحالية فقط
            const currentErrors: Record<string, string[]> = {};
            let hasErrors = false;

            currentFields.forEach(field => {
                if (allFieldErrors[field]) {
                    currentErrors[field] = allFieldErrors[field]!;
                    hasErrors = true;
                }
            });

            // معالجة خاصة لخطأ التطابق في الخطوة الأولى
            if (currentStep === 1 && allFieldErrors.confirm) {
                currentErrors.confirm = allFieldErrors.confirm;
                hasErrors = true;
            }

            if (hasErrors) {
                setErrors(currentErrors);
                return false;
            }
        }

        setErrors({});
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            if (step < 4) {
                setStep(step + 1);
            } else {
                handleFinalSubmit();
            }
        }
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinalSubmit = () => {
       

        setLoading(true);
        // محاكاة إرسال البيانات للـ API
        setTimeout(() => {
            setLoading(false);
            onSuccess(formData.selectedRole);
        }, 1300);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-0.5">إنشاء حساب جديد</h2>
            <p className="text-sm text-muted-foreground mb-5">الخطوة {step} من ٤: {stepLabels[step]}</p>

            <StepIndicator step={step} />

            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>

                    {step === 1 && (
                        <div className="space-y-4">
                            <AuthField label="البريد الإلكتروني" id="remail" type="email"
                                placeholder="you@medicore.app" value={formData.email}
                                onChange={(v) => { setFormData({ ...formData, email: v }); setErrors({ ...errors, email: [] }); }}
                                error={errors.email?.[0]} icon={Mail} />

                            <AuthField label="كلمة المرور" id="rpass" type="password"
                                placeholder="٨ أحرف على الأقل" value={formData.pass}
                                onChange={(v) => { setFormData({ ...formData, pass: v }); setErrors({ ...errors, pass: [] }); }}
                                error={errors.pass?.[0]} icon={Lock} />

                            <AuthField label="تأكيد كلمة المرور" id="rconfirm" type="password"
                                placeholder="أعد إدخال كلمة المرور" value={formData.confirm}
                                onChange={(v) => { setFormData({ ...formData, confirm: v }); setErrors({ ...errors, confirm: [] }); }}
                                error={errors.confirm?.[0]} icon={Lock} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center gap-2 mb-6">
                                <div className="relative group">
                                    <div className="size-20 rounded-full bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500/50 shadow-inner">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="size-full object-cover" />
                                        ) : (
                                            <Camera className="size-6 text-muted-foreground/40" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {formData.image && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: null })}
                                            className="absolute -top-1 -right-1 size-6 bg-destructive text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer z-20"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">صورة الملف الشخصي</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <AuthField label="الاسم الأول" id="fname" placeholder="أحمد" value={formData.firstName}
                                    onChange={(v) => { setFormData({ ...formData, firstName: v }); setErrors({ ...errors, firstName: [] }); }}
                                    error={errors.firstName?.[0]} icon={User} />

                                <AuthField label="اسم العائلة" id="lname" placeholder="الراشدي" value={formData.lastName}
                                    onChange={(v) => { setFormData({ ...formData, lastName: v }); setErrors({ ...errors, lastName: [] }); }}
                                    error={errors.lastName?.[0]} icon={User} />
                            </div>

                            <AuthField label="رقم الجوال" id="phone" type="tel"
                                placeholder="5XXXXXXXX" value={formData.phone}
                                onChange={(v) => { setFormData({ ...formData, phone: v }); setErrors({ ...errors, phone: [] }); }}
                                error={errors.phone?.[0]} icon={Phone} />

                            <AuthField label="المستشفى / المنشأة" id="org"
                                placeholder="مدينة الملك فهد الطبية" value={formData.org}
                                onChange={(v) => { setFormData({ ...formData, org: v }); setErrors({ ...errors, org: [] }); }}
                                error={errors.org?.[0]} icon={Building2} />
                        </div>
                    )}

                    {step === 3 && (
                        <RoleSelector selectedId={formData.selectedRole} onSelect={(v) => setFormData({ ...formData, selectedRole: v })} />
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="bg-muted/20 border border-border/40 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    {formData.image ? (
                                        <img src={formData.image} alt="User" className="size-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-400">
                                            {(formData.firstName[0] || "م").toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-black text-foreground">{formData.firstName} {formData.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{formData.email}</p>
                                    </div>
                                </div>
                                {[
                                    { l: "الدور", v: role.label },
                                    { l: "المنشأة", v: formData.org || "—" },
                                    { l: "الجوال", v: formData.phone || "—" },
                                ].map(row => (
                                    <div key={row.l} className="flex justify-between items-center py-1.5 border-t border-border/30">
                                        <span className="text-sm text-muted-foreground">{row.l}</span>
                                        <span className="text-sm font-bold text-foreground">{row.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-3 mt-6">
                {step > 1 && (
                    <button type="button" onClick={handlePrev} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border/50 text-sm font-bold text-foreground/70 hover:text-foreground hover:border-border transition-all cursor-pointer">
                        <ArrowRight className="size-4" /> رجوع
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                    {loading ? (
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>{step === 4 ? "إنشاء الحساب" : "متابعة"}</span>
                            <ArrowLeft className="size-4" />
                        </>
                    )}
                </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
                لديك حساب؟ <button type="button" onClick={onSwitch} className="text-emerald-500 font-bold hover:underline cursor-pointer">تسجيل الدخول</button>
            </p>
        </motion.div>
    );
}
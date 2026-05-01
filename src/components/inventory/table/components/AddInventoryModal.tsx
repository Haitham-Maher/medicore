"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Tag, Hash, DollarSign, CheckCircle2, Plus, AlertCircle, Database } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AddInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newItem: any) => void;
    isLoading?: boolean;
    storageId?: number; // مطلوب من الباك إند: storage_id
}

// الأنواع المقبولة من الباك إند فقط: tablet | syrup | injection
const MEDICINE_TYPES = [
    { id: "tablet",    label: "حبوب",  sub: "Tablet"    },
    { id: "syrup",     label: "شراب",  sub: "Syrup"     },
    { id: "injection", label: "حقن",   sub: "Injection" },
];

export default function AddInventoryModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
    storageId,
}: AddInventoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "tablet",
        quantity: 0,
        max: "",
        price: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSave = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim())  newErrors.name     = "اسم الدواء مطلوب";
        if (!formData.type)         newErrors.type     = "نوع الدواء مطلوب";
        if (formData.quantity === undefined || formData.quantity === null) newErrors.quantity = "الكمية مطلوبة";
        if (formData.quantity < 0)  newErrors.quantity = "الكمية لا يمكن أن تكون سالبة";
        if (!formData.max)          newErrors.max      = "الحد الأقصى مطلوب لتجنب أخطاء النظام";
        if (!storageId)             newErrors.storage  = "لا يوجد مخزن مرتبط بهذه المنطقة";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // بناء الـ Payload مطابقاً للباك إند حرفياً
        const payload: Record<string, any> = {
            name:       formData.name.trim(),
            type:       formData.type,
            quantity:   formData.quantity,
            storage_id: storageId,          // إجباري
        };

        // الحقول الاختيارية — لا نرسلها إلا إذا كانت لها قيمة
        if (formData.max   && parseInt(formData.max)     >= 1)  payload.max   = parseInt(formData.max);
        if (formData.price && parseFloat(formData.price) >= 0)  payload.price = parseFloat(formData.price);

        onSave(payload);
    };

    const handleClose = () => {
        setFormData({ name: "", type: "tablet", quantity: 0, max: "", price: "" });
        setErrors({});
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border/50 bg-linear-to-br from-primary/5 to-transparent relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Plus size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-foreground tracking-tight">إضافة دواء جديد</h2>
                                    <p className="text-xs text-muted-foreground font-bold opacity-70">
                                        إضافة صنف طبي جديد إلى المخزن المركزي
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto">

                            {/* تنبيه: لا يوجد مخزن */}
                            {!storageId && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <p className="text-xs font-bold">
                                        لم يتم العثور على مخزن مرتبط بمنطقتك. تأكد من وجود بيانات في المخزون أولاً.
                                    </p>
                                </div>
                            )}

                            {/* بطاقة المخزن */}
                            {storageId && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                                    <Database size={14} className="text-primary shrink-0" />
                                    <p className="text-xs font-bold text-primary">
                                        سيُضاف للمخزن المركزي رقم #{storageId}
                                    </p>
                                </div>
                            )}

                            {/* اسم الدواء — إجباري */}
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground flex items-center gap-2">
                                    <Package size={16} className="text-primary" />
                                    <span>
                                        اسم الدواء / الصنف
                                        <span className="text-destructive mr-1">*</span>
                                    </span>
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: "" });
                                    }}
                                    placeholder="مثال: بانادول إكسترا"
                                    className={cn(
                                        "h-12 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-medium",
                                        errors.name && "border-destructive/50 ring-destructive/20"
                                    )}
                                />
                                {errors.name && <p className="text-xs font-bold text-destructive">{errors.name}</p>}
                            </div>

                            {/* نوع الدواء — إجباري (tablet | syrup | injection فقط) */}
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground flex items-center gap-2">
                                    <Tag size={16} className="text-primary" />
                                    <span>
                                        نوع الدواء
                                        <span className="text-destructive mr-1">*</span>
                                    </span>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {MEDICINE_TYPES.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t.id })}
                                            className={cn(
                                                "px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5",
                                                formData.type === t.id
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-muted/20 border-border/30 text-muted-foreground hover:border-border"
                                            )}
                                        >
                                            <span className="font-black">{t.label}</span>
                                            <span className="text-[9px] opacity-60">{t.sub}</span>
                                            {formData.type === t.id && (
                                                <CheckCircle2 size={12} className="mt-0.5" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* الكمية والحد الأقصى */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* الكمية — إجباري */}
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground flex items-center gap-2">
                                        <Hash size={16} className="text-primary" />
                                        <span>
                                            الكمية
                                            <span className="text-destructive mr-1">*</span>
                                        </span>
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 });
                                            if (errors.quantity) setErrors({ ...errors, quantity: "" });
                                        }}
                                        className={cn(
                                            "h-12 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold",
                                            errors.quantity && "border-destructive/50 ring-destructive/20"
                                        )}
                                    />
                                    {errors.quantity && (
                                        <p className="text-xs font-bold text-destructive">{errors.quantity}</p>
                                    )}
                                </div>

                                {/* الحد الأقصى — اختياري */}
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground flex items-center gap-2">
                                        <AlertCircle size={16} className="text-primary" />
                                        <span>
                                            الحد الأقصى
                                            <span className="text-destructive mr-1">*</span>
                                        </span>
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.max}
                                        onChange={(e) => {
                                            setFormData({ ...formData, max: e.target.value });
                                            if (errors.max) setErrors({ ...errors, max: "" });
                                        }}
                                        placeholder="مثال: 500"
                                        className={cn(
                                            "h-12 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold",
                                            errors.max && "border-destructive/50 ring-destructive/20"
                                        )}
                                    />
                                    {errors.max && (
                                        <p className="text-[10px] font-bold text-destructive">{errors.max}</p>
                                    )}
                                </div>
                            </div>

                            {/* السعر — اختياري */}
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground flex items-center gap-2">
                                    <DollarSign size={16} className="text-primary" />
                                    <span>
                                        السعر
                                        <span className="text-muted-foreground text-[10px] mr-1 font-medium">(اختياري)</span>
                                    </span>
                                </label>
                                <Input
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="مثال: 50.00"
                                    className="h-12 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                            <button
                                onClick={handleClose}
                                type="button"
                                className="px-6 py-3 text-sm font-black text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl transition-all cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSave}
                                type="button"
                                disabled={isLoading || !storageId}
                                className="px-8 py-3 text-sm font-black text-white bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <span>جاري الإضافة...</span>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        <span>إضافة للمخزن</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Hash, Layers, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { id: "meds", name: "أدوية" },
    { id: "tools", name: "مستلزمات" },
    { id: "supplies", name: "مضادات حيوية" },
    { id: "other", name: "أخرى" },
];

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        category: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    function handleValidateModal() {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "يرجى إدخال اسم الصنف";
        }

        if (!formData.quantity || Number(formData.quantity) <= 0) {
            newErrors.quantity = "يرجى إدخال كمية صالحة";
        }

        if (!formData.category) {
            newErrors.category = "يرجى اختيار فئة";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("بيانات غير مكتملة", {
                description: "يرجى إكمال الحقول المطلوبة بشكل صحيح.",
                className: "font-sans",
            });
            return;
        }

        // Success logic
        setShowSuccess(true);
        toast.success("تمت الإضافة بنجاح!", {
            description: `تمت إضافة ${formData.name} إلى المخزون`,
            className: "font-sans",
        });

        setTimeout(() => {
            handleClose();
        }, 2200);
    }

    const handleClose = () => {
        setFormData({
            name: "",
            quantity: "",
            category: "",
        });
        setErrors({});
        setShowSuccess(false);
        onClose();
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 cursor-default">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden z-10 min-h-[400px] flex flex-col"
                    >
                        <AnimatePresence mode="wait">
                            {!showSuccess ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Header Section */}
                                    <div className="p-6 border-b border-border/50 bg-linear-to-br from-primary/5 to-transparent relative">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                                <Plus size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-foreground tracking-tight">إضافة صنف جديد</h2>
                                                <p className="text-xs text-muted-foreground font-bold opacity-70">أدخل تفاصيل الصنف لإضافته للمخزون</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Form Body */}
                                    <div className="p-8 space-y-6 overflow-y-auto">
                                        {/* Item Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                <Package size={14} className="text-primary" />
                                                <span>اسم الصنف</span>
                                            </label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, name: e.target.value });
                                                    if (errors.name) setErrors({ ...errors, name: "" });
                                                }}
                                                placeholder="مثال: باراسيتامول 500 ملجم"
                                                className={cn(
                                                    "h-12 rounded-2xl bg-muted/20 border-border/30 focus:bg-background transition-colors font-bold placeholder:font-medium placeholder:opacity-50",
                                                    errors.name && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                                                )}
                                            />
                                            {errors.name && (
                                                <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                                    <AlertCircle size={10} />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Quantity */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                    <Hash size={14} className="text-primary" />
                                                    <span>الكمية</span>
                                                </label>
                                                <Input
                                                    value={formData.quantity}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, quantity: e.target.value });
                                                        if (errors.quantity) setErrors({ ...errors, quantity: "" });
                                                    }}
                                                    type="number"
                                                    placeholder="0"
                                                    className={cn(
                                                        "h-12 rounded-2xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold",
                                                        errors.quantity && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                                                    )}
                                                />
                                                {errors.quantity && (
                                                    <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                                        <AlertCircle size={10} />
                                                        {errors.quantity}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Category Dropdown */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                    <Layers size={14} className="text-primary" />
                                                    <span>الفئة</span>
                                                </label>
                                                <div className="relative group">
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, category: e.target.value });
                                                            if (errors.category) setErrors({ ...errors, category: "" });
                                                        }}
                                                        className={cn(
                                                            "w-full h-12 rounded-2xl bg-muted/20 border border-border/30 focus:bg-background transition-colors font-bold px-4 appearance-none outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm",
                                                            errors.category && "border-destructive/50 focus:ring-destructive/20 focus:border-destructive"
                                                        )}>
                                                        <option value="" disabled>اختر الفئة...</option>
                                                        {CATEGORIES.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                        <Layers size={14} />
                                                    </div>
                                                </div>
                                                {errors.category && (
                                                    <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                                        <AlertCircle size={10} />
                                                        {errors.category}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3 mt-auto">
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-3 text-sm font-black text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl transition-all cursor-pointer font-sans"
                                            type="button"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            onClick={handleValidateModal}
                                            className="px-8 py-3 text-sm font-black text-white bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2 font-sans"
                                            type="button"
                                        >
                                            <Plus size={18} />
                                            <span>إضافة للمخزون</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center p-12 text-center h-full grow space-y-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.5, ease: "backOut" }}
                                        className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success border-4 border-success/20 shadow-lg shadow-success/10"
                                    >
                                        <CheckCircle2 size={56} strokeWidth={2.5} />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <motion.h3
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-2xl font-black text-foreground"
                                        >
                                            تمت الإضافة بنجاح!
                                        </motion.h3>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-muted-foreground font-bold"
                                        >
                                            تم تحديث المخزون وإضافة الصنف الجديد بنجاح.
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                        className="h-1.5 bg-success/20 rounded-full overflow-hidden w-48 mt-4"
                                    >
                                        <div className="h-full bg-success w-full origin-right" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

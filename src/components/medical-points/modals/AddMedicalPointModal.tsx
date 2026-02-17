"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, User, Plus, Image as ImageIcon, AlertCircle, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddMedicalPointModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMedicalPointModal({ isOpen, onClose }: AddMedicalPointModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        manager: "",
        image: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    function handleValidateModal() {
        const newErrors: { [key: string]: string } = {};

        // Comprehensive validation
        if (!formData.name.trim()) {
            newErrors.name = "اسم النقطة الطبية مطلوب";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
        }

        if (!formData.location.trim()) {
            newErrors.location = "يجب تحديد الموقع الجغرافي";
        }

        if (!formData.manager.trim()) {
            newErrors.manager = "يرجى تحديد اسم المسؤول";
        }

        if (!formData.image.trim()) {
            newErrors.image = "يرجى إرفاق صورة (رابط أو ملف)";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("بيانات غير مكتملة", {
                description: "يرجى تصحيح الأخطاء قبل المتابعة.",
                className: "font-sans",
            });
            return; // EXIT WITHOUT CLOSING
        }

        // Show Success Alert State
        setShowSuccess(true);
        toast.success("تمت العملية بنجاح", {
            description: "تم تحديث قاعدة بيانات النظام للادمن",
            className: "font-sans",
        });

        // Close after delay
        setTimeout(() => {
            handleClose();
        }, 2200);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error("حجم الملف كبير جداً", {
                    description: "يجب أن يكون حجم الصورة أقل من 2 ميجابايت",
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
                setErrors({ ...errors, image: "" });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Reset errors and form on close
    const handleClose = () => {
        setShowSuccess(false);
        setErrors({});
        setFormData({
            name: "",
            location: "",
            manager: "",
            image: "",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
    };

    // Close on Escape key
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
                                                <Building2 size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-foreground tracking-tight">إضافة نقطة طبية</h2>
                                                <p className="text-xs text-muted-foreground font-bold opacity-70">أدخل البيانات بعناية لإنشاء النقطة</p>
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
                                    <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {/* Image Selection Section */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                <ImageIcon size={14} className="text-primary" />
                                                <span>صورة النقطة الطبية</span>
                                            </label>

                                            <div className="flex flex-col gap-4">
                                                {/* Preview Area */}
                                                <div className={cn(
                                                    "relative w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden group/img",
                                                    formData.image ? "border-primary/30 bg-muted/10" : "border-border/50 bg-muted/20 hover:border-primary/20",
                                                    errors.image && "border-destructive/30 bg-destructive/5"
                                                )}>
                                                    {formData.image ? (
                                                        <>
                                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                                <button
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-all text-white font-sans"
                                                                    type="button"
                                                                >
                                                                    <Upload size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={removeImage}
                                                                    className="p-2 bg-destructive/80 hover:bg-destructive rounded-full backdrop-blur-md transition-all text-white font-sans"
                                                                    type="button"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="text-center p-4 w-full h-full flex flex-col items-center justify-center transition-all"
                                                            type="button"
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                                <Upload size={24} className="text-primary/60" />
                                                            </div>
                                                            <p className="text-xs text-muted-foreground/60 font-bold">اضغط لرفع صورة من الجهاز</p>
                                                            <p className="text-[10px] text-muted-foreground/40 mt-1">أو ضع رابطاً في الأسفل</p>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* URL Input */}
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <Input
                                                            value={formData.image.startsWith('data:') ? 'صورة مرفوعة من الجهاز' : formData.image}
                                                            disabled={formData.image.startsWith('data:')}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, image: e.target.value });
                                                                if (errors.image) setErrors({ ...errors, image: "" });
                                                            }}
                                                            placeholder="أو الصق رابط الصورة (URL) هنا..."
                                                            className={cn(
                                                                "h-11 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold text-[10px]",
                                                                errors.image && "border-destructive/50 ring-destructive/20"
                                                            )}
                                                        />
                                                        {formData.image && (
                                                            <button
                                                                onClick={removeImage}
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
                                                                type="button"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {errors.image && (
                                                        <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                                            <AlertCircle size={10} />
                                                            {errors.image}
                                                        </p>
                                                    )}
                                                </div>

                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>

                                        {/* Point Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                <Building2 size={14} className="text-primary" />
                                                <span>اسم النقطة الطبية</span>
                                            </label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, name: e.target.value });
                                                    if (errors.name) setErrors({ ...errors, name: "" });
                                                }}
                                                placeholder="مثال: مركز الشفاء الطبي"
                                                className={cn(
                                                    "h-12 rounded-2xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold placeholder:font-medium placeholder:opacity-50",
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Manager Name */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                    <User size={14} className="text-primary" />
                                                    <span>اسم المسؤول</span>
                                                </label>
                                                <Input
                                                    value={formData.manager}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, manager: e.target.value });
                                                        if (errors.manager) setErrors({ ...errors, manager: "" });
                                                    }}
                                                    placeholder="د. محمد حسن"
                                                    className={cn(
                                                        "h-12 rounded-2xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold",
                                                        errors.manager && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                                                    )}
                                                />
                                                {errors.manager && (
                                                    <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                                        <AlertCircle size={10} />
                                                        {errors.manager}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Location */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-muted-foreground flex items-center gap-2">
                                                    <MapPin size={14} className="text-primary" />
                                                    <span>الموقع</span>
                                                </label>
                                                <Input
                                                    value={formData.location}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, location: e.target.value });
                                                        if (errors.location) setErrors({ ...errors, location: "" });
                                                    }}
                                                    placeholder="مثال: الرياض - حي النرجس"
                                                    className={cn(
                                                        "h-12 rounded-2xl bg-muted/20 border-border/30 focus:bg-background transition-all font-bold",
                                                        errors.location && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                                                    )}
                                                />
                                                {errors.location && (
                                                    <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                                        <AlertCircle size={10} />
                                                        {errors.location}
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
                                            <span>إضافة النقطة</span>
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
                                            قام النظام بتسجيل النقطة الطبية بنجاح للادمن.
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

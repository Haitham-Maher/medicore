"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Tag, Hash, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";

interface EditInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onSave: (updatedItem: any) => void;
    isLoading?: boolean;
}

export default function EditInventoryModal({
    isOpen,
    onClose,
    item,
    onSave,
    isLoading = false
}: EditInventoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        quantity: 0,
        max: 0,
        price: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen && item) {
            setFormData({
                name: item.name,
                type: item.type,
                quantity: item.quantity,
                max: item.max,
                price: item.price,
            });
            setErrors({});
        }
    }, [isOpen, item]);

    const handleSave = () => {
        const newErrors: { [key: string]: string } = {};

        if (formData.quantity < 0) newErrors.quantity = "الكمية لا يمكن أن تكون سالبة";
        if (formData.quantity === undefined || formData.quantity === null) newErrors.quantity = "الكمية مطلوبة";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // PUT /storage/items/{id} يطلب: quantity, max, storage_id
        onSave({
            id:         item?.id,
            storage_id: item?.storage_id,  // يُمرَّر من InventoryTable
            quantity:   formData.quantity,
            max:        formData.max,
            // الحقول الأخرى للعرض فقط
            name:       item?.name,
            type:       item?.type,
            price:      item?.price,
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
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
                                    <Package size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-foreground tracking-tight">تعديل بيانات الصنف</h2>
                                    <p className="text-xs text-muted-foreground font-bold opacity-70">
                                        تحديث معلومات الصنف في المخزن
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Display Item Info */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Package size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">الصنف المختار</p>
                                    <h3 className="font-black text-foreground truncate tracking-tight">{item?.name}</h3>
                                </div>
                            </div>

                            {/* Quantity and Max Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Quantity Input */}
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-foreground flex items-center gap-2">
                                        <Hash size={16} className="text-primary" />
                                        <span>الكمية</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                        className={cn(
                                            "h-12 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-black text-center",
                                            errors.quantity && "border-destructive/50 ring-destructive/20"
                                        )}
                                    />
                                    {errors.quantity && <p className="text-[10px] font-bold text-destructive text-center">{errors.quantity}</p>}
                                </div>

                                {/* Max Input */}
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-foreground flex items-center gap-2">
                                        <AlertCircle size={16} className="text-primary" />
                                        <span>الحد الأقصى</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.max}
                                        onChange={(e) => setFormData({ ...formData, max: parseInt(e.target.value) || 0 })}
                                        className="h-12 rounded-xl bg-muted/20 border-border/30 focus:bg-background transition-all font-black text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 text-sm font-black text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-2xl transition-all cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-8 py-3 text-sm font-black text-white bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
                            >
                                {isLoading ? "جاري الحفظ..." : <CheckCircle2 size={18} />}
                                <span>تحديث الكمية</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Search, Package, Hash, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Input, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface MedicineItem {
    medicine_id: number;
    name: string;
    quantity: number;
    available_stock?: number;
    max: number;
}

interface AddSupplyRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { description: string; medicines: { medicine_id: number; quantity: number; max: number }[] }) => void;
    isLoading?: boolean;
}

export default function AddSupplyRequestModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: AddSupplyRequestModalProps) {
    const [description, setDescription] = useState("");
    const [selectedMedicines, setSelectedMedicines] = useState<MedicineItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // جلب قائمة الأدوية المتاحة في المخزن المركزي للطلب منها
    const { data: medicinesResponse, isLoading: isFetchingMedicines } = useQuery({
        queryKey: ["available-storage-medicine"],
        queryFn: async () => {
            const res = await api.get("/point-manager/available-storage-medicine");
            return res.data;
        },
        enabled: isOpen
    });

    const availableMedicines = medicinesResponse?.medicines || [];

    // تصفية الأدوية بناءً على البحث
    const filteredMedicines = availableMedicines.filter((med: any) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedMedicines.some(selected => selected.medicine_id === med.id)
    );

    const addMedicine = (med: any) => {
        setSelectedMedicines([
            ...selectedMedicines,
            {
                medicine_id: med.id,
                name: med.name,
                quantity: 1,
                available_stock: med.available_stock,
                max: med.pivot?.max || 0
            }
        ]);
        setSearchTerm("");
    };

    const removeMedicine = (id: number) => {
        setSelectedMedicines(selectedMedicines.filter(m => m.medicine_id !== id));
    };

    const updateQuantity = (id: number, qty: number) => {
        setSelectedMedicines(
            selectedMedicines.map(m =>
                m.medicine_id === id ? { ...m, quantity: Math.max(1, qty) } : m
            )
        );
    };

    const handleSave = () => {
        if (selectedMedicines.length === 0) return;
        onSave({
            description,
            medicines: selectedMedicines.map(({ medicine_id, quantity, max }) => ({
                medicine_id,
                quantity,
                max
            }))
        });
    };

    const handleClose = () => {
        setDescription("");
        setSelectedMedicines([]);
        setSearchTerm("");
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
                        className="relative w-full max-w-2xl bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border/50 bg-linear-to-br from-primary/5 to-transparent relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Plus size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-foreground tracking-tight">إنشاء طلب إمداد جديد</h2>
                                    <p className="text-xs text-muted-foreground font-bold opacity-70">
                                        طلب أدوية ومستلزمات من المخزن المركزي للمنطقة
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
                        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">

                            {/* Medicine Search */}
                            {/* Medicine Selection Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-black text-foreground flex items-center gap-2">
                                    <Search size={16} className="text-primary" />
                                    <span>اختر الأدوية المطلوبة من القائمة</span>
                                </label>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <Input
                                            placeholder="بحث في قائمة الأدوية المتوفرة..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-11 rounded-xl bg-muted/20 border-border/30 focus:bg-background pr-10"
                                        />
                                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    </div>

                                    <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden shadow-inner">
                                        <div className="max-h-52 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                            {isFetchingMedicines ? (
                                                <div className="py-10 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-[10px] font-bold">جاري تحميل الأدوية...</span>
                                                </div>
                                            ) : filteredMedicines.length > 0 ? (
                                                filteredMedicines.map((med: any) => (
                                                    <button
                                                        key={med.id}
                                                        onClick={() => addMedicine(med)}
                                                        className="w-full px-3 py-2.5 text-right hover:bg-primary/10 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                                <Package size={14} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-[13px]">{med.name}</span>
                                                                <span className="text-[10px] text-muted-foreground font-medium">المخزون المتاح: {med.available_stock}</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-7 h-7 rounded-lg border border-border group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                                                            <Plus size={14} className="text-muted-foreground group-hover:text-primary" />
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="py-10 text-center text-muted-foreground text-xs font-bold italic flex flex-col items-center gap-2">
                                                    <AlertCircle size={24} className="opacity-20" />
                                                    <span>لا توجد نتائج مطابقة أو تم اختيار كافة الأدوية المتاحة</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Medicines List */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-foreground flex items-center gap-2">
                                    <Package size={16} className="text-primary" />
                                    <span>الأصناف المختارة ({selectedMedicines.length})</span>
                                </label>

                                {selectedMedicines.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedMedicines.map((item) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={item.medicine_id}
                                                className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="font-black text-sm">{item.name}</span>
                                                        <span className="text-[10px] text-muted-foreground">متوفر في المخزن: {item.available_stock}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-[10px] font-black text-muted-foreground">الكمية:</label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.medicine_id, parseInt(e.target.value) || 1)}
                                                            className="w-20 h-9 rounded-lg bg-background border-border/50 text-center font-bold"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeMedicine(item.medicine_id)}
                                                        className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-all cursor-pointer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3">
                                        <AlertCircle size={32} className="opacity-20" />
                                        <p className="text-xs font-bold">لم يتم اختيار أي أصناف بعد</p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-foreground flex items-center gap-2">
                                    <MessageSquare size={16} className="text-primary" />
                                    <span>ملاحظات الطلب (اختياري)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="اكتب أي ملاحظات إضافية بخصوص هذا الطلب..."
                                    className="w-full min-h-24 p-4 rounded-2xl bg-muted/20 border border-border/30 focus:border-primary/50 focus:bg-background transition-all outline-none text-sm font-medium resize-none"
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
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || selectedMedicines.length === 0}
                                className="px-10 py-3 text-sm font-black text-white bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <span>جاري الإرسال...</span>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        <span>إرسال الطلب</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

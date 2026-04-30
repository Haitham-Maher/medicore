"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2, XCircle } from "lucide-react";

import api from "@/api/axios";
import { cn } from "@/lib/utils"; // تأكد من المسار الصحيح لديك
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryToolbar from "./components/InventoryToolbar";
import InventoryCategoryFilters from "./components/InventoryCategoryFilters";
import InventoryDesktopTable from "./components/InventoryDesktopTable";
import InventoryMobileList from "./components/InventoryMobileList";
import { InventoryItem } from "./types";
import EditInventoryModal from "./components/EditInventoryModal";

// ----------------------------------------------------------------------
// دوال التنبيهات (Toasts)
// ----------------------------------------------------------------------

const showDeleteSuccessToast = () => {
    const durationMs = 3000;
    toast.custom((t) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative overflow-hidden bg-card border border-emerald-500/20 shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px] w-full"
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-inner bg-emerald-500/10 text-emerald-600">
                <Trash2 className="w-5 h-5" />
            </div>

            <div className="flex-1 pt-0.5">
                <h4 className="text-sm font-bold text-foreground">
                    تم الحذف بنجاح
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    تمت إزالة الصنف من المخزن وتحديث السجلات نهائياً.
                </p>
            </div>

            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: durationMs / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-emerald-500"
            />
        </motion.div>
    ), { duration: durationMs });
};

const showDeleteErrorToast = () => {
    const durationMs = 5000;
    toast.custom((t) => (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden bg-card border border-destructive/20 shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px] w-full"
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 text-destructive shrink-0">
                <XCircle className="w-6 h-6" />
            </div>

            <div className="flex-1 pt-0.5">
                <h4 className="text-sm font-bold text-foreground">فشل الحذف!</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    حدث خطأ أثناء التواصل مع الخادم. تم التراجع عن العملية وإعادة الصنف للجدول.
                </p>
            </div>

            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: durationMs / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-destructive"
            />
        </motion.div>
    ), { duration: durationMs });
};

// ----------------------------------------------------------------------
// المكون الأساسي (Main Component)
// ----------------------------------------------------------------------

interface InventoryTableProps {
    isAdmin?: boolean;
}

export default function InventoryTable({ isAdmin = true }: InventoryTableProps) {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    // جلب البيانات بناءً على الدور
    const { data: response, isLoading } = useQuery({
        queryKey: ["Inventory-Table", isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? "/inventory/items" : "/point-manager/inventory";
            const table = await api.get(endpoint);
            return table.data;
        }
    });

    // تحويل البيانات لتتوافق مع واجهة المستخدم
    const inventoryData: InventoryItem[] = isAdmin 
        ? (response?.data || []).flatMap((medicine: any) => {
            // إذا لم تكن هناك صيدليات مرتبطة، نعرض الدواء بكمية صفر
            if (!medicine.pharmacies || medicine.pharmacies.length === 0) {
                return [{
                    ...medicine,
                    quantity: 0,
                    storage_id: null,
                    storage_name: "غير متوفر في أي مخزن"
                }];
            }

            // إنشاء سطر لكل صيدلية يوجد فيها الدواء
            return medicine.pharmacies.map((pharmacy: any) => ({
                ...medicine,
                id: medicine.id,
                quantity: pharmacy.quantity,
                storage_id: pharmacy.pharmacy_id,
                storage_name: `صيدلية #${pharmacy.pharmacy_id}`
            }));
        })
        : (response?.data || []).map((item: any) => ({
            ...item,
            storage_name: "المخزن الحالي" // للمدير نستخدم اسم افتراضي
        }));

    // إعداد دالة الحذف
    const deleteMutation = useMutation({
        mutationFn: async (id: number | string) => {
            await api.delete(`/inventory/items/${id}`);
        },
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: ["Inventory-Table"] });
            const previousData = queryClient.getQueryData(["Inventory-Table"]);
            queryClient.setQueryData(["Inventory-Table"], (oldData: any) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((item: InventoryItem) => item.id !== deletedId)
                };
            });
            return { previousData };
        },
        onSuccess: () => {
            showDeleteSuccessToast();
        },
        onError: (err, deletedId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["Inventory-Table"], context.previousData);
            }
            showDeleteErrorToast();
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["Inventory-Table"] });
        }
    });

    // إعداد دالة التعديل
    const editMutation = useMutation({
        mutationFn: async (updatedItem: any) => {
            // اللارافل يتوقع pharmacy_id و quantity
            // نأخذ الـ pharmacy_id من أول صيدلية مرتبطة بالدواء إذا لم يكن موجوداً مباشرة
            const pharmacyId = updatedItem.pharmacy_id || (updatedItem.pharmacies && updatedItem.pharmacies[0]?.pharmacy_id);
            
            const payload = {
                quantity: updatedItem.quantity,
                pharmacy_id: pharmacyId
            };
            
            const res = await api.put(`/inventory/items/${updatedItem.id}`, payload);
            return res.data;
        },
        onSuccess: (data, updatedItem) => {
            // تحديث البيانات يدوياً في الكاش (التحديث داخل مصفوفة الصيدليات المتداخلة)
            queryClient.setQueryData(["Inventory-Table"], (oldData: any) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((medicine: any) => {
                        if (medicine.id === updatedItem.id) {
                            return {
                                ...medicine,
                                pharmacies: medicine.pharmacies?.map((p: any) => 
                                    p.pharmacy_id === (updatedItem.storage_id || updatedItem.pharmacy_id)
                                        ? { ...p, quantity: updatedItem.quantity } 
                                        : p
                                )
                            };
                        }
                        return medicine;
                    })
                };
            });

            toast.success("تم تحديث الصنف بنجاح", {
                description: "تم حفظ التغييرات وتحديث المخزون.",
            });
            setIsEditModalOpen(false);
        },
        onError: (error: any) => {
            toast.error("فشل التحديث", {
                description: error?.response?.data?.message || "حدث خطأ أثناء تعديل الصنف.",
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["Inventory-Table"] });
        }
    });

    const handleDelete = (id: number | string) => {
        deleteMutation.mutate(id);
    };

    const handleEdit = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const categories = ["الكل", "tablet", "syrup", "Ointment", "Capsule", "injection"];

    if (isLoading) return <InventoryTableSkeleton />;

    const filteredData = inventoryData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "الكل" || item.type === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-4">
            <InventoryToolbar search={search} setSearch={setSearch} />

            <InventoryCategoryFilters
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                inventoryData={inventoryData}
            />

            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
                <div className="hidden sm:block">
                    <InventoryDesktopTable
                        data={filteredData}
                        selectedCategory={selectedCategory}
                        search={search}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isAdmin={isAdmin}
                    />
                </div>

                <div className="sm:hidden">
                    <InventoryMobileList
                        data={filteredData}
                        selectedCategory={selectedCategory}
                        search={search}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>

            <EditInventoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                item={selectedItem}
                onSave={(updatedData) => editMutation.mutate(updatedData)}
                isLoading={editMutation.isPending}
            />
        </div>
    );
}
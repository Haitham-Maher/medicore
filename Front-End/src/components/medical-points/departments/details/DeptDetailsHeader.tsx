"use client";

import { Star, Edit, Trash2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import AddMedicalPointModal from "../../modals/AddMedicalPointModal";

interface DeptDetailsHeaderProps {
    name: string;
    icon: LucideIcon;
    color: string;
    image: string;
    rating: number;
    location?: string;
    manager?: string;
    isLoading?: boolean;
}

export default function DeptDetailsHeader({
    name,
    icon: Icon,
    color,
    image,
    rating,
    location = "الطابق الثاني - الجناح أ",
    manager = "د. سارة الأحمد",
    isLoading = false
}: DeptDetailsHeaderProps) {
    if (isLoading) {
        return (
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-muted animate-pulse">
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
                        <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
                        <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
                    </div>
                    <div className="h-10 w-64 bg-muted-foreground/20 rounded-lg" />
                    <div className="h-5 w-48 bg-muted-foreground/20 rounded-lg" />
                </div>
            </div>
        );
    }

    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false)


    const handleDelete = async () => {
        setIsDeleting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        router.back();
    };

    return (
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border",
                            color
                        )}>
                            <Icon size={22} />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-green-500/20 text-green-400 border-green-500/30">
                            نشط
                        </span>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 backdrop-blur-md text-xs font-bold">
                            {rating} <Star size={12} className="fill-current" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white">{name}</h1>

                    <p className="text-sm md:text-base text-gray-300">إدارة القسم والموظفين</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 p-2.5 rounded-xl transition-all cursor-pointer">
                        <Edit size={20} />
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 backdrop-blur-md border border-red-500/30 p-2.5 rounded-xl transition-all cursor-pointer"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmation
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="حذف القسم"
                    description={`هل أنت متأكد من رغبتك في حذف "${name}"؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة بالقسم.`}
                    isLoading={isDeleting}
                    confirmText="نعم، احذف القسم"
                    cancelText="إلغاء"
                />
            )}

            <AddMedicalPointModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                isAdmin={false}
                initialData={{
                    name,
                    location,
                    manager,
                    image
                }}
            />
        </div>
    );
}

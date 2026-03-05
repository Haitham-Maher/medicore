"use client";

import {
    ShieldCheck,
    UserCheck,
    CreditCard,
    Phone,
    Mail,
    Star,
    Trash2,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import ManagerSectionSkeleton from "../../skeletons/ManagerSectionSkeleton";

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

interface DeptHeadProfileProps {
    isLoading?: boolean;
    head: {
        name: string;           // persons.name
        specialization: string;
        rating: number;         // department_managers.rating
        image: string;
        email: string;          // users.email
        phone: string;          // persons.phone_number
    };
}

export default function DeptHeadProfile({
    isLoading = false,
    head,
}: DeptHeadProfileProps) {
    if (isLoading) return <ManagerSectionSkeleton />;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        console.log("Head deleted");
    };

    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: .3 }}
            variants={itemVariants}
            className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm relative group"
        >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

            <div className="p-6 flex flex-col gap-8 items-center md:items-start relative md:flex-row">
                {/* Image */}
                <div className="relative shrink-0">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-background shadow-lg group-hover:rotate-2 transition-transform duration-500">
                        <img
                            src={head.image}
                            alt={head.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-success text-success-foreground p-1.5 rounded-lg shadow-lg border-2 border-background">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 text-center md:text-right w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h3 className="text-xl font-black text-foreground">{head.name}</h3>
                                <UserCheck size={18} className="text-primary hidden md:block" />
                            </div>
                            <p className="text-primary font-bold text-sm tracking-wide">{head.specialization}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center md:justify-end gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
                                <CreditCard size={16} className="text-muted-foreground" />
                                <span className="text-xs font-mono font-bold text-foreground opacity-80">
                                    رئيس القسم
                                </span>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                                title="حذف رئيس القسم"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Phone size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">رقم الجوال</p>
                                <p className="text-xs font-bold text-foreground">{head.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Mail size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">البريد الإلكتروني</p>
                                <p className="text-xs font-bold text-foreground">{head.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Star size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">التقييم</p>
                                <p className="text-xs font-bold text-foreground">{head.rating} / 5.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="حذف رئيس القسم"
                description={`هل أنت متأكد من رغبتك في حذف "${head.name}" من رئاسة هذا القسم؟`}
                isLoading={isDeleting}
                confirmText="حذف الرئيس"
            />
        </motion.div>
    );
}

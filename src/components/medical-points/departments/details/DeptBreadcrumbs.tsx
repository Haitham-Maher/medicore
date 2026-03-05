"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui";

interface DeptBreadcrumbsProps {
    clinicId: string;
    departmentName: string;
    isLoading: boolean;
    isAdmin?: boolean;
}

export default function DeptBreadcrumbs({
    clinicId,
    departmentName,
    isLoading,
    isAdmin = true,
}: DeptBreadcrumbsProps) {
    const basePath = isAdmin ? "/admin" : "/manager";
    const medicalPointsLabel = isAdmin ? "النقاط الطبية" : "الأقسام الطبية";
    const medicalPointsPath = isAdmin ? "/admin/medical-points" : "/manager/departments";
    const clinicDetailsPath = isAdmin ? `/admin/medical-points/clinics/${clinicId}` : `/manager/departments/${clinicId}`;

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={medicalPointsPath} className="hover:text-primary transition-colors">
                {medicalPointsLabel}
            </Link>
            <ArrowLeft size={14} />
            <Link href={clinicDetailsPath} className="hover:text-primary transition-colors">
                تفاصيل النقطة
            </Link>
            <ArrowLeft size={14} />
            <span className="text-foreground font-medium">
                {isLoading ? (
                    <Skeleton className="h-4 w-32 inline-block" />
                ) : (
                    departmentName
                )}
            </span>
        </div>
    );
}

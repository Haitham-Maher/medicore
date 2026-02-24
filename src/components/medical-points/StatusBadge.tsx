"use client";

export function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "active":
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
                    نشط
                </span>
            );
        case "inactive":
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border w-16">
                    غير نشط
                </span>
            );
        case "maintenance":
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/20">
                    صيانة
                </span>
            );
        default:
            return null;
    }
}

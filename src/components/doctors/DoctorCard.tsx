import { Star, Trash2, MapPin, Building2, Stethoscope, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctorCardProps {
    person: {
        id: string;
        name: string;
        role: string;
        pointName: string;
        image: string;
        rating: number;
        phone: string;
        department?: string;
        specialize?: string;
    };
    type: "point-head" | "dept-head" | "doctor";
    index: number;
    onDelete: (person: any) => void;
    isAdmin?: boolean;
    view?: "grid" | "list";
}

function RatingBadge({ rating, reviews = 45 }: { rating: number, reviews?: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-lg border border-orange-500/20">
                <span className="text-xs font-black">{rating}</span>
                <Star size={11} className="fill-orange-400 text-orange-400" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold">{reviews} مريض</span>
        </div>
    );
}

export default function DoctorCard({ person, type, index, onDelete, isAdmin = true, view = "grid" }: DoctorCardProps) {
    const showDelete = isAdmin ? type !== "doctor" : true;
    const roleBadgeColor =
        type === "point-head"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : type === "dept-head"
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                : "bg-purple-500/10 text-purple-600 border-purple-500/20";

    const roleLabel =
        type === "point-head"
            ? "رئيس نقطة"
            : type === "dept-head"
                ? "رئيس قسم"
                : "طبيب";

    const getInitials = (name: string) => {
        const cleanName = name.replace(/^(د\.|م\.)\s+/, "");
        return cleanName.charAt(0);
    };

    if (view === "list") {
        return (
            <div className="p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4 hover:bg-muted/30 transition-all group relative overflow-hidden">
                {/* Avatar */}
                <div className="shrink-0 pt-1 sm:pt-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border-2 border-background shadow-md overflow-hidden bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                        {person.image ? (
                            <img src={person.image} alt={person.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-primary font-black text-sm sm:text-lg">
                                {getInitials(person.name)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                            <h4 className="font-black text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                                {person.name}
                            </h4>
                            <span className={cn(
                                "text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full border font-black shrink-0",
                                index % 2 === 0
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            )}>
                                {index % 2 === 0 ? "متاح" : "مشغول"}
                            </span>
                        </div>
                        {/* Rating for mobile (compact) */}
                        <div className="flex sm:hidden items-center gap-1.5">
                            <div className="flex items-center gap-0.5 text-amber-500">
                                <Star size={10} className="fill-amber-400" />
                                <span className="text-[10px] font-black">{person.rating}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold opacity-80">
                            {person.specialize || person.role}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {/* Phone Number */}
                            <div className="flex items-center gap-1.5 shrink-0 opacity-70">
                                <Phone size={10} className="text-primary/70 sm:size-3" />
                                <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground font-bold" dir="ltr">{person.phone}</span>
                            </div>

                            <p className="text-[9px] sm:text-[10px] text-primary/70 font-black">
                                {person.department ? `قسم ${person.department}` : person.pointName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rating & Actions Desktop */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shrink-0">
                    {/* Rating - Desktop Only */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg border border-border/50">
                        <span className="text-xs font-black text-foreground">{person.rating}</span>
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-[9px] text-muted-foreground font-bold hidden md:inline">({32 + index} مريض)</span>
                    </div>

                    {/* Actions */}
                    {showDelete && (
                        <button
                            onClick={() => onDelete(person)}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500 transition-all shadow-xs cursor-pointer active:scale-90"
                            title="حذف"
                        >
                            <Trash2 className="size-3.5 sm:size-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="shrink-0">
                            <img
                                src={person.image}
                                alt={person.name}
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-border/50 group-hover:border-primary/30 transition-all shadow-sm"
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="flex min-w-0 flex-col gap-1">
                                <h3 className="font-black text-base text-foreground truncate">{person.name}</h3>
                                <RatingBadge rating={person.rating} />
                            </div>
                        </div>
                    </div>

                    {showDelete && (
                        <button
                            onClick={() => onDelete(person)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all cursor-pointer shrink-0"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>

                <div className="mb-5">
                    <span className={cn("inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-widest", roleBadgeColor)}>
                        {roleLabel}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-bold">
                        <MapPin size={14} className="shrink-0 text-primary" />
                        <span className="truncate">{person.pointName}</span>
                    </div>

                    {person.department && (
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-bold">
                            <Building2 size={14} className="shrink-0 text-primary" />
                            <span className="truncate">قسم {person.department}</span>
                        </div>
                    )}

                    {person.specialize && (
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-bold">
                            <Stethoscope size={14} className="shrink-0 text-primary" />
                            <span className="truncate">{person.specialize}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-border/50 bg-muted/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={13} className="text-primary" />
                    <span className="font-mono text-[11px] font-bold" dir="ltr">{person.phone}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="متاح الآن" />
            </div>
        </div>
    );
}

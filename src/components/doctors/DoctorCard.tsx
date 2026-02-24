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
}

function RatingBadge({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-lg border border-orange-500/20">
            <span className="text-xs font-black">{rating}</span>
            <Star size={11} className="fill-orange-400 text-orange-400" />
        </div>
    );
}

export default function DoctorCard({ person, type, index, onDelete }: DoctorCardProps) {
    const showDelete = type !== "doctor";
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

    return (
        <div
            className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0">
                            <img
                                src={person.image}
                                alt={person.name}
                                className="w-14 h-14 rounded-xl object-cover border-2 border-border/50 group-hover:border-primary/30 transition-colors"
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-sm text-foreground truncate">{person.name}</h3>
                                <RatingBadge rating={person.rating} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{person.role}</p>
                        </div>
                    </div>

                    {showDelete && (
                        <button
                            onClick={() => onDelete(person)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all cursor-pointer shrink-0"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>

                <div className="mb-4">
                    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider", roleBadgeColor)}>
                        {roleLabel}
                    </span>
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={13} className="shrink-0 text-primary/60" />
                        <span className="truncate">{person.pointName}</span>
                    </div>

                    {person.department && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 size={13} className="shrink-0 text-primary/60" />
                            <span className="truncate">قسم {person.department}</span>
                        </div>
                    )}

                    {person.specialize && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Stethoscope size={13} className="shrink-0 text-primary/60" />
                            <span className="truncate">{person.specialize}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-border/50 bg-muted/20 px-5 py-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone size={12} />
                <span className="font-mono text-[11px]" dir="ltr">{person.phone}</span>
            </div>
        </div>
    );
}

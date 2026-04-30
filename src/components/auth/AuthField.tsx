"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps {
    label: string;
    id: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    icon?: React.ElementType;
    error?: string;
    disabled?: boolean;
}

export function AuthField({ label, id, type = "text", placeholder, value, onChange, icon: Icon, error, disabled }: FieldProps) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    return (
        <div className="flex flex-col gap-3">
            <label htmlFor={id} className="text-sm font-bold text-foreground/80">{label}</label>
            <div className="relative flex items-center">
                {Icon && <Icon className="absolute right-3 size-4 text-muted-foreground/50 pointer-events-none" />}
                <input id={id} type={isPassword ? (show ? "text" : "password") : type}
                    value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "w-full bg-muted/20 border rounded-xl py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all",
                        error ? "border-red-500 ring-4 ring-red-500/10" : "border-border/50 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15",
                        Icon ? "pr-10 pl-4" : "px-4",
                        disabled && "opacity-50 cursor-not-allowed select-none"
                    )} dir="rtl" />
                {isPassword && (
                    <button type="button" onClick={() => setShow(!show)} tabIndex={-1}
                        disabled={disabled}
                        className="absolute left-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                )}
            </div>
            {error && <motion.p initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] font-bold text-red-500 mt-1">{error}</motion.p>}
        </div>
    );
}

import { Activity } from "lucide-react";

export function AuthSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden" dir="rtl">
            
            {/* Left Branding Skeleton */}
            <div className="lg:w-[42%] xl:w-[45%] h-full shrink-0 hidden lg:block bg-[#052c24] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" 
                    style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
                
                {/* Moving Shimmer Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                <div className="relative flex flex-col justify-between h-full p-10 xl:p-14 z-10">
                    {/* Logo Skeleton */}
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/10 flex items-center justify-center">
                            <Activity className="size-5 text-emerald-500/40" />
                        </div>
                        <div className="h-5 w-24 bg-emerald-500/20 rounded-lg" />
                    </div>

                    {/* Middle content Skeleton */}
                    <div className="space-y-6">
                        <div className="h-7 w-40 bg-emerald-500/20 rounded-full" />
                        <div className="space-y-4">
                            <div className="h-12 w-80 bg-emerald-500/20 rounded-2xl" />
                            <div className="h-10 w-64 bg-emerald-500/20 rounded-2xl" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="h-3 w-72 bg-emerald-500/10 rounded-lg" />
                            <div className="h-3 w-60 bg-emerald-500/10 rounded-lg" />
                        </div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="h-3 w-40 bg-emerald-500/10 rounded-lg" />
                </div>
            </div>

            {/* Right Side Skeleton (Form) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                <div className="w-full max-w-md space-y-10">
                    {/* Moving Shimmer for Right Side */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] dark:via-white/5" />

                    {/* Header Skeleton */}
                    <div className="space-y-3 relative">
                        <div className="h-10 w-56 bg-muted/60 rounded-xl" />
                        <div className="h-4 w-72 bg-muted/40 rounded-lg" />
                    </div>

                    {/* Form Skeleton */}
                    <div className="space-y-6 relative">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-3">
                                <div className="h-4 w-24 bg-muted/40 rounded-lg" />
                                <div className="h-14 w-full bg-muted/30 rounded-2xl border border-muted/50" />
                            </div>
                        ))}
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-14 w-full bg-emerald-500/20 rounded-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    {/* Footer Text Skeleton */}
                    <div className="h-4 w-48 bg-muted/40 rounded-lg mx-auto" />
                </div>
            </div>
        </div>
    );
}

export default function AuthLoading() {
    return <AuthSkeleton />;
}

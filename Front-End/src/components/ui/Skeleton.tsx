export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`
                relative overflow-hidden bg-muted/70 rounded-lg 
                before:absolute before:inset-0
                before:-translate-x-full
                before:animate-[shimmer_2s_infinite]
                before:bg-linear-to-r
                before:from-transparent before:via-muted-foreground/10 before:to-transparent
                ${className}
            `}
        />
    );
}

export function SkeletonCard({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-card p-6 rounded-2xl border border-border/50 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

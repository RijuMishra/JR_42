/**
 * Skeleton Loader Component
 * Provides a localized shimmering pulse effect for loading states.
 */
export default function Skeleton({ className, circle = false, width, height }) {
    return (
        <div
            className={`relative overflow-hidden bg-slate-800/50 animate-pulse-slow ${className}`}
            style={{
                borderRadius: circle ? '9999px' : '0.75rem',
                width: width || '100%',
                height: height || '1rem',
            }}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>
    );
}

// Add the custom shimmer keyframe to your tailwind.config if not present,
// but for standard utility usage, we can also use CSS-in-JS or just the pulse.
// For Kaizen, we'll ensure the shimmer is handled in index.css.

import { Link } from "react-router-dom";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

            <div className="relative text-center space-y-8 max-w-lg">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 animate-float shadow-2xl shadow-indigo-500/10">
                        <Ghost size={48} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-white tracking-tighter">404</h2>
                    <h3 className="text-xl font-bold text-slate-300">Lost in the Matrix?</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        The page you're searching for seems to have vanished into the inventory void.
                        Perhaps it was never mapped, or it's hiding in the Danger Zone.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        to="/dashboard"
                        className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 group"
                    >
                        <Home size={18} className="group-hover:scale-110 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary flex-1 py-4 flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                </div>

                <div className="pt-8 opacity-20">
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase italic">
                        Ref ID: KAIZEN_VOID_404
                    </p>
                </div>
            </div>
        </div>
    );
}

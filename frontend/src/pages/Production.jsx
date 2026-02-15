import { useState, useEffect } from "react";
import {
    Factory,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
    Package,
    History
} from "lucide-react";
import API from "../api";

export default function Production() {
    const [loading, setLoading] = useState(false);
    const [pcbs, setPcbs] = useState([]);
    const [pcbId, setPcbId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [recentEntries, setRecentEntries] = useState([]);

    useEffect(() => {
        API.get("/pcbs")
            .then(res => setPcbs(res.data || []))
            .catch(err => {
                console.error("Fetch pcbs error:", err);
                // Fallback mock
                setPcbs([{ id: 1, pcb_name: "Power Module v1" }, { id: 2, pcb_name: "Control Board v3" }]);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pcbId) return;

        setLoading(true);
        setStatus(null);

        try {
            const res = await API.post("/production", { pcb_id: Number(pcbId), quantity: Number(quantity) });
            const selectedPcbName = pcbs.find(p => p.id == pcbId)?.pcb_name || "Unknown PCB";

            // Add to recent entries locally for better UX
            setRecentEntries([
                { id: Date.now(), pcb_name: selectedPcbName, quantity, timestamp: new Date().toLocaleTimeString() },
                ...recentEntries
            ].slice(0, 5));

            setStatus({ type: 'success', message: res.data.message || "Production entry successful! Stock deducted." });
            setQuantity(1);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.error || "Insufficient stock or production failed. Please check inventory."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Entry Form */}
                <div className="lg:col-span-3 glass-card overflow-hidden h-fit">
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/10 p-8 border-b border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg border border-indigo-500/20">
                                <Factory size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Production Entry</h2>
                                <p className="text-slate-400 text-sm mt-1">Deduct stock automatically.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest text-[10px]">Target PCB Model</label>
                                <select
                                    required
                                    className="input-field py-3.5"
                                    value={pcbId}
                                    onChange={e => setPcbId(e.target.value)}
                                >
                                    <option value="">Select a PCB model...</option>
                                    {pcbs.map(pcb => (
                                        <option key={pcb.id} value={pcb.id}>{pcb.pcb_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest text-[10px]">Units Produced</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="input-field pl-12 py-3.5"
                                        placeholder="Enter quantity"
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 animate-slide-up border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <span className="text-sm font-medium">{status.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !pcbId}
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={22} /> Confirm Production</>}
                        </button>
                    </form>
                </div>

                {/* Right Side: Process and History */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ArrowRight size={14} className="text-indigo-400" />
                            System Logic
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                Validates BOM requirements
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                Dedicts stock from inventory
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                Records consumption history
                            </li>
                        </ul>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <History size={14} className="text-slate-400" />
                                Recent Activity
                            </h4>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-700/30">
                                    {recentEntries.length > 0 ? recentEntries.map((log) => (
                                        <tr key={log.id} className="table-row-hover animate-slide-in">
                                            <td className="px-5 py-3">
                                                <p className="text-xs font-bold text-white leading-tight">{log.pcb_name}</p>
                                                <p className="text-[9px] text-slate-500 font-medium">{log.timestamp}</p>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="text-xs font-black text-indigo-400">+{log.quantity} units</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td className="px-5 py-10 text-center text-slate-600 italic text-[11px]">
                                                No entries this session.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import {
    FileSpreadsheet,
    Upload,
    Download,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileText,
    ArrowRight
} from "lucide-react";
import API from "../api";

export default function ImportExport() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus(null);
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await API.post("/import/components", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setStatus({
                type: 'success',
                message: `Import successful! ${res.data.inserted || 0} items processed.`
            });
            setFile(null);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.error || "Failed to import file. Please check Excel format."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        // For demo purposes, we'll try to trigger a download window
        window.location.href = "https://jr-42.onrender.com/api/export/components";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Import Card */}
                <div className="glass-card overflow-hidden h-full flex flex-col">
                    <div className="p-8 border-b border-slate-700/50 bg-indigo-500/5">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight">Bulk Import</h3>
                        <p className="text-slate-400 text-sm mt-1">Upload component dataset (.xlsx)</p>
                    </div>

                    <form onSubmit={handleImport} className="p-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                            <label className="block">
                                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-600'
                                    }`}>
                                    <div className="space-y-1 text-center">
                                        <FileSpreadsheet className={`mx-auto h-12 w-12 ${file ? 'text-indigo-400' : 'text-slate-500'}`} />
                                        <div className="flex text-sm text-slate-400">
                                            <span className="relative cursor-pointer font-medium text-indigo-400 hover:text-indigo-300">
                                                {file ? file.name : 'Click to select Excel'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Only .xlsx or .csv up to 10MB</p>
                                    </div>
                                    <input type="file" className="sr-only" onChange={handleFileChange} />
                                </div>
                            </label>

                            {status && (
                                <div className={`p-3.5 rounded-xl flex items-center gap-3 animate-slide-up border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span className="text-xs font-medium">{status.message}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="btn-primary w-full mt-8 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Upload size={18} /> Process Import</>}
                        </button>
                    </form>
                </div>

                {/* Export Card */}
                <div className="glass-card overflow-hidden h-full flex flex-col">
                    <div className="p-8 border-b border-slate-700/50 bg-purple-500/5">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                            <Download size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight">Data Export</h3>
                        <p className="text-slate-400 text-sm mt-1">Download full inventory report</p>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
                                    <FileText size={14} /> Included in Export
                                </h4>
                                <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={10} className="text-purple-400" />
                                        Full Component List & Part Codes
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={10} className="text-purple-400" />
                                        Current Stock & Required Quantities
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={10} className="text-purple-400" />
                                        Shortage Status & Priority Flags
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={handleExport}
                            className="btn-secondary w-full mt-8 py-3.5 flex items-center justify-center gap-2"
                        >
                            <Download size={18} />
                            Generate Report (.xlsx)
                        </button>
                    </div>
                </div>
            </div>

            {/* Guide Note */}
            <div className="p-6 glass-card border-slate-700/30">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-indigo-400" />
                    Format Requirement
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    The Import tool expects columns: <strong>part_code</strong>, <strong>component</strong>, <strong>current_stock</strong>, and <strong>monthly_required_quantity</strong>. Existing records with matching part codes will be automatically updated with new stock values.
                </p>
            </div>
        </div>
    );
}

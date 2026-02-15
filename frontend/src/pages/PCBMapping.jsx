import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    CircuitBoard,
    Package,
    Search,
    Loader2,
    AlertCircle
} from "lucide-react";
import API from "../api";

export default function PCBMapping() {
    const [loading, setLoading] = useState(true);
    const [pcbs, setPcbs] = useState([]);
    const [selectedPcb, setSelectedPcb] = useState("");
    const [components, setComponents] = useState([]);
    const [currentMapping, setCurrentMapping] = useState([]);

    const [newMapping, setNewMapping] = useState({
        component_id: "",
        quantity_required: 1
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch PCBs and Available Components
            // Backend stubs for /pcbs and /components
            const [pcbRes, compRes] = await Promise.all([
                API.get("/pcbs"),
                API.get("/analytics/shortage")
            ]);
            setPcbs(pcbRes.data || []);
            setComponents(compRes.data || []);

            if (pcbRes.data?.length > 0) {
                setSelectedPcb(pcbRes.data[0].id);
            }
        } catch (err) {
            console.error("Fetch mapping error:", err);
            // Fallback mocks for UI demo
            if (pcbs.length === 0) {
                setPcbs([{ id: 1, pcb_name: "Power Module v1" }, { id: 2, pcb_name: "Control Board v3" }]);
                setSelectedPcb(1);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedPcb) {
            // Fetch components for this PCB
            API.get(`/pcbs/${selectedPcb}/components`)
                .then(res => setCurrentMapping(res.data || []))
                .catch(err => {
                    console.error("Fetch pcb components error:", err);
                    setCurrentMapping([]);
                });
        }
    }, [selectedPcb]);

    const handleAddMapping = async () => {
        if (!newMapping.component_id) return;
        try {
            await API.post(`/pcbs/${selectedPcb}/components`, newMapping);
            // Refresh
            const res = await API.get(`/pcbs/${selectedPcb}/components`);
            setCurrentMapping(res.data || []);
            setNewMapping({ component_id: "", quantity_required: 1 });
        } catch (err) {
            console.error("Add mapping error:", err);
        }
    };

    const handleRemoveMapping = async (componentId) => {
        try {
            await API.delete(`/pcbs/${selectedPcb}/components/${componentId}`);
            setCurrentMapping(currentMapping.filter(m => m.component_id !== componentId));
        } catch (err) {
            console.error("Remove mapping error:", err);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Selector and Adder */}
            <div className="lg:col-span-1 space-y-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CircuitBoard size={20} className="text-indigo-400" />
                        Select PCB
                    </h3>
                    <select
                        className="input-field transition-all mb-4"
                        value={selectedPcb}
                        onChange={(e) => setSelectedPcb(e.target.value)}
                    >
                        {pcbs.map(pcb => (
                            <option key={pcb.id} value={pcb.id}>{pcb.pcb_name}</option>
                        ))}
                    </select>
                    <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                        <p className="text-xs text-slate-400">
                            Configure the Bill of Materials (BOM) for the selected PCB. Define how many units of each component are required.
                        </p>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-emerald-400" />
                        Add Component to PCB
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Component</label>
                            <select
                                className="input-field"
                                value={newMapping.component_id}
                                onChange={e => setNewMapping({ ...newMapping, component_id: e.target.value })}
                            >
                                <option value="">Choose Component...</option>
                                {components.map(comp => (
                                    <option key={comp.id} value={comp.id}>{comp.component_name} ({comp.part_code})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Quantity per PCB</label>
                            <input
                                type="number"
                                min="1"
                                className="input-field"
                                value={newMapping.quantity_required}
                                onChange={e => setNewMapping({ ...newMapping, quantity_required: Number(e.target.value) })}
                            />
                        </div>
                        <button
                            onClick={handleAddMapping}
                            disabled={!newMapping.component_id}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Add to Mapping
                        </button>
                    </div>
                </div>
            </div>

            {/* Mapping Table */}
            <div className="lg:col-span-2">
                <div className="glass-card h-full flex flex-col">
                    <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Package size={18} className="text-indigo-400" />
                            BOM for {pcbs.find(p => p.id == selectedPcb)?.pcb_name || "Selection"}
                        </h3>
                        <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">
                            {currentMapping.length} Components
                        </span>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900/30">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Component</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Part Code</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Required Qty</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 text-sm">
                                {currentMapping.length > 0 ? (
                                    currentMapping.map((item) => (
                                        <tr key={item.id} className="table-row-hover">
                                            <td className="px-6 py-4 text-white font-medium">{item.component_name}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono">{item.part_code}</td>
                                            <td className="px-6 py-4 text-center font-bold text-indigo-400">{item.quantity_required}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRemoveMapping(item.component_id)}
                                                    className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-slate-500">
                                            <CircuitBoard size={40} className="mx-auto mb-4 opacity-10" />
                                            <p className="italic">No components mapped to this PCB yet.</p>
                                            <p className="text-xs mt-1">Add components from the left panel to build the BOM.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
